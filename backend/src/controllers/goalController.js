import Goal from "../models/Goal.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";
import { createAuditLog } from "../services/auditService.js";
import { createNotification } from "../services/notificationService.js";
import {
  checkGoalLimit,
  validateTotalWeightage,
  validateMinWeightage,
  validateWeightageOnSubmit,
} from "../services/goalService.js";

// POST /api/goals
export const createGoal = asyncHandler(async (req, res) => {
  const employeeId = req.user._id;
  const { title, description, uomType, target, weightage, quarter, cycleId } = req.body;

  validateMinWeightage(weightage);
  await checkGoalLimit(employeeId, quarter);
  await validateTotalWeightage(employeeId, quarter, weightage);

  const goal = await Goal.create({
    employeeId,
    managerId: req.user.managerId || null,
    cycleId: cycleId || null,
    title,
    description,
    uomType,
    target,
    weightage,
    quarter,
  });

  await createAuditLog({
    action: "GOAL_CREATED",
    changedBy: employeeId,
    targetType: "Goal",
    targetId: goal._id,
    newValue: { title, weightage, quarter },
    details: `Goal "${title}" created by ${req.user.email}`,
  });

  sendResponse(res, 201, "Goal created", goal);
});

// GET /api/goals
export const getGoals = asyncHandler(async (req, res) => {
  const { role, _id: userId, managerId } = req.user;
  const { quarter, status } = req.query;

  let filter = {};
  if (quarter) filter.quarter = quarter;
  if (status) filter.status = status;

  if (role === "employee") {
    filter.employeeId = userId;
  } else if (role === "manager") {
    // Manager sees their direct reports' goals
    filter.managerId = userId;
  }
  // Admin sees all goals (no extra filter)

  const goals = await Goal.find(filter)
    .populate("employeeId", "name email department title")
    .populate("managerId", "name email")
    .sort({ createdAt: -1 });

  sendResponse(res, 200, "Goals fetched", goals);
});

// GET /api/goals/:id
export const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)
    .populate("employeeId", "name email department title")
    .populate("managerId", "name email");

  if (!goal) throw new AppError("Goal not found.", 404);

  // Access control
  const { role, _id: userId } = req.user;
  const isOwner = goal.employeeId._id.toString() === userId.toString();
  const isManager = role === "manager" && goal.managerId?._id.toString() === userId.toString();
  const isAdmin = role === "admin";

  if (!isOwner && !isManager && !isAdmin) {
    throw new AppError("Access denied.", 403);
  }

  sendResponse(res, 200, "Goal fetched", goal);
});

// PATCH /api/goals/:id
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) throw new AppError("Goal not found.", 404);

  // Locked goals cannot be edited
  if (goal.isLocked) throw new AppError("Goal is locked and cannot be edited.", 403);

  const { role, _id: userId } = req.user;
  const isOwner = goal.employeeId.toString() === userId.toString();
  const isManager = role === "manager";
  const isAdmin = role === "admin";
  const isManagerOfGoal = goal.managerId?.toString() === userId.toString();

  // Employees can only edit draft goals
  if (isOwner && !isManager && !isAdmin && goal.status !== "draft") {
    throw new AppError("Only draft goals can be edited by employees.", 403);
  }

  if (!isOwner && !isAdmin && !(isManager && isManagerOfGoal)) {
    throw new AppError("Access denied.", 403);
  }

  const oldValues = { title: goal.title, weightage: goal.weightage, status: goal.status };

  // Re-validate weightage if it's changing
  if (req.body.weightage !== undefined) {
    validateMinWeightage(req.body.weightage);
    await validateTotalWeightage(
      goal.employeeId,
      goal.quarter,
      req.body.weightage,
      goal._id
    );
  }

  Object.assign(goal, req.body);
  await goal.save();

  await createAuditLog({
    action: "GOAL_UPDATED",
    changedBy: userId,
    targetType: "Goal",
    targetId: goal._id,
    oldValue: oldValues,
    newValue: { title: goal.title, weightage: goal.weightage, status: goal.status },
    details: `Goal "${goal.title}" updated by ${req.user.email}`,
  });

  sendResponse(res, 200, "Goal updated", goal);
});

// DELETE /api/goals/:id  (employee can delete own draft goals)
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) throw new AppError("Goal not found.", 404);

  const isOwner = goal.employeeId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") throw new AppError("Access denied.", 403);
  if (goal.status !== "draft") throw new AppError("Only draft goals can be deleted.", 400);

  await goal.deleteOne();

  await createAuditLog({
    action: "GOAL_DELETED",
    changedBy: req.user._id,
    targetType: "Goal",
    targetId: goal._id,
    details: `Goal "${goal.title}" deleted`,
  });

  sendResponse(res, 200, "Goal deleted");
});

// POST /api/goals/:id/submit
export const submitGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) throw new AppError("Goal not found.", 404);

  const isOwner = goal.employeeId.toString() === req.user._id.toString();
  if (!isOwner) throw new AppError("Access denied.", 403);
  if (goal.status !== "draft") throw new AppError("Only draft goals can be submitted.", 400);
  if (goal.isLocked) throw new AppError("Goal is locked.", 403);

  // Validate total weightage = 100% before submission
  await validateWeightageOnSubmit(goal.employeeId, goal.quarter);

  goal.status = "pending_approval";
  await goal.save();

  // Notify manager
  if (goal.managerId) {
    await createNotification({
      userId: goal.managerId,
      title: "New Goal Submission",
      message: `${req.user.name} submitted a goal for approval: "${goal.title}"`,
      type: "approval",
      relatedId: goal._id,
    });
  }

  await createAuditLog({
    action: "GOAL_SUBMITTED",
    changedBy: req.user._id,
    targetType: "Goal",
    targetId: goal._id,
    oldValue: { status: "draft" },
    newValue: { status: "pending_approval" },
    details: `Goal "${goal.title}" submitted for approval`,
  });

  sendResponse(res, 200, "Goal submitted for approval", goal);
});

// POST /api/goals/:id/approve  (manager only)
export const approveGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) throw new AppError("Goal not found.", 404);
  if (goal.status !== "pending_approval") {
    throw new AppError("Only pending goals can be approved.", 400);
  }

  if (req.user.role === "manager" && goal.managerId?.toString() !== req.user._id.toString()) {
    throw new AppError("Access denied. You can only approve goals for your direct reports.", 403);
  }

  const { feedback } = req.body;
  goal.status = "approved";
  if (feedback) goal.managerFeedback = feedback;
  await goal.save();

  // Notify employee
  await createNotification({
    userId: goal.employeeId,
    title: "Goal Approved",
    message: `Your goal "${goal.title}" has been approved.`,
    type: "approval",
    relatedId: goal._id,
  });

  await createAuditLog({
    action: "GOAL_APPROVED",
    changedBy: req.user._id,
    targetType: "Goal",
    targetId: goal._id,
    oldValue: { status: "pending_approval" },
    newValue: { status: "approved" },
    details: `Goal "${goal.title}" approved by ${req.user.email}`,
  });

  sendResponse(res, 200, "Goal approved", goal);
});

// POST /api/goals/:id/reject  (manager only)
export const rejectGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) throw new AppError("Goal not found.", 404);
  if (goal.status !== "pending_approval") {
    throw new AppError("Only pending goals can be rejected.", 400);
  }

  if (req.user.role === "manager" && goal.managerId?.toString() !== req.user._id.toString()) {
    throw new AppError("Access denied. You can only reject goals for your direct reports.", 403);
  }

  const { feedback } = req.body;
  if (!feedback) throw new AppError("Rejection reason (feedback) is required.", 400);

  goal.status = "rejected";
  goal.managerFeedback = feedback;
  await goal.save();

  // Notify employee
  await createNotification({
    userId: goal.employeeId,
    title: "Goal Rejected",
    message: `Your goal "${goal.title}" was rejected. Feedback: ${feedback}`,
    type: "approval",
    relatedId: goal._id,
  });

  await createAuditLog({
    action: "GOAL_REJECTED",
    changedBy: req.user._id,
    targetType: "Goal",
    targetId: goal._id,
    oldValue: { status: "pending_approval" },
    newValue: { status: "rejected", feedback },
    details: `Goal "${goal.title}" rejected by ${req.user.email}`,
  });

  sendResponse(res, 200, "Goal rejected", goal);
});

// POST /api/goals/:id/unlock  (admin only)
export const unlockGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) throw new AppError("Goal not found.", 404);

  goal.isLocked = false;
  if (goal.status === "locked") goal.status = "approved";
  await goal.save();

  // Notify employee
  await createNotification({
    userId: goal.employeeId,
    title: "Goal Unlocked",
    message: `Your goal "${goal.title}" has been unlocked by an admin.`,
    type: "system",
    relatedId: goal._id,
  });

  await createAuditLog({
    action: "GOAL_UNLOCKED",
    changedBy: req.user._id,
    targetType: "Goal",
    targetId: goal._id,
    oldValue: { isLocked: true },
    newValue: { isLocked: false },
    details: `Goal "${goal.title}" unlocked by admin ${req.user.email}`,
  });

  sendResponse(res, 200, "Goal unlocked", goal);
});
