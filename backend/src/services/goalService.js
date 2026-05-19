import Goal from "../models/Goal.js";
import AppError from "../utils/AppError.js";

const MAX_GOALS = 8;
const MIN_WEIGHTAGE = 10;

/**
 * Validates that adding a new goal won't exceed the 8-goal limit.
 */
export const checkGoalLimit = async (employeeId, quarter, excludeId = null) => {
  const query = { employeeId, quarter };
  if (excludeId) query._id = { $ne: excludeId };

  const count = await Goal.countDocuments(query);
  if (count >= MAX_GOALS) {
    throw new AppError(
      `Maximum of ${MAX_GOALS} goals allowed per employee per quarter.`,
      400
    );
  }
};

/**
 * Validates that total weightage across all goals for an employee/quarter = 100%.
 * Call this after creating/updating a goal.
 *
 * @param {ObjectId} employeeId
 * @param {string}   quarter
 * @param {number}   incomingWeightage  - weightage of the goal being saved
 * @param {ObjectId} excludeId          - goal being updated (exclude from sum)
 */
export const validateTotalWeightage = async (
  employeeId,
  quarter,
  incomingWeightage,
  excludeId = null
) => {
  const query = { employeeId, quarter };
  if (excludeId) query._id = { $ne: excludeId };

  const goals = await Goal.find(query).select("weightage");
  const existingTotal = goals.reduce((sum, g) => sum + g.weightage, 0);
  const newTotal = existingTotal + incomingWeightage;

  if (newTotal > 100) {
    throw new AppError(
      `Total weightage would be ${newTotal}%. It cannot exceed 100%.`,
      400
    );
  }
};

/**
 * Validates weightage is at least the minimum.
 */
export const validateMinWeightage = (weightage) => {
  if (weightage < MIN_WEIGHTAGE) {
    throw new AppError(
      `Minimum weightage per goal is ${MIN_WEIGHTAGE}%.`,
      400
    );
  }
};

/**
 * Validates total weightage equals exactly 100% on submission.
 */
export const validateWeightageOnSubmit = async (employeeId, quarter) => {
  const goals = await Goal.find({ employeeId, quarter }).select("weightage");
  if (goals.length === 0) {
    throw new AppError("No goals found to submit.", 400);
  }
  const total = goals.reduce((sum, g) => sum + g.weightage, 0);
  if (total !== 100) {
    throw new AppError(
      `Total weightage is ${total}%. It must equal exactly 100% before submission.`,
      400
    );
  }
};
