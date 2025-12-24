import express from "express";
import { generateRoadmap } from "../controllers/aiController.js"; // Import the optimized controller

const router = express.Router();

// This matches POST /api/ai/roadmap
router.post("/roadmap", generateRoadmap);

export default router;