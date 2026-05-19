import { Router } from "express";
import { createCheckIn, getCheckIns, updateCheckIn } from "../controllers/checkInController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { createCheckInValidation, mongoIdParam } from "../validations/index.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createCheckInValidation, validate, createCheckIn);
router.get("/", getCheckIns);
router.patch("/:id", mongoIdParam(), validate, updateCheckIn);

export default router;
