import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";

// GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  sendResponse(res, 200, "Notifications fetched", notifications);
});

// PATCH /api/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new AppError("Notification not found.", 404);

  if (notification.userId.toString() !== req.user._id.toString()) {
    throw new AppError("Access denied.", 403);
  }

  notification.isRead = true;
  await notification.save();

  sendResponse(res, 200, "Notification marked as read", notification);
});

// PATCH /api/notifications/read-all  (mark all as read for current user)
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true }
  );
  sendResponse(res, 200, "All notifications marked as read");
});
