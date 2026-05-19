import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoalCycle",
      default: null,
    },
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    uomType: {
      type: String,
      required: [true, "Unit of measure is required"],
      trim: true,
    },
    target: {
      type: Number,
      required: [true, "Target value is required"],
      min: 0,
    },
    actual: {
      type: Number,
      default: 0,
      min: 0,
    },
    weightage: {
      type: Number,
      required: [true, "Weightage is required"],
      min: [10, "Minimum weightage is 10%"],
      max: 100,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "pending_approval",
        "approved",
        "rejected",
        "on_track",
        "completed",
        "locked",
      ],
      default: "draft",
    },
    quarter: {
      type: String,
      required: true,
      trim: true,
    },
    comments: {
      type: String,
      default: "",
    },
    managerFeedback: {
      type: String,
      default: "",
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isSharedGoal: {
      type: Boolean,
      default: false,
    },
    sharedGoalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for fast employee+quarter queries
goalSchema.index({ employeeId: 1, quarter: 1 });
goalSchema.index({ managerId: 1, status: 1 });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
