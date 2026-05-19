import CheckIn from "../models/CheckIn.js";
import Goal from "../models/Goal.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";
import { createAuditLog } from "../services/auditService.js";

// POST /api/checkins
export const createCheckIn = asyncHandler(async (req, res) => {
  const { goalId, plannedValue, actualValue, status, comment, quarter } = req.body;

  const goal = await Goal.findById(goalId);
  if (!goal) throw new AppError("Goal not found.", 404);

  // Only the goal owner can submit check-ins
  if (goal.employeeId.toString() !== req.user._id.toString()) {
    throw new AppError("Access denied.", 403);
  }

  if (goal.isLocked) throw new AppError("Goal is locked. Cannot submit check-in.", 403);

  const checkIn = await CheckIn.create({
    goalId,
    employeeId: req.user._id,
    plannedValue,
    actualValue,
    status: status || "not_started",
    comment,
    quarter,
  });

  // Update goal's actual value
  goal.actual = actualValue;
  await goal.save();

  await createAuditLog({
    action: "CHECKIN_SUBMITTED",
    changedBy: req.user._id,
    targetType: "CheckIn",
    targetId: checkIn._id,
    newValue: { actualValue, status, quarter },
    details: `Check-in submitted for goal "${goal.title}" by ${req.user.email}`,
  });

  sendResponse(res, 201, "Check-in submitted", checkIn);
});

// GET /api/checkins
export const getCheckIns = asyncHandler(async (req, res) => {
  const { quarter, goalId } = req.query;
  const { role, _id: userId } = req.user;

  const filter = {};
  if (quarter) filter.quarter = quarter;
  if (goalId) filter.goalId = goalId;

  // Employees only see their own check-ins
  if (role === "employee") filter.employeeId = userId;

  const checkIns = await CheckIn.find(filter)
    .populate("goalId", "title uomType target")
    .populate("employeeId", "name email")
    .sort({ submittedAt: -1 });

  sendResponse(res, 200, "Check-ins fetched", checkIns);
});

// PATCH /api/checkins/:id
export const updateCheckIn = asyncHandler(async (req, res) => {
  const checkIn = await CheckIn.findById(req.params.id);
  if (!checkIn) throw new AppError("Check-in not found.", 404);

  const isOwner = checkIn.employeeId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") throw new AppError("Access denied.", 403);

  const goal = await Goal.findById(checkIn.goalId);
  if (goal?.isLocked) throw new AppError("Goal is locked.", 403);

  Object.assign(checkIn, req.body);
  await checkIn.save();

  // Sync actual on goal if actualValue changed
  if (req.body.actualValue !== undefined && goal) {
    goal.actual = req.body.actualValue;
    await goal.save();
  }

  sendResponse(res, 200, "Check-in updated", checkIn);
});
