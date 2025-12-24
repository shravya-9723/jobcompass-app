import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true }, // e.g., "Full Stack Developer"
  score: { type: Number, required: true }, // e.g., 85
  totalQuestions: { type: Number, required: true },
  topic: { type: String }, // Optional: "React Basics"
  date: { type: Date, default: Date.now }
});

export const QuizResult = mongoose.model("QuizResult", quizResultSchema);