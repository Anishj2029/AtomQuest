import Notification from "../models/Notification.js";

/**
 * Creates an in-app notification for a user.
 *
 * @param {object} params
 * @param {ObjectId} params.userId
 * @param {string}   params.title
 * @param {string}   params.message
 * @param {string}   params.type    - "goal" | "checkin" | "approval" | "system"
 * @param {ObjectId} params.relatedId - optional reference
 */
export const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
  relatedId = null,
}) => {
  try {
    await Notification.create({ userId, title, message, type, relatedId });
  } catch (err) {
    console.error("Notification creation failed:", err.message);
  }
};
