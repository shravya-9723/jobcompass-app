import express from "express";
// ✅ CHANGED: 'protect' -> 'verifyToken' to match your file
import { verifyToken } from "../middleware/authMiddleware.js"; 
import {
  createRoadmap,
  getRoadmaps,
  updateRoadmap,
  deleteRoadmap,
  getRoadmapHistory,
  getRoadmapById
} from "../controllers/roadmapController.js";

const router = express.Router();

// ✅ 1. HISTORY ROUTE (MUST BE FIRST)
// Fetches the list of all previous roadmaps for the sidebar
router.get("/history", verifyToken, getRoadmapHistory);

// 2. MAIN ROUTES
router.post("/", verifyToken, createRoadmap);
router.get("/", verifyToken, getRoadmaps);

// ✅ 3. SPECIFIC ID ROUTE (MUST BE AFTER HISTORY)
// Fetches a single old roadmap
router.get("/:id", verifyToken, getRoadmapById);

// 4. MODIFICATION ROUTES
router.put("/:id", verifyToken, updateRoadmap);
router.delete("/:id", verifyToken, deleteRoadmap);

export default router;