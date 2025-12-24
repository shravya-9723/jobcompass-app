import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoleSelectionModal from "../components/RoleSelectionModal";
import { useProgress } from "../context/UserProgressContext"; 
import api from "../utils/api";
import "../styles/roadmap2.css";

export default function Roadmap() {
  const navigate = useNavigate();
  const { progress, setRole } = useProgress(); 
  
  // MAIN STATE
  const [roadmap, setRoadmap] = useState(null);
  const [history, setHistory] = useState([]); // Stores list of past roadmaps
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0); 
  const [activeTab, setActiveTab] = useState("intel"); 
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false); 
  const [openQA, setOpenQA] = useState(null);
  
  // ✅ NEW: Loading Text State
  const [loadingText, setLoadingText] = useState("INITIALIZING UPLINK...");

  // ✅ LOADING TEXT CYCLER (The Gamified Wait)
  useEffect(() => {
    if (!loading) return;
    
    const messages = [
      "ESTABLISHING SECURE CONNECTION...",
      "ANALYZING CAREER MARKET DATA...",
      "GENERATING 20-STEP STRATEGY...",
      "FETCHING YOUTUBE & GITHUB ASSETS...",
      "COMPILING INTERVIEW MATRIX...",
      "FINALIZING PROJECT ARCHITECTURE...",
      "ENCRYPTING DATA PACKETS..."
    ];
    
    let i = 0;
    setLoadingText(messages[0]);
    
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 4000); // Change message every 4 seconds
    
    return () => clearInterval(interval);
  }, [loading]);

  // INITIAL FETCH
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!progress.role) setShowModal(true);
      else {
        fetchLatestRoadmap(progress.role);
        fetchHistory(); 
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [progress.role]);

  // 1. GET LATEST ROADMAP
  const fetchLatestRoadmap = async (roleName) => {
    try {
      setLoading(true);
      const res = await api.get(`/roadmaps?role=${roleName}`); 
      
      if (res.data && res.data.length > 0) {
        const foundMap = res.data[0];
        // Check if map is "Old" (missing new features like stepResources or miniProject)
        // Also check if steps < 5 (bad generation)
        if (!foundMap.steps[0]?.miniProject || !foundMap.steps[0]?.stepResources || foundMap.steps.length < 5) {
           console.log("⚠️ Old/Incomplete data detected. Auto-upgrading...");
           generateRoadmap(roleName); 
        } else {
           setRoadmap(foundMap);
           setLoading(false);
        }
      } else {
        generateRoadmap(roleName);
      }
    } catch (err) {
      generateRoadmap(roleName); 
    }
  };

  // 2. GET HISTORY LIST
  const fetchHistory = async () => {
    try {
      const res = await api.get("/roadmaps/history"); 
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  // 3. LOAD SPECIFIC HISTORY ITEM
  const loadHistoryItem = async (id) => {
    try {
      setLoading(true);
      setShowHistoryModal(false);
      const res = await api.get(`/roadmaps/${id}`);
      setRoadmap(res.data);
    } catch (err) {
      alert("Could not load that version.");
    } finally {
      setLoading(false);
    }
  };

  // 4. GENERATE NEW (AI)
  const generateRoadmap = async (roleName) => {
    try {
      setLoading(true);
      const res = await api.post("/ai/roadmap", { career: roleName });
      setRoadmap(res.data.roadmap);
      fetchHistory(); // Refresh history list
    } catch (err) {
      alert("System Offline. Using Backup.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (window.confirm("Force full regeneration? (This takes ~45 seconds for High Quality Data)")) {
      generateRoadmap(progress.role);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole); 
    setShowModal(false);
  };

  // HELPER STYLES
  const getStageStyle = (stage) => {
    if (!stage) return "";
    const s = stage.toLowerCase();
    if (s.includes("beginner")) return "stg-b";
    if (s.includes("intermediate")) return "stg-i";
    return "stg-a";
  };

  const getResourceIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('github')) return '🐙'; 
    if (n.includes('doc')) return '📄';    
    if (n.includes('practice')) return '⚔️'; 
    if (n.includes('youtube')) return '📺'; 
    return '🔗'; 
  };

  // --- RENDERING ---

  if (loading) return (
    <div className="roadmap-loading">
      <div className="loader-rune"></div>
      <h2 className="animate-pulse" style={{fontFamily: 'Cinzel', color: 'cyan', letterSpacing: '2px', textAlign: 'center'}}>
        {loadingText}
      </h2>
      <p style={{color: '#666', fontSize: '12px', marginTop: '10px'}}>
        Building 20+ Steps, Projects & Resources...
      </p>
    </div>
  );

  const currentStep = roadmap?.steps?.[activeStep] || {};

  return (
    <div className="roadmap-page">
      <Navbar />
      
      {/* MODALS */}
      {showModal && <RoleSelectionModal onSelect={handleRoleSelect} />}
      
      {/* ✅ FIXED ARCHIVE MODAL (Scrollable List Cards) */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
          {/* Container with max-height and scrolling */}
          <div className="bg-slate-900 border border-cyan-500 w-[400px] max-h-[80vh] flex flex-col rounded-lg shadow-2xl shadow-cyan-500/20">
            
            {/* Header (Fixed) */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-slate-900 rounded-t-lg">
              <h3 className="text-cyan-400 font-bold text-lg tracking-widest">ARCHIVE LOGS</h3>
              <button 
                onClick={() => setShowHistoryModal(false)} 
                className="text-gray-400 hover:text-white font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Scrollable List Area */}
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No saved roadmaps found.</p>
              ) : (
                history.map((item) => (
                  <div 
                    key={item._id}
                    onClick={() => loadHistoryItem(item._id)}
                    className="p-4 bg-gray-800 border border-gray-700 rounded hover:border-cyan-400 hover:bg-gray-750 cursor-pointer transition-all flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-sm">{item.career}</span>
                      {item.progress > 0 && (
                        <span className="text-[10px] bg-green-900 text-green-400 px-2 py-0.5 rounded">
                          {item.progress}%
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs mt-1">
                      <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>⏱ {item.estimatedTime || "6 Months"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer (Fixed) */}
            <div className="p-3 border-t border-gray-700 bg-slate-900 rounded-b-lg text-center">
              <span className="text-gray-600 text-[10px]">SELECT A VERSION TO LOAD</span>
            </div>
          </div>
        </div>
      )}

      {!showModal && (
        <div className="roadmap-layout">
          
          {/* LEFT: MISSION LOG */}
          <div className="mission-log">
            <div className="log-header">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setShowModal(true)} className="text-cyan-400 text-[10px] uppercase tracking-widest hover:text-white border-b border-cyan-900 pb-1">⬅ CHANGE CLASS</button>
                <button onClick={() => navigate("/dashboard")} className="text-gray-500 text-[10px] tracking-widest hover:text-white">EXIT</button>
              </div>
              <h2 className="log-title">{roadmap?.title || progress.role}</h2>
              <p className="log-subtitle">EST. TIME: {roadmap?.estimatedTime || "UNKNOWN"}</p>
            </div>
            
            <div className="mission-list custom-scrollbar">
              {roadmap?.steps?.map((step, index) => (
                <div 
                  key={index} 
                  className={`mission-item ${activeStep === index ? 'active' : ''}`}
                  onClick={() => { setActiveStep(index); setOpenQA(null); }}
                >
                  <span className="mission-id">{index + 1 < 10 ? `0${index+1}` : index+1}</span>
                  <div className="mission-info">
                    {step.stage && <span className={`stage-tag ${getStageStyle(step.stage)}`}>{step.stage}</span>}
                    <div className="mission-task">{step.task}</div>
                    <div className="mission-time">{step.duration}</div>
                  </div>
                  {activeStep === index && <span style={{color:'cyan', fontSize:'10px'}}>▶</span>}
                </div>
              ))}
            </div>

            {/* ✅ BOTTOM BUTTON: PREVIOUS VERSIONS */}
            <div className="p-4 border-t border-cyan-900/30 bg-black/20 mt-auto">
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="w-full py-3 bg-slate-800 border border-slate-600 text-gray-300 text-xs tracking-widest hover:bg-cyan-900/50 hover:text-cyan-400 hover:border-cyan-500 transition-all rounded font-bold flex justify-center items-center gap-2"
              >
                <span>📜</span> ACCESS ARCHIVES
              </button>
            </div>
          </div>

          {/* RIGHT: DATA TERMINAL (Keep existing code) */}
          <div className="data-terminal">
            <div className="terminal-header">
              <span className="terminal-title">MISSION CONTROL</span>
              
              {/* ✅ FIXED BUTTON GROUP WITH GAP */}
              <div className="flex gap-4 w-full mt-6"> 
                
                <button 
                  onClick={handleRegenerate} 
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 uppercase tracking-wider text-xs rounded transition-colors"
                >
                  ⚡ FORCE REGEN
                </button>

                <button 
                  onClick={() => setShowModal(true)} 
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 uppercase tracking-wider text-xs rounded transition-colors border border-gray-600"
                >
                  🔄 RESELECT
                </button>

              </div>
            </div>

            <div className="terminal-tabs">
              <button className={`tab-btn ${activeTab === 'intel' ? 'active' : ''}`} onClick={() => setActiveTab('intel')}>INTEL</button>
              <button className={`tab-btn ${activeTab === 'learn' ? 'active' : ''}`} onClick={() => setActiveTab('learn')}>RESOURCES</button>
              <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>PROJECTS</button>
              <button className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>INTERVIEW</button>
            </div>

            <div className="terminal-content custom-scrollbar">
              
              {/* TAB 1: INTEL */}
              {activeTab === 'intel' && (
                <div className="animate-in fade-in">
                  <div className="intel-box">
                    <span className="intel-label">CURRENT OBJECTIVE</span>
                    <h1 className="text-2xl font-bold text-white mb-2">{currentStep.task}</h1>
                    <p className="intel-text">{currentStep.why}</p>
                    <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-3">
                        <span className="text-gray-500 text-xs uppercase tracking-widest">DIFFICULTY:</span>
                        <span className={`stage-tag ${getStageStyle(currentStep.stage)}`} style={{fontSize:'12px'}}>
                          {currentStep.stage || "CORE"}
                        </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESOURCES */}
              {activeTab === 'learn' && (
                <div className="animate-in fade-in">
                    <h3 className="text-cyan-400 font-[Cinzel] mb-4">STEP RESOURCES</h3>
                    <div className="space-y-3">
                      <a href={`https://www.youtube.com/results?search_query=${currentStep.task} tutorial`} target="_blank" rel="noreferrer" className="res-card">
                         <span className="res-icon" style={{color:'red'}}>▶</span>
                         <div className="res-info"><h4>Watch Tutorials</h4><span>YouTube Search</span></div>
                      </a>
                      {currentStep.stepResources?.map((res, i) => (
                        <a key={i} href={res.url} target="_blank" rel="noreferrer" className="res-card">
                          <span className="res-icon">{getResourceIcon(res.name)}</span>
                          <div className="res-info">
                            <h4>{res.name.replace(/^(Doc:|Practice:|GitHub:)\s*/i, '')}</h4>
                            <span>{res.name.split(':')[0]}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                </div>
              )}

              {/* TAB 3: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="animate-in fade-in">
                  <h3 className="text-cyan-400 font-[Cinzel] mb-4">MINI PROJECT: {currentStep.task}</h3>
                  {currentStep.miniProject ? (
                    <div className="intel-box" style={{borderColor: '#22c55e'}}>
                      <h4 className="font-bold text-white text-lg mb-2">{currentStep.miniProject.idea}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <span className="intel-label">TOOLS REQUIRED</span>
                          <p className="text-sm text-gray-300">{currentStep.miniProject.tools}</p>
                        </div>
                        <div>
                          <span className="intel-label">EXPECTED OUTPUT</span>
                          <p className="text-sm text-gray-300">{currentStep.miniProject.expectedOutput}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No specific project available.</p>
                  )}
                </div>
              )}

              {/* TAB 4: INTERVIEW */}
              {activeTab === 'interview' && (
                <div className="animate-in fade-in">
                  <h2 className="text-cyan-400 font-[Cinzel] mb-4 text-lg">TOPIC: {currentStep.task}</h2>
                  {currentStep.interviewPairs && currentStep.interviewPairs.length > 0 ? (
                    currentStep.interviewPairs.map((pair, idx) => (
                      <div key={idx} className="qa-card">
                        <div className="qa-header" onClick={() => setOpenQA(openQA === idx ? null : idx)}>
                          <span>{pair.question}</span>
                          <span style={{color:'cyan'}}>{openQA === idx ? "▲" : "▼"}</span>
                        </div>
                        {openQA === idx && (
                          <div className="qa-body">{pair.answer}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No interview questions loaded.</p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}