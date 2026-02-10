import { Router } from "express";
import { adminDashboard, adminLogin, adminLoginForm } from "../controllers/adminController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminRoutes = Router();

adminRoutes.get("/login", asyncHandler(adminLoginForm));
adminRoutes.post("/login", asyncHandler(adminLogin));
adminRoutes.get("/", requireAuth, requireAdmin, asyncHandler(adminDashboard));
