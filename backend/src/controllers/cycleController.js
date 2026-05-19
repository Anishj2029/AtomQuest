import GoalCycle from "../models/GoalCycle.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";
import { createAuditLog } from "../services/auditService.js";

// GET /api/cycles
export const getCycles = asyncHandler(async (req, res) => {
  const cycles = await GoalCycle.find()
    .populate("createdBy", "name email")
    .sort({ startDate: -1 });
  sendResponse(res, 200, "Cycles fetched", cycles);
});

// POST /api/cycles  (admin only)
export const createCycle = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, status } = req.body;

  const cycle = await GoalCycle.create({
    name,
    startDate,
    endDate,
    status: status || "upcoming",
    createdBy: req.user._id,
  });

  await createAuditLog({
    action: "CYCLE_CREATED",
    changedBy: req.user._id,
    targetType: "GoalCycle",
    targetId: cycle._id,
    newValue: { name, startDate, endDate },
    details: `Goal cycle "${name}" created by ${req.user.email}`,
  });

  sendResponse(res, 201, "Cycle created", cycle);
});

// PATCH /api/cycles/:id  (admin only)
export const updateCycle = asyncHandler(async (req, res) => {
  const cycle = await GoalCycle.findById(req.params.id);
  if (!cycle) throw new AppError("Cycle not found.", 404);

  const oldStatus = cycle.status;
  Object.assign(cycle, req.body);
  await cycle.save();

  await createAuditLog({
    action: "CYCLE_UPDATED",
    changedBy: req.user._id,
    targetType: "GoalCycle",
    targetId: cycle._id,
    oldValue: { status: oldStatus },
    newValue: { status: cycle.status },
    details: `Cycle "${cycle.name}" updated by ${req.user.email}`,
  });

  sendResponse(res, 200, "Cycle updated", cycle);
});
