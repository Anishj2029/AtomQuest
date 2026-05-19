import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

/**
 * Verifies JWT from Authorization header.
 * Attaches decoded user document to req.user.
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please log in.", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AppError("Invalid or expired token. Please log in again.", 401);
  }

  // Confirm user still exists in DB
  const user = await User.findById(decoded.userId).select("-password");
  if (!user || !user.isActive) {
    throw new AppError("User no longer exists or has been deactivated.", 401);
  }

  req.user = user;
  next();
});

export default authMiddleware;
