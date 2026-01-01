Yes, the previous response contained the **full, uncut code**.

However, to be absolutely 100% sure you have the clean, final version with **nothing missing** (imports, helpers, prompts, and logic all in one place), I have pasted it below one last time.

**You can copy this entire block and replace your current controller file completely.**

```javascript
import axios from "axios";
import { Roadmap } from "../models/Roadmap.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// 🛡️ RICH FALLBACK (System Offline Mode)
// Used if AI runs out of credits or times out.
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

// 🔧 HELPER: Extracts JSON safely from AI text
const extractAndParseJSON = (text) => {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    // Find the first '{' and last '}' to isolate the JSON object
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

// 🚀 MAIN CONTROLLER FUNCTION
export const generateRoadmap = async (req, res) => {
  try {
    const { career } = req.body;
    if (!career) return res.status(400).json({ message: "Career field is required" });

    const cleanCareer = career.trim().toLowerCase();

    // 🔥 FORCE CLEAR CACHE (DevOps/SRE Fix)
    // Deletes old/bad DevOps maps so the new logic can run.
    if (cleanCareer.includes("devops") || cleanCareer.includes("sre")) {
        console.log(`🔥 FORCE DELETING stuck cache for: ${career} to ensure fresh generation.`);
        await Roadmap.deleteMany({ title: { $regex: new RegExp(cleanCareer, "i") } });
    }

    // ⚡ 1. CHECK DATABASE CACHE
    const cachedRoadmap = await Roadmap.findOne({ title: { $regex: new RegExp(cleanCareer, "i") } }).sort({ createdAt: -1 });
    
    if (cachedRoadmap) {
      const isOffline = cachedRoadmap.title.includes("Offline") || cachedRoadmap.title.includes("System");
      const isBroken = !cachedRoadmap.steps || cachedRoadmap.steps.length < 5;

      if (isOffline || isBroken) {
        console.log(`🗑️ Found BROKEN/OFFLINE map for ${career}. Deleting it to force regeneration...`);
        await Roadmap.deleteOne({ _id: cachedRoadmap._id }); 
      } else {
        console.log(`⚡ Serving Valid Cached Roadmap for: ${career}`);
        return res.status(200).json({ message: "Success (Cached)", roadmap: cachedRoadmap });
      }
    }

    console.log(`🤖 Generating STRICT & CREATIVE Roadmap for: ${career}...`);

    // ⚡ 2. THE "NUCLEAR SAFETY" PROMPT
    // Enforces: Creative Titles, No Broken GitHub links, No YouTube Search Queries.
    const prompt = `
      You are a Senior Technical Career Mentor.
      Create a "Zero to Hero" roadmap for: "${career}".

      OUTPUT FORMAT:
      - STRICT JSON ONLY. NO MARKDOWN.
      - MUST BE PARSABLE BY JSON.parse().

      ----------------------------------------------------------------
      JSON STRUCTURE
      ----------------------------------------------------------------
      {
        "title": "${career} Professional Path",
        "estimatedTime": "6-9 Months",
        "steps": [
          {
            "task": "Specific Topic Title",
            "duration": "1 Week",
            "stage": "Beginner | Intermediate | Advanced",
            "why": "Concise industry reason.",
            "interviewPairs": [
              { "question": "Q1", "answer": "Short Answer" },
              { "question": "Q2", "answer": "Short Answer" },
              { "question": "Q3", "answer": "Short Answer" },
              { "question": "Q4", "answer": "Short Answer" },
              { "question": "Q5", "answer": "Short Answer" }
            ],
            "stepResources": [
               { "name": "Video Course", "url": "https://..." },
               { "name": "Documentation", "url": "https://..." },
               { "name": "Practice/Lab", "url": "https://..." }
            ],
            "miniProject": {
               "idea": "Creative Project Name",
               "tools": "Stack",
               "expectedOutput": "Outcome"
            }
          }
        ]
      }

      ----------------------------------------------------------------
      ⛔ LINK GENERATION RULES (STRICT BAN ON BROKEN LINKS)
      ----------------------------------------------------------------
      
      1. **GITHUB BAN (Crucial):** - **NEVER** generate "github.com/username/repo" links. They are often deleted (404).
         - **ONLY USE:** "https://github.com/topics/${"topic-slug"}" (e.g. github.com/topics/sql).
         - This is the ONLY allowed GitHub format.

      2. **YOUTUBE BAN (Crucial):**
         - **NEVER** use "search_query" URLs.
         - **NEVER** guess random video IDs (v=xyz).
         - **MUST USE PLAYLISTS:** Format "https://www.youtube.com/playlist?list=..." 
         - **SOURCE:** Use verified playlists from: FreeCodeCamp, Traversy Media, NetNinja, CrashCourse, IBM Technology.
         - If a specific playlist is unknown, link to the **Channel's Video Tab**: "https://www.youtube.com/@Freecodecamp/videos"

      3. **PRACTICE PLATFORMS (Role-Specific):**
         - **Coding:** LeetCode Tags ("https://leetcode.com/tag/sql/") or Exercism Tracks.
         - **Data:** Kaggle Learn ("https://www.kaggle.com/learn").
         - **Cyber:** TryHackMe ("https://tryhackme.com/").
         - **Design:** Figma Community ("https://www.figma.com/community").

      ----------------------------------------------------------------
      ✨ CREATIVE PROJECTS
      ----------------------------------------------------------------
      - Projects must have cool names (e.g. "Neural Nexus" instead of "AI App").
      - No "ToDo Lists".

      GENERATE JSON NOW.
    `;

    // ⚡ 3. MODELS (High Intelligence Required for Rules)
    const models = [
      "google/gemini-flash-1.5",           // PRIMARY: Fast & Intelligent
      "meta-llama/llama-3.1-70b-instruct", // SECONDARY: Smart Logic
      "mistralai/mistral-large"            // FALLBACK
    ];

    let roadmapData = null;

    // ⚡ 4. API LOOP
    for (const model of models) {
      try {
        console.log(`Trying Model: ${model}...`);
        const response = await axios.post(
          OPENROUTER_URL,
          {
            model: model,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.3, // Keep low to strictly follow URL rules
          },
          { 
            headers: { 
              "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://jobcompass.ai", // Required by OpenRouter
              "X-Title": "Job Compass"                 // Required by OpenRouter
            },
            timeout: 60000 // 60s timeout
          }
        );

        const text = response.data.choices[0].message.content;
        roadmapData = extractAndParseJSON(text);

        // Verify we actually got steps back
        if (roadmapData && roadmapData.steps && roadmapData.steps.length > 0) {
          console.log(`✅ Success with ${model}`);
          break; // Stop loop if successful
        }
      } catch (e) {
        console.warn(`⚠️ ${model} failed. Switching...`);
      }
    }

    // ⚡ 5. FALLBACK HANDLER (If all models fail)
    if (!roadmapData) {
      console.error("❌ All AI models failed.");
      return res.status(200).json({ 
        message: "System Busy", 
        roadmap: { ...FALLBACK_ROADMAP, title: `${career} (System Offline)` } 
      });
    }

    // ⚡ 6. SAVE TO DB
    const userId = req.user ? req.user.id : null;
    const roadmap = await Roadmap.create({ ...roadmapData, createdBy: userId });
    res.status(201).json({ message: "Success", roadmap });

  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

```
