import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";
import { createAuditLog } from "../services/auditService.js";

// GET /api/users  (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, department, search } = req.query;
  const filter = { isActive: true };

  if (role) filter.role = role;
  if (department) filter.department = department;
  if (search) filter.name = { $regex: search, $options: "i" };

  const users = await User.find(filter)
    .populate("managerId", "name email")
    .sort({ createdAt: -1 });

  sendResponse(res, 200, "Users fetched", users);
});

// GET /api/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("managerId", "name email title");
  if (!user) throw new AppError("User not found.", 404);

  // Employees can only view their own profile
  if (req.user.role === "employee" && req.user._id.toString() !== req.params.id) {
    throw new AppError("Access denied.", 403);
  }

  sendResponse(res, 200, "User fetched", user);
});

// PATCH /api/users/:id  (admin or self)
export const updateUser = asyncHandler(async (req, res) => {
  const isSelf = req.user._id.toString() === req.params.id;
  const isAdmin = req.user.role === "admin";

  if (!isSelf && !isAdmin) throw new AppError("Access denied.", 403);

  // Only admins can change roles
  if (req.body.role && !isAdmin) {
    throw new AppError("Only admins can change user roles.", 403);
  }

  // Prevent password update through this endpoint
  delete req.body.password;

  const oldUser = await User.findById(req.params.id);
  if (!oldUser) throw new AppError("User not found.", 404);

  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await createAuditLog({
    action: "USER_UPDATED",
    changedBy: req.user._id,
    targetType: "User",
    targetId: updated._id,
    oldValue: { role: oldUser.role, department: oldUser.department },
    newValue: { role: updated.role, department: updated.department },
    details: `User ${updated.email} updated by ${req.user.email}`,
  });

  sendResponse(res, 200, "User updated", updated);
});
