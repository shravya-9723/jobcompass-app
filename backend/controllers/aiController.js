Here is the **complete, uncut code** for your backend controller.

It includes the **Creative Project Titles**, the **Specific Video Playlist logic** (to prevent broken links), and the **Smart Resource Matrix** for all 12 roles.

```javascript
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

    console.log(`🤖 Generating CREATIVE Roadmap for: ${career}...`);

    // ⚡ 2. UPDATED PROMPT (Strict Specific Links + Creative Ideas)
    const prompt = `
      You are a Senior Technical Career Mentor and Creative Director.
      Create a comprehensive "Zero to Hero" roadmap for: "${career}".

      OUTPUT FORMAT:
      - STRICT JSON ONLY. NO MARKDOWN. NO PREAMBLE.
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
      ✨ CREATIVE PROJECT RULES (MAKE IT COOL)
      ----------------------------------------------------------------
      - **DO NOT** use boring names like "ToDo App" or "Weather App".
      - **USE CREATIVE BRANDING:** - Instead of "Task App", use "Chronos Productivity Engine".
        - Instead of "Chat App", use "Whisper Encrypted Mesh".
        - Instead of "Portfolio", use "Holographic 3D Identity".
      - The project must sound impressive on a Resume.

      ----------------------------------------------------------------
      🔗 SMART RESOURCE LOGIC (STRICT SPECIFIC LINKS)
      ----------------------------------------------------------------
      
      1. **Videos (MUST BE SPECIFIC & WORKING):**
         - **RULE:** You must prioritize **PLAYLIST** links ("https://www.youtube.com/playlist?list=...") or **Channel Landing Pages** over single videos.
         - **SOURCE:** Only use these verified channels (they don't delete content):
           [FreeCodeCamp, Traversy Media, Net Ninja, Web Dev Simplified, Academind, Fireship, Google Cloud Tech, IBM Technology].
         - **Example:** "https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4p6-AGjz9a" (Net Ninja).
         - **fallback:** If you cannot find a playlist, use the Channel's Search URL: "https://www.youtube.com/@TraversyMedia/search?query=${"Topic"}"

      2. **Docs (STABLE ROOT DOMAINS):**
         - Use ROOT domains only (e.g., "https://react.dev/", "https://docs.aws.amazon.com/", "https://unity.com/learn"). 
         - NO deep links like ".../v1.2/guide".

      3. **Practice (ROLE-BASED & WORKING):**
         - **Coding (FullStack/QA/Web3):** Use **LeetCode Tags** ("https://leetcode.com/tag/...") or **Exercism Tracks**.
         - **Data/AI:** Use **Kaggle Learn** ("https://www.kaggle.com/learn").
         - **Cyber/DevOps:** Use **TryHackMe** ("https://tryhackme.com/") or **GitHub Topics** ("https://github.com/topics/...").
         - **UI/UX/Creative:** Use **Figma Community** ("https://www.figma.com/community") or **Behance**.

      ----------------------------------------------------------------
      CONTENT RULES
      ----------------------------------------------------------------
      1. Generate **12-14 Steps** (Beginner -> Advanced).
      2. **interviewPairs**: EXACTLY 5 high-quality questions per step.
      3. **miniProject**: Must use the Creative Rules above.

      GENERATE JSON NOW.
    `;

    // ⚡ 3. UPDATED MODEL ORDER (OpenRouter Specific IDs)
    const models = [
      "google/gemini-flash-1.5",           // PRIMARY: Fast & Creative.
      "meta-llama/llama-3.1-70b-instruct", // SECONDARY: Smartest Open Source Logic.
      "mistralai/mistral-large"            // FALLBACK
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
            temperature: 0.3, // Low temp for link accuracy, but prompt ensures creative titles
          },
          { 
            headers: { 
              "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://jobcompass.ai", // Required by OpenRouter for ranking
              "X-Title": "Job Compass"                 // Required by OpenRouter for ranking
            },
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

```
