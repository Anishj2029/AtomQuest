import { Router } from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/", getAuditLogs);

export default router;
