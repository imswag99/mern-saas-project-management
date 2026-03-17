import express from "express";
import { getAdminDashboardData, getDashboardData } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/user", authMiddleware, getDashboardData);
dashboardRouter.get("/admin", authMiddleware, adminOnly, getAdminDashboardData);

export default dashboardRouter;
