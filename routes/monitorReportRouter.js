import express from "express";
import { 
  createMonitorReport, 
  getMonitorReports, 
  updateMonitorReport, 
  deleteMonitorReport,
  getMonitorReportsByClass,
  getMonitorReportsByMonitor
} from "../controllers/monitorReportController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes protégées par authentification
router.post("/", authMiddleware.authMiddleware, createMonitorReport);
router.get("/", authMiddleware.authMiddleware, getMonitorReports);
router.get("/class/:classId", authMiddleware.authMiddleware, getMonitorReportsByClass);
router.get("/monitor/:monitorId", authMiddleware.authMiddleware, getMonitorReportsByMonitor);
router.put("/:id", authMiddleware.authMiddleware, updateMonitorReport);
router.delete("/:id", authMiddleware.authMiddleware, deleteMonitorReport);

export default router; 