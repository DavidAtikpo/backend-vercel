import express from "express";
import { createMonitorReport, getMonitorReports, updateMonitorReport, deleteMonitorReport } from "../controllers/monitorReportController.js";
const router = express.Router();

router.post("/", createMonitorReport);
router.get("/", getMonitorReports);
router.put("/:id", updateMonitorReport);
router.delete("/:id", deleteMonitorReport);

export default router; 