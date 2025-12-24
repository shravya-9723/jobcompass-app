import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar"; // Kept for navigation, but we overlay it
import { useProgress } from "../context/UserProgressContext";
import api from "../utils/api";
import StarForm from "../components/interview/StarForm"; 
import ResultModal from "../components/interview/ResultModal"; 
import "../styles/interview.css"; 

export default function Interview() {
  const { progress } = useProgress();
  
  // State
  const [interviewData, setInterviewData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const chatEndRef = useRef(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // 1. START SIMULATION
  const handleStart = async (selectedMode) => {
    setMode(selectedMode);
    setLoading(true);
    
    try {
      // Calls our robust backend
      const res = await api.post("/interview/generate", { role: progress.role || "Developer", mode: selectedMode });
      setInterviewData(res.data);
      setMessages([{ role: "assistant", content: `System Online. I am ${res.data.npc.name}. Initializing ${selectedMode} protocol.` }]);
    } catch (err) {
      console.error(err);
      // Even if network fails entirely, show something
      alert("Network Error. Check console.");
      setMode(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. ANSWER HANDLING
  const handleAnswerSubmit = async (answerData) => {
    const txt = typeof answerData === 'string' ? answerData : "[STAR Data Submitted]";
    setMessages(prev => [...prev, { role: "user", content: txt }]);
    setLoading(true);

    try {
      // Mock evaluation for speed/stability
      const currentQ = interviewData.questions[currentQuestionIndex];
      const res = await api.post("/interview/evaluate", {
        role: progress.role,
        mode: mode,
        question: currentQ,
        userAnswer: answerData,
        maxXP: currentQ.xp
      });
      
      const grade = res.data;
      setTotalScore(prev => prev + (grade.score || 0));
      
      setMessages(prev => [...prev, { role: "assistant", content: `Analysis: ${grade.feedback} (+${grade.score} XP)` }]);

      setTimeout(() => {
        setLoading(false);
        setTechInput("");
        
        if (currentQuestionIndex < interviewData.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setMessages(prev => [...prev, { role: "assistant", content: "Loading next vector..." }]);
        } else {
          // Finish
          setShowResult(true);
        }
      }, 1500);

    } catch (e) {
      setLoading(false);
      alert("Evaluation Error");
    }
  };

  const currentQuestion = interviewData?.questions?.[currentQuestionIndex];
  const isTyping = loading;

  return (
    <div className="interview-container">
      <div className="scanlines"></div>
      
      {/* 1. HUD HEADER */}
      <div className="hud-header">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-cyan-400">SIMULATION CORE</h1>
          <div className="text-xs text-gray-400 uppercase tracking-[0.3em]">Role: {progress.role || "UNKNOWN"}</div>
        </div>
        <button onClick={() => window.location.href = '/dashboard'} className="text-red-500 hover:text-white uppercase text-xs tracking-widest border border-red-900 px-4 py-2">
          Exit Simulation
        </button>
      </div>

      {/* 2. MODE SELECTION SCREEN */}
      {!mode && (
        <div className="selection-screen animate-in fade-in zoom-in duration-500">
          <div onClick={() => handleStart('technical')} className="mode-card">
            <div className="text-6xl text-cyan-400 mb-4">⚔️</div>
            <h3>TECHNICAL OPS</h3>
            <p className="text-gray-400 text-sm">System Design & Scenarios</p>
          </div>
          <div onClick={() => handleStart('star')} className="mode-card">
            <div className="text-6xl text-purple-400 mb-4">🧠</div>
            <h3>STAR PROTOCOL</h3>
            <p className="text-gray-400 text-sm">Behavioral Analysis</p>
          </div>
        </div>
      )}

      {/* 3. ACTIVE ARENA */}
      {mode && interviewData && !showResult && (
        <div className="arena-layout animate-in fade-in slide-in-from-bottom-4">
          
          {/* LEFT: NPC CORE */}
          <div className="npc-column">
            <div className="sentinel-core-lg">
              <div className={`core-eye ${isTyping ? 'mood-talking' : 'mood-neutral'}`}></div>
            </div>
            <h2 className="text-2xl font-bold tracking-widest text-white">{interviewData.npc.name}</h2>
            <p className="text-cyan-500 text-xs uppercase tracking-[0.4em] mt-2">ONLINE</p>
          </div>

          {/* RIGHT: TERMINAL */}
          <div className="terminal-column">
            {/* Chat Log */}
            <div className="chat-log custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === 'assistant' ? 'msg-ai' : 'msg-user'}`}>
                  {m.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Question Display */}
            <div className="mb-4 p-4 border-l-4 border-cyan-500 bg-black/30">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Vector</div>
              <div className="text-lg text-white">{currentQuestion?.question}</div>
            </div>

            {/* Input */}
            {currentQuestion?.type === 'behavioral_star' ? (
              <StarForm onSubmit={handleAnswerSubmit} disabled={loading} />
            ) : (
              <div className="input-area">
                <input 
                  type="text" 
                  className="terminal-input"
                  placeholder="Enter command..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit(techInput)}
                />
                <button onClick={() => handleAnswerSubmit(techInput)} disabled={loading} className="terminal-btn">
                  Transmit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. RESULT MODAL */}
      {showResult && (
        <ResultModal 
          score={totalScore} 
          maxXP={interviewData.totalXP} 
          role={progress.role}
          mode={mode}
          onClose={() => window.location.reload()} 
        />
      )}
    </div>
  );
}