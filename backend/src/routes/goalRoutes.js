import { Router } from "express";
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  submitGoal,
  approveGoal,
  rejectGoal,
  unlockGoal,
} from "../controllers/goalController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import {
  createGoalValidation,
  updateGoalValidation,
  mongoIdParam,
} from "../validations/index.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createGoalValidation, validate, createGoal);
router.get("/", getGoals);
router.get("/:id", mongoIdParam(), validate, getGoalById);
router.patch("/:id", mongoIdParam(), updateGoalValidation, validate, updateGoal);
router.delete("/:id", mongoIdParam(), validate, deleteGoal);

// Workflow actions
router.post("/:id/submit", mongoIdParam(), validate, submitGoal);
router.post("/:id/approve", mongoIdParam(), validate, roleMiddleware("manager", "admin"), approveGoal);
router.post("/:id/reject", mongoIdParam(), validate, roleMiddleware("manager", "admin"), rejectGoal);
router.post("/:id/unlock", mongoIdParam(), validate, roleMiddleware("admin"), unlockGoal);

export default router;
