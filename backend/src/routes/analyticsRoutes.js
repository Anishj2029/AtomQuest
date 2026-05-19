import { Router } from "express";
import {
  getEmployeeAnalytics,
  getTeamAnalytics,
  getOrgAnalytics,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/employee", getEmployeeAnalytics);
router.get("/team", roleMiddleware("manager", "admin"), getTeamAnalytics);
router.get("/org", roleMiddleware("admin"), getOrgAnalytics);

export default router;
