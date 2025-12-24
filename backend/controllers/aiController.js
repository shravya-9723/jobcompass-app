import axios from "axios";
import { Roadmap } from "../models/Roadmap.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// 🛡️ RICH FALLBACK (System Offline Mode - Kept Full)
const FALLBACK_ROADMAP = {
  title: "Career Roadmap (System Offline)",
  estimatedTime: "6-8 Months",
  steps: [
    { 
      task: "System Offline - Basic Foundations", 
      duration: "2 Weeks", 
      why: "The AI system is currently overloaded. Please try again in 1 minute.", 
      stage: "Beginner",
      interviewPairs: [
        { question: "System Status?", answer: "Offline" },
        { question: "Try Again?", answer: "Yes" },
        { question: "Is data saved?", answer: "No, this is a fallback." },
        { question: "What happened?", answer: "AI Timeout." },
        { question: "Solution?", answer: "Refresh and click Generate." }
      ],
      stepResources: [
        { name: "Doc: Official Documentation", url: "https://devdocs.io/" },
        { name: "Practice: FreeCodeCamp", url: "https://www.freecodecamp.org/" },
        { name: "GitHub: Awesome Roadmap", url: "https://github.com/kamranahmedse/developer-roadmap" }
      ],
      miniProject: {
        idea: "Wait & Retry",
        tools: "Browser",
        expectedOutput: "A fresh roadmap."
      }
    }
  ]
};

// 🔧 HELPER: Extracts JSON safely
const extractAndParseJSON = (text) => {
  try {
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstOpen = cleaned.indexOf('{');
    const lastClose = cleaned.lastIndexOf('}');
    
    if (firstOpen !== -1 && lastClose !== -1) {
      cleaned = cleaned.substring(firstOpen, lastClose + 1);
      return JSON.parse(cleaned);
    }
    return null;
  } catch (e) {
    console.error("JSON Parse Error:", e.message);
    return null;
  }
};

export const generateRoadmap = async (req, res) => {
  try {
    const { career } = req.body;
    if (!career) return res.status(400).json({ message: "Career field is required" });

    const cleanCareer = career.trim().toLowerCase();

    // 🔥 SPECIAL FIX: FORCE CLEAR DEVOPS/SRE CACHE
    // This deletes the "stuck" DevOps map so the new Fast Model can take over.
    if (cleanCareer.includes("devops") || cleanCareer.includes("sre")) {
        console.log(`🔥 FORCE DELETING stuck cache for: ${career} to ensure fresh generation.`);
        await Roadmap.deleteMany({ title: { $regex: new RegExp(cleanCareer, "i") } });
    }

    // ⚡ 1. CHECK CACHE (Standard Check)
    const cachedRoadmap = await Roadmap.findOne({ title: { $regex: new RegExp(cleanCareer, "i") } }).sort({ createdAt: -1 });
    
    // CHECK: Is the saved map BROKEN? (Offline mode OR less than 5 steps)
    if (cachedRoadmap) {
      const isOffline = cachedRoadmap.title.includes("Offline") || cachedRoadmap.title.includes("System");
      const isBroken = !cachedRoadmap.steps || cachedRoadmap.steps.length < 5;

      if (isOffline || isBroken) {
        console.log(`🗑️ Found BROKEN/OFFLINE map for ${career}. Deleting it to force regeneration...`);
        await Roadmap.deleteOne({ _id: cachedRoadmap._id }); // DESTROY THE BAD CACHE
      } else {
        console.log(`⚡ Serving Valid Cached Roadmap for: ${career}`);
        return res.status(200).json({ message: "Success (Cached)", roadmap: cachedRoadmap });
      }
    }

    console.log(`🤖 Generating HEAVY Roadmap for: ${career}...`);

    // ⚡ 2. PROMPT (Optimized for Llama 3.1)
    const prompt = `
      You are a Senior Tech Lead. Create a "Zero to Hero" roadmap for: "${career}".
      STRICT JSON FORMAT ONLY. NO MARKDOWN.
      
      Structure:
      {
        "title": "${career} Professional Path",
        "estimatedTime": "6-9 Months",
        "steps": [
          {
            "task": "Specific Topic",
            "duration": "Duration",
            "why": "Concise Reason",
            "stage": "Beginner", 
            "interviewPairs": [
              { "question": "Q1", "answer": "Concise Answer" },
              { "question": "Q2", "answer": "Concise Answer" },
              { "question": "Q3", "answer": "Concise Answer" },
              { "question": "Q4", "answer": "Concise Answer" },
              { "question": "Q5", "answer": "Concise Answer" }
            ],
            "stepResources": [
               { "name": "Doc: Name", "url": "https://..." },
               { "name": "Practice: Name", "url": "https://..." },
               { "name": "GitHub: Name", "url": "https://..." }
            ],
            "miniProject": {
               "idea": "Name",
               "tools": "Stack",
               "expectedOutput": "Outcome"
            }
          }
        ]
      }

      RULES:
      1. Generate **12-14 High-Quality Steps**. (Safe limit for fast models).
      2. **interviewPairs**: EXACTLY 5 Questions per step. **Answers MUST be concise.**
      3. **stepResources**: Exactly 3 links.
      4. **stage**: "Beginner", "Intermediate", or "Advanced".
      5. RETURN ONLY JSON.
    `;

    // ⚡ 3. NEW MODEL ORDER (SPEED OPTIMIZED)
    // Llama 3.1 70B is currently the best balance of Speed and Intelligence on Free Tier.
    const models = [
      "meta-llama/llama-3.1-70b-instruct:free", // 1. Primary: FAST & SMART (Best for DevOps)
      "mistralai/mistral-7b-instruct:free",     // 2. Backup: Super Fast (Good for standard roles)
      "google/gemini-2.0-flash-exp:free"        // 3. Last Resort: Slow but huge context
    ];

    let roadmapData = null;

    for (const model of models) {
      try {
        console.log(`Trying Model: ${model}...`);
        const response = await axios.post(
          OPENROUTER_URL,
          {
            model: model,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.3, 
          },
          { 
            headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
            timeout: 60000 // 60s is enough for Llama
          }
        );

        const text = response.data.choices[0].message.content;
        roadmapData = extractAndParseJSON(text);

        if (roadmapData && roadmapData.steps && roadmapData.steps.length > 0) {
          console.log(`✅ Success with ${model}`);
          break; 
        }
      } catch (e) {
        console.warn(`⚠️ ${model} failed. Switching...`);
      }
    }

    // ⚡ 4. FALLBACK HANDLER
    if (!roadmapData) {
      console.error("❌ All AI models failed. Sending Offline Backup.");
      // DO NOT SAVE BAD DATA TO DB. Just send it to UI.
      return res.status(200).json({ 
        message: "System Busy", 
        roadmap: { ...FALLBACK_ROADMAP, title: `${career} (System Offline)` } 
      });
    }

    // ⚡ 5. SAVE SUCCESSFUL MAP TO DB
    const userId = req.user ? req.user.id : null;
    const roadmap = await Roadmap.create({ ...roadmapData, createdBy: userId });
    res.status(201).json({ message: "Success", roadmap });

  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};