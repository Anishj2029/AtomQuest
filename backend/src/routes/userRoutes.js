import { Router } from "express";
import { getAllUsers, getUserById, updateUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/", roleMiddleware("admin", "manager"), getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);

export default router;
