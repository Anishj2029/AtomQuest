import AuditLog from "../models/AuditLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";

// GET /api/auditlogs  (admin only)
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { targetType, action, page = 1, limit = 50 } = req.query;
  const filter = {};

  if (targetType) filter.targetType = targetType;
  if (action) filter.action = action;

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("changedBy", "name email role")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit)),
    AuditLog.countDocuments(filter),
  ]);

  sendResponse(res, 200, "Audit logs fetched", {
    logs,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
