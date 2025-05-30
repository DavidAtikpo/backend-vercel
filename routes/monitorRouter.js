import express from "express";
import { createMonitor, getMonitors, updateMonitor, deleteMonitor } from "../controllers/monitorController.js";
const router = express.Router();

router.post("/", createMonitor);
router.get("/", getMonitors);
router.put("/:id", updateMonitor);
router.delete("/:id", deleteMonitor);

export default router; 