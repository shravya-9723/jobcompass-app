import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  career: { type: String },
  estimatedTime: { type: String },
  
  steps: [
    {
      task: String,
      duration: String,
      why: String,
      stage: String, 
      completed: { type: Boolean, default: false },
      
      // ✅ NEW: Specific Data per Step
      interviewPairs: [ { question: String, answer: String } ],
      stepResources: [ { name: String, url: String } ],
      miniProject: { 
        idea: String, 
        tools: String, 
        expectedOutput: String 
      }
    }
  ],
  
  // Keep these as backups/global
  resources: { type: Array, default: [] },
  projects: { type: Object, default: {} },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);