// src/data/roadmapData.js

export const roadmapData = {
  "Full Stack Developer": [
    {
      id: 1,
      title: "The Foundation",
      status: "completed", // visual state
      xpReward: 500,
      desc: "Before you can build empires, you must lay the bricks. Master the structure (HTML) and style (CSS) of the web.",
      quests: [
        "Build a semantic HTML5 portfolio page",
        "Master Flexbox & Grid layouts",
        "Create a responsive Navbar"
      ],
      resources: ["MDN Web Docs", "CSS-Tricks Flexbox Guide"]
    },
    {
      id: 2,
      title: "JavaScript Sorcery",
      status: "unlocked",
      xpReward: 800,
      desc: "Static pages are dead. Breathe life into your creations with the logic of JavaScript.",
      quests: [
        "Learn ES6+ syntax (Arrow functions, Destructuring)",
        "Manipulate the DOM interactively",
        "Fetch data from a public API"
      ],
      resources: ["JavaScript.info", "You Don't Know JS"]
    },
    {
      id: 3,
      title: "React Framework",
      status: "locked",
      xpReward: 1200,
      desc: "Component-based architecture. The industry standard for modern frontend engineering.",
      quests: [
        "Understand Props & State",
        "Master React Hooks (useState, useEffect)",
        "Build a multi-page app with React Router"
      ],
      resources: ["React Official Docs", "Scrimba React Course"]
    },
    {
      id: 4,
      title: "Backend Realm",
      status: "locked",
      xpReward: 1500,
      desc: "Server-side logic. Control the database, authentication, and the API layer.",
      quests: [
        "Build a REST API with Node.js & Express",
        "Connect to MongoDB",
        "Implement JWT Authentication"
      ],
      resources: ["Node.js Crash Course", "MongoDB University"]
    },
    {
      id: 99,
      title: "THE FINAL BOSS",
      type: "boss",
      status: "locked",
      xpReward: 5000,
      desc: "Prove your worth. Face the AI Interviewer to claim your title.",
      quests: ["Pass the Technical Interview", "Solve a Live Coding Challenge"],
      resources: []
    }
  ],
  // Fallback for other roles (you can duplicate this structure for Data, Cyber, etc later)
  "Data Engineer": [
     { id: 1, title: "Python Mastery", status: "unlocked", xpReward: 500, desc: "The language of data.", quests: ["Master Python Basics", "Pandas & NumPy"], resources: [] },
     { id: 99, title: "THE FINAL BOSS", type: "boss", status: "locked", xpReward: 5000, desc: "Interview Simulator", quests: [], resources: [] }
  ]
};