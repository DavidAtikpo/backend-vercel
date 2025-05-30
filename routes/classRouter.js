import express from "express";
import { createClass, getClasses, updateClass, deleteClass } from "../controllers/classController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware.authMiddleware, createClass);
router.get("/", authMiddleware.authMiddleware, getClasses);
router.put("/:id", authMiddleware.authMiddleware, updateClass);
router.delete("/:id", authMiddleware.authMiddleware, deleteClass);

export default router; 