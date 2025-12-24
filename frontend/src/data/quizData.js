export const quizQuestions = [
  {
    q: "When you face a big problem, what is your natural approach?",
    options: [
      { text: "Break it into smaller steps and build a solution", score: { FullStack: 2, Backend: 2 } },
      { text: "Try creative ideas or visuals first", score: { UIUX: 3 } },
      { text: "Analyze patterns, data and logic behind it", score: { Data: 3, GenAI: 1 } },
      { text: "Check risks, security, possible failures", score: { Cyber: 3 } }
    ]
  },
  {
    q: "Which activity sounds most exciting to you?",
    options: [
      { text: "Designing beautiful interfaces", score: { UIUX: 3 } },
      { text: "Building websites or systems end-to-end", score: { FullStack: 3 } },
      { text: "Training or using AI models", score: { GenAI: 3, Data: 1 } },
      { text: "Managing servers / deploying apps", score: { DevOps: 3, Cloud: 2 } }
    ]
  },
  {
    q: "How do you feel about math & logic heavy tasks?",
    options: [
      { text: "LOVE them", score: { Data: 3, GenAI: 2, Backend: 2 } },
      { text: "Like them sometimes", score: { FullStack: 1, Cloud: 1 } },
      { text: "Prefer creativity over logic", score: { UIUX: 3 } },
      { text: "I enjoy debugging more than math", score: { QA: 2 } }
    ]
  },
  {
    q: "Which statement describes you best?",
    options: [
      { text: "I like things to be visually perfect", score: { UIUX: 3 } },
      { text: "I like making things work reliably", score: { DevOps: 3 } },
      { text: "I get excited about new AI breakthroughs", score: { GenAI: 3 } },
      { text: "I enjoy solving cyber puzzles", score: { Cyber: 3 } }
    ]
  },
  {
    q: "Pick the task you’d enjoy the MOST:",
    options: [
      { text: "Building a mobile app like Instagram", score: { Mobile: 3 } },
      { text: "Creating a VR world", score: { ARVR: 3 } },
      { text: "Making a 3D game with characters", score: { GameDev: 3 } },
      { text: "Designing secure authentication systems", score: { Cyber: 2, Backend: 1 } }
    ]
  },
  {
    q: "Which tool/tech excites you the most?",
    options: [
      { text: "Figma / Adobe XD", score: { UIUX: 3 } },
      { text: "React, Node, MongoDB", score: { FullStack: 3 } },
      { text: "TensorFlow / LangChain", score: { GenAI: 3 } },
      { text: "Docker / Kubernetes", score: { DevOps: 3, Cloud: 2 } }
    ]
  },
  {
    q: "You notice a bug in your app. What do you do first?",
    options: [
      { text: "Try different test cases to isolate the bug", score: { QA: 3 } },
      { text: "Check logs and system behavior", score: { DevOps: 2, Backend: 2 } },
      { text: "Inspect UI and interactions", score: { UIUX: 2 } },
      { text: "Look for algorithmic mistakes", score: { Data: 2, GenAI: 1 } }
    ]
  },
  {
    q: "What motivates you more?",
    options: [
      { text: "Seeing clean and beautiful UI", score: { UIUX: 3 } },
      { text: "Making things fast and scalable", score: { Backend: 2, DevOps: 2 } },
      { text: "Teaching computers to understand things", score: { GenAI: 3 } },
      { text: "Protecting systems from attacks", score: { Cyber: 3 } }
    ]
  },
  {
    q: "Imagine your dream project. What is it?",
    options: [
      { text: "A social media web app", score: { FullStack: 3 } },
      { text: "A mobile AR shopping app", score: { Mobile: 2, ARVR: 2 } },
      { text: "An AI-powered chatbot assistant", score: { GenAI: 3 } },
      { text: "A secure digital vault", score: { Cyber: 3 } }
    ]
  },
  {
    q: "How do you handle pressure?",
    options: [
      { text: "Stay calm and follow process", score: { QA: 2, DevOps: 1 } },
      { text: "Get creative and find new solutions", score: { UIUX: 2, GameDev: 1 } },
      { text: "Use logic and analysis", score: { Data: 2, FullStack: 1 } },
      { text: "Take charge and secure everything", score: { Cyber: 2 } }
    ]
  },
  {
    q: "Which project sounds more fun?",
    options: [
      { text: "AI that writes stories", score: { GenAI: 3 } },
      { text: "Game with physics and animations", score: { GameDev: 3 } },
      { text: "App that tracks cyber attacks", score: { Cyber: 3 } },
      { text: "Dashboard with real-time charts", score: { Data: 2, FullStack: 1 } }
    ]
  },
  {
    q: "Do you enjoy working with servers & deployments?",
    options: [
      { text: "Yes, I love controlling infra", score: { DevOps: 3 } },
      { text: "Yes, cloud tech is exciting", score: { Cloud: 3 } },
      { text: "Sometimes, but I like coding more", score: { FullStack: 1 } },
      { text: "Not really", score: {} }
    ]
  },
  {
    q: "Pick the phrase that describes you:",
    options: [
      { text: "Creative + Artistic", score: { UIUX: 3 } },
      { text: "Logical + Analytical", score: { Data: 3, Backend: 2 } },
      { text: "Curious + Research-driven", score: { GenAI: 2, Cyber: 1 } },
      { text: "Builder + Finisher", score: { FullStack: 2 } }
    ]
  },
  {
    q: "Which environment do you enjoy coding in?",
    options: [
      { text: "Web browsers", score: { FullStack: 3 } },
      { text: "Mobile phones", score: { Mobile: 3 } },
      { text: "VR headsets / 3D worlds", score: { ARVR: 3 } },
      { text: "Command line tools", score: { DevOps: 2 } }
    ]
  },
  {
    q: "What kind of challenges excite you?",
    options: [
      { text: "Design challenges", score: { UIUX: 3 } },
      { text: "Scaling millions of users", score: { DevOps: 3, Cloud: 2 } },
      { text: "AI creativity challenges", score: { GenAI: 3 } },
      { text: "Security attack simulations", score: { Cyber: 3 } }
    ]
  }
];
