import mongoose from "mongoose";

// Sub-schema for individual questions (flexible for different types)
const questionSchema = new mongoose.Schema({
  // Common fields
  type: { 
    type: String, 
    required: true, 
    enum: ['open_text', 'scenario_choice', 'system_design', 'behavioral_star'] 
  },
  question: { type: String, required: true },
  xp: { type: Number, required: true },
  
  // --- Technical Mode Specific Fields ---
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  options: [{ text: String, xp: Number }], // For scenario_choice
  evaluationCriteria: [String], // For open_text & system_design (keywords/concepts)

  // --- STAR Mode Specific Fields ---
  // This defines what the user *should* cover for a perfect answer
  starCriteria: {
    situation: { type: String, default: "Context and background" },
    task: { type: String, default: "Specific responsibility or challenge" },
    action: { type: String, default: "Steps taken and contribution" },
    result: { type: String, default: "Outcome, impact, and metrics" }
  },
  evaluationRubric: {
    clarity: { type: Number, default: 25 },
    ownership: { type: Number, default: 25 },
    problem_solving: { type: Number, default: 25 },
    impact: { type: Number, default: 25 }
  }
}, { _id: false }); // No separate ID for questions sub-documents

// Main Interview Schema
const interviewSchema = new mongoose.Schema({
  role: { type: String, required: true }, // e.g., "Full Stack Developer"
  mode: { type: String, required: true, enum: ['technical', 'star'] },
  
  // The NPC persona for this specific interview
  npc: {
    name: { type: String, required: true },
    persona: { type: String, required: true } // e.g., "cold_analytical", "mentor"
  },

  totalXP: { type: Number, required: true },
  
  // The actual list of questions
  questions: [questionSchema],

  createdAt: { type: Date, default: Date.now }
});

// We don't need to store every single generated interview per user here.
// This schema is for the *templates* of interviews that the AI generates.
export const Interview = mongoose.model("InterviewTemplate", interviewSchema);