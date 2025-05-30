import express from "express";
import { createClass, getClasses, updateClass, deleteClass } from "../controllers/classController.js";
const router = express.Router();

router.post("/", createClass);
router.get("/", getClasses);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

export default router; 