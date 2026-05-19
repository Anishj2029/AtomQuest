import { Router } from "express";
import { getCycles, createCycle, updateCycle } from "../controllers/cycleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { createCycleValidation, mongoIdParam } from "../validations/index.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getCycles);
router.post("/", roleMiddleware("admin"), createCycleValidation, validate, createCycle);
router.patch("/:id", mongoIdParam(), validate, roleMiddleware("admin"), updateCycle);

export default router;
