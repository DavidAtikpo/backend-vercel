import express from "express";
import { 
  createMonitor, 
  getMonitors, 
  updateMonitor, 
  deleteMonitor,
  getMonitorProfile,
  getMonitorById 
} from "../controllers/monitorController.js";
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/", createMonitor);
router.get("/", getMonitors);
router.get("/profile",authMiddleware.authMiddleware, getMonitorProfile);
router.get("/:id", authMiddleware.authMiddleware, getMonitorById);
router.put("/:id", updateMonitor);
router.delete("/:id", deleteMonitor);

export default router; 