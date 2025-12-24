import mongoose from "mongoose";

// Sub-schema for a user's answer to a single question
const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ref to a question in the template (conceptually)
  questionText: { type: String, required: true },
  questionType: { type: String, required: true },

  // The user's input (flexible based on type)
  userAnswer: {
    text: String, // For open_text, system_design
    choiceIndex: Number, // For scenario_choice
    star: { // For behavioral_star
      situation: String,
      task: String,
      action: String,
      result: String
    }
  },

  // AI's Evaluation
  aiEvaluation: {
    feedback: String, // The NPC's response
    score: Number, // XP earned for this question
    metrics: { // Optional structured data for UI (e.g., HUD)
      clarity: Number,
      technicalAccuracy: Number,
      starCompleteness: {
        s: Boolean, t: Boolean, a: Boolean, r: Boolean
      }
    }
  },
  
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Main Session Schema
const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  mode: { type: String, required: true, enum: ['technical', 'star'] },
  
  // Copy basic NPC details for context
  npcName: { type: String },

  totalScore: { type: Number, default: 0 },
  maxPossibleScore: { type: Number, required: true },
  status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' },

  // The history of questions and answers in this session
  answers: [answerSchema],

  startTime: { type: Date, default: Date.now },
  endTime: Date
});

export const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);