import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { registerValidation, loginValidation } from "../validations/index.js";

const router = Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", authMiddleware, getMe);

export default router;
