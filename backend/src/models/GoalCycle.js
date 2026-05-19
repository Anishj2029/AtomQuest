import mongoose from "mongoose";

const goalCycleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cycle name is required"],
      trim: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "closed"],
      default: "upcoming",
    },
    participants: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Validate endDate > startDate
goalCycleSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

const GoalCycle = mongoose.model("GoalCycle", goalCycleSchema);
export default GoalCycle;
