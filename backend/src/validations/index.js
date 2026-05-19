import { body, param } from "express-validator";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["employee", "manager", "admin"])
    .withMessage("Invalid role"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// ─── Goals ───────────────────────────────────────────────────────────────────

export const createGoalValidation = [
  body("title").trim().notEmpty().withMessage("Goal title is required"),
  body("uomType").trim().notEmpty().withMessage("Unit of measure is required"),
  body("target")
    .isNumeric()
    .withMessage("Target must be a number")
    .custom((v) => v >= 0)
    .withMessage("Target must be non-negative"),
  body("weightage")
    .isInt({ min: 10, max: 100 })
    .withMessage("Weightage must be between 10 and 100"),
  body("quarter").trim().notEmpty().withMessage("Quarter is required"),
];

export const updateGoalValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("weightage")
    .optional()
    .isInt({ min: 10, max: 100 })
    .withMessage("Weightage must be between 10 and 100"),
  body("target")
    .optional()
    .isNumeric()
    .withMessage("Target must be a number"),
];

// ─── Check-ins ───────────────────────────────────────────────────────────────

export const createCheckInValidation = [
  body("goalId").isMongoId().withMessage("Valid goal ID is required"),
  body("plannedValue")
    .isNumeric()
    .withMessage("Planned value must be a number"),
  body("actualValue")
    .isNumeric()
    .withMessage("Actual value must be a number"),
  body("quarter").trim().notEmpty().withMessage("Quarter is required"),
  body("status")
    .optional()
    .isIn(["not_started", "on_track", "completed", "at_risk"])
    .withMessage("Invalid status"),
];

// ─── Goal Cycles ─────────────────────────────────────────────────────────────

export const createCycleValidation = [
  body("name").trim().notEmpty().withMessage("Cycle name is required"),
  body("startDate").isISO8601().withMessage("Valid start date is required"),
  body("endDate").isISO8601().withMessage("Valid end date is required"),
];

// ─── Mongo ID param ──────────────────────────────────────────────────────────

export const mongoIdParam = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
];
