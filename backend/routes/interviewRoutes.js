import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { 
  generateInterview, 
  evaluateAnswer, 
  saveSession 
} from "../controllers/interviewController.js";

const router = express.Router();

// Generate the interview structure (Technical or STAR)
router.post("/generate", verifyToken, generateInterview);

// Submit an answer for AI evaluation
router.post("/evaluate", verifyToken, evaluateAnswer);

// Save the final session result
router.post("/save", verifyToken, saveSession);

export default router;