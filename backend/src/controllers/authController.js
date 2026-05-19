import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";
import { createAuditLog } from "../services/auditService.js";

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, title, managerId } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already registered.", 409);

  const user = await User.create({
    name,
    email,
    password,
    role: role || "employee",
    department,
    title,
    managerId: managerId || null,
  });

  await createAuditLog({
    action: "USER_REGISTERED",
    changedBy: user._id,
    targetType: "User",
    targetId: user._id,
    details: `New ${user.role} account created: ${user.email}`,
  });

  const token = signToken({ userId: user._id, role: user.role, email: user.email });

  sendResponse(res, 201, "Registration successful", { token, user });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password (it's excluded by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password.", 401);

  const token = signToken({ userId: user._id, role: user.role, email: user.email });

  // Strip password before sending
  const userData = user.toJSON();

  sendResponse(res, 200, "Login successful", { token, user: userData });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("managerId", "name email title");
  sendResponse(res, 200, "Current user", user);
});
