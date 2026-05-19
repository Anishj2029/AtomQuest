import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      // e.g. "GOAL_CREATED", "GOAL_APPROVED", "GOAL_UNLOCKED", "CHECKIN_SUBMITTED"
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Goal", "User", "GoalCycle", "CheckIn"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    details: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Audit logs are immutable — disable updates
    timestamps: false,
  }
);

auditLogSchema.index({ changedBy: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
