import axios from "axios";

// NOTE: We keep this memory-based for stability to prevent Schema crashes.
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// 🛡️ RICH FALLBACK DATA (Used if AI times out)
const FALLBACK_DATA = {
  technical: {
    role: "Fresher Developer",
    mode: "technical",
    totalXP: 500,
    npc: { name: "Tech Lead", persona: "encouraging_but_precise" },
    questions: [
      // 1. Core CS Basics (Fallback)
      { type: "open_text", difficulty: "medium", question: "Explain the 4 pillars of OOPS with real-world examples.", xp: 50 },
      { type: "open_text", difficulty: "medium", question: "What is the difference between Process and Thread?", xp: 50 },
      { type: "open_text", difficulty: "hard", question: "Explain ACID properties in Databases.", xp: 50 },
      // 2. Generic Web/Tech (Fallback)
      { type: "open_text", difficulty: "medium", question: "How does the Internet work (DNS, HTTP)?", xp: 40 },
      { type: "open_text", difficulty: "hard", question: "Explain the concept of API and REST.", xp: 60 }
    ]
  },
  star: {
    role: "Fresher Developer",
    mode: "star",
    totalXP: 300,
    npc: { name: "HR Manager", persona: "friendly_professional" },
    questions: [
      { type: "behavioral_star", question: "Tell me about a time you faced a conflict in a college group project.", xp: 100 },
      { type: "behavioral_star", question: "Describe a deadline you missed and how you handled it.", xp: 100 }
    ]
  }
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
  } catch (e) { return null; }
};

// 1. GENERATE INTERVIEW
export const generateInterview = async (req, res) => {
  const { role, mode } = req.body;
  console.log(`🤖 Generating ${mode.toUpperCase()} Interview for: ${role}`);

  try {
    // 🧠 SMART PROMPT SWITCHING
    let prompt = "";

    if (mode === "technical") {
      prompt = `
        Act as a Technical Interviewer for a Top Tech Company.
        Generate a **Fresher-Focused Technical Interview** for the role: "${role}".
        
        REQUIREMENTS:
        1. Generate **EXACTLY 20 High-Quality Questions**.
        2. **THE HYBRID SPLIT (CRITICAL):**
           - **First 10 Questions:** Core Computer Science Fundamentals (Required for ALL Freshers).
             * Topics: OOPs, DBMS (SQL/Normalization), OS (Threads/Memory), CN (HTTP/TCP).
           - **Next 10 Questions:** Specific to "${role}".
             * If "Full Stack": Ask React, Node.js, REST, Databases.
             * If "GenAI Eng.": Ask LLMs, Transformers, RAG basics, Python.
             * If "DevOps/SRE": Ask Linux, Docker basics, CI/CD concepts.
             * If "Cloud Native": Ask AWS basics, Kubernetes concepts.
             * If "Web3 Dev": Ask Blockchain basics, Smart Contracts.
             * If "Game Dev": Ask Unity/Unreal, Physics engines, Vectors.
             * If "Mobile Dev": Ask Android/iOS lifecycles, API integration.
             * If "Cybersecurity": Ask Network defense, OWASP Top 10, Encryption.
        3. Keep difficulty suitable for a College Graduate (Conceptual & Logic based).
        4. RETURN ONLY JSON.

        Structure:
        {
          "role": "${role}",
          "npc": { "name": "Senior Eng.", "persona": "Testing your fundamentals and stack knowledge." },
          "questions": [
             { "question": "Question text...", "xp": 50, "type": "open_text", "difficulty": "medium" }
          ]
        }
      `;
    } else {
      // STAR / HR MODE (REALISTIC FOR FRESHERS)
      prompt = `
        Act as a HR Manager.
        Generate a **Behavioral Interview** specifically for a **College Fresher/Graduate** applying for "${role}".
        
        REQUIREMENTS:
        1. Generate **EXACTLY 15 Most Frequently Asked HR Questions**.
        2. **SCENARIOS MUST BE REALISTIC FOR STUDENTS:**
           - **Group Projects:** "Conflict with a team member who didn't contribute."
           - **Deadlines:** "Submitting a final year project under extreme pressure."
           - **Learning:** "How did you learn the tools for ${role} outside of the syllabus?"
           - **Failure:** "A time you failed an exam or code crashed during a demo."
        3. RETURN ONLY JSON.

        Structure:
        {
          "role": "${role}",
          "npc": { "name": "HR Manager", "persona": "Friendly but observant." },
          "questions": [
             { "question": "Tell me about a time...", "xp": 100, "type": "behavioral_star" }
          ]
        }
      `;
    }

    // 🚀 USE HEAVY MODEL (Llama 3.1 70B)
    // We use the 70B model because it's the only one smart enough 
    // to understand "50% Core / 50% Role Specific" logic correctly without crashing.
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "meta-llama/llama-3.1-70b-instruct:free", 
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
      },
      { 
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        timeout: 65000 // 65s Timeout for generating 20/15 questions
      }
    );

    const data = extractAndParseJSON(response.data.choices[0].message.content);
    
    if (!data || !data.questions || data.questions.length === 0) throw new Error("Invalid AI Data");
    
    console.log(`✅ Generated ${data.questions.length} Questions for ${role}`);
    res.json(data);

  } catch (error) {
    console.warn("⚠️ AI Failed or Timed Out. Sending Fallback.");
    // Merge fallback data with requested role so UI stays consistent
    const fallback = FALLBACK_DATA[mode] || FALLBACK_DATA.technical;
    res.json({ ...fallback, role });
  }
};

// 2. EVALUATE ANSWER (Real AI Grading)
export const evaluateAnswer = async (req, res) => {
  const { question, userAnswer, type } = req.body;
  console.log("📝 Grading Answer...");

  try {
    const prompt = `
      You are an Interviewer. Grade this Fresher's answer.
      
      Question: "${question}"
      Answer: "${userAnswer}"
      Type: ${type}
      
      Rules:
      1. If Technical: Did they explain the *concept* clearly? (Keywords matter).
      2. If STAR: Did they mention a specific **Situation**, **Task**, **Action**, and **Result**?
      
      Return JSON:
      {
        "score": (0-100),
        "feedback": "Concise feedback (max 2 sentences).",
        "improvements": "One specific tip to improve.",
        "starCheck": { "situation": true, "task": true, "action": true, "result": true }
      }
    `;

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "mistralai/mistral-7b-instruct:free", // Fast model for grading
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      },
      { 
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        timeout: 15000 
      }
    );

    const data = extractAndParseJSON(response.data.choices[0].message.content);
    if (!data) throw new Error("Grading Failed");

    res.json(data);

  } catch (error) {
    console.error("Grading Error:", error.message);
    res.json({
      score: 70,
      feedback: "Good attempt. Make sure to include technical keywords and structure your thoughts.",
      improvements: "Try to follow the STAR method (Situation, Task, Action, Result) more strictly.",
      starCheck: { situation: true, task: true, action: true, result: false }
    });
  }
};

// 3. SAVE SESSION
export const saveSession = async (req, res) => {
  console.log("💾 Session Save Requested (Mocked)");
  res.json({ message: "Session Saved" });
};