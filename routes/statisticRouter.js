import middleware from "../middleware/authMiddleware.js";
import express from "express";
import { getGlobalStats, getUsersStats, getChildrenStats, getReportsStats, getGoalsStats, getAdminDashboard, recalculateAllStats, getDailyStats, getWeeklyStats, getMonthlyStats, getYearlyStats } from "../controllers/StatistiqueController.js";

const router = express.Router();

// Routes pour l'admin
router.get('/admin/stats/global', middleware.authMiddleware, getGlobalStats);
router.get('/admin/stats/users', middleware.authMiddleware, getUsersStats);
router.get('/admin/stats/children', middleware.authMiddleware, getChildrenStats);
router.get('/admin/stats/reports', middleware.authMiddleware, getReportsStats);
router.get('/admin/stats/goals', middleware.authMiddleware, getGoalsStats);
router.get('/admin/dashboard', middleware.authMiddleware, getAdminDashboard);
router.post('/admin/stats/recalculate', middleware.authMiddleware, recalculateAllStats);

// Routes existantes améliorées
router.get('/admin/stats/daily', middleware.authMiddleware, getDailyStats);
router.get('/admin/stats/weekly', middleware.authMiddleware, getWeeklyStats);
router.get('/admin/stats/monthly', middleware.authMiddleware, getMonthlyStats);
router.get('/admin/stats/yearly', middleware.authMiddleware, getYearlyStats);

export default router;