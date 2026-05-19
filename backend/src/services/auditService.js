import AuditLog from "../models/AuditLog.js";

/**
 * Creates an immutable audit log entry.
 *
 * @param {object} params
 * @param {string} params.action       - e.g. "GOAL_APPROVED"
 * @param {ObjectId} params.changedBy  - User who performed the action
 * @param {string} params.targetType   - "Goal" | "User" | "GoalCycle" | "CheckIn"
 * @param {ObjectId} params.targetId   - ID of the affected document
 * @param {*} params.oldValue          - Previous state (optional)
 * @param {*} params.newValue          - New state (optional)
 * @param {string} params.details      - Human-readable description
 */
export const createAuditLog = async ({
  action,
  changedBy,
  targetType,
  targetId,
  oldValue = null,
  newValue = null,
  details = "",
}) => {
  try {
    await AuditLog.create({
      action,
      changedBy,
      targetType,
      targetId,
      oldValue,
      newValue,
      details,
    });
  } catch (err) {
    // Audit log failure should never crash the main request
    console.error("Audit log creation failed:", err.message);
  }
};
