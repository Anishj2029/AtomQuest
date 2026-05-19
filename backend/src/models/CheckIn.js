import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plannedValue: {
      type: Number,
      required: true,
      min: 0,
    },
    actualValue: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["not_started", "on_track", "completed", "at_risk"],
      default: "not_started",
    },
    comment: {
      type: String,
      default: "",
      trim: true,
    },
    quarter: {
      type: String,
      required: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

checkInSchema.index({ goalId: 1, quarter: 1 });
checkInSchema.index({ employeeId: 1, quarter: 1 });

const CheckIn = mongoose.model("CheckIn", checkInSchema);
export default CheckIn;
