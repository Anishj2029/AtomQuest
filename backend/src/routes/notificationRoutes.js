import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { mongoIdParam } from "../validations/index.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", mongoIdParam(), validate, markAsRead);

export default router;
