import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResultModal({ score, maxXP, role, mode, onClose }) {
  const navigate = useNavigate();
  
  // 1. Calculate Percentage
  const safeMax = maxXP || 100; // Prevent divide by zero
  const percentage = Math.min(100, Math.round((score / safeMax) * 100));

  // 2. Determine Rank & Message
  let rank = "F";
  let title = "TERMINATED";
  let statusClass = "status-fail";
  let bgClass = "bg-fail";
  let textClass = "text-fail";
  let message = "Performance below baseline. Re-calibration required.";

  if (percentage >= 90) {
    rank = "S"; title = "LEGENDARY"; statusClass = "status-pass"; bgClass = "bg-pass"; textClass = "text-pass";
    message = "Exceptional demonstration of skill. You are ready for deployment.";
  } else if (percentage >= 75) {
    rank = "A"; title = "HIRED"; statusClass = "status-pass"; bgClass = "bg-pass"; textClass = "text-pass";
    message = "Solid performance. Welcome to the team.";
  } else if (percentage >= 50) {
    rank = "B"; title = "CONDITIONAL"; statusClass = "status-pass"; bgClass = "bg-pass"; textClass = "text-pass"; // Technically pass but warning
    message = "Potential detected, but significant gaps remain.";
  }

  // 3. Fallback for Role if it's missing
  const displayRole = role || "CANDIDATE";

  return (
    <div className="modal-overlay">
      <div className={`result-card ${statusClass}`}>
        
        {/* Top Glow Strip */}
        <div className={`result-glow ${bgClass}`}></div>

        <div className="text-xs text-gray-500 uppercase tracking-[0.3em] mb-4">MISSION REPORT</div>

        {/* Big Title (HIRED / TERMINATED) */}
        <h1 className={`report-title ${textClass}`}>{title}</h1>

        {/* Rank & Percentage */}
        <div className="rank-container">
          <div className="rank-display">
            <span className={`rank-letter ${textClass}`}>{rank}</span>
            <span className="stat-label">RANK OBTAINED</span>
          </div>
          <div className="divider-vertical"></div>
          <div className="rank-display">
            <span className="text-4xl font-bold text-white font-mono">{percentage}%</span>
            <span className="stat-label">SYNC RATE</span>
          </div>
        </div>

        {/* AI Feedback Message */}
        <div className="feedback-box">
          <p className="feedback-text">"{message}"</p>
        </div>

        {/* Technical Stats Grid */}
        <div className="stats-grid">
          <div className="stat-item">
            <span className="text-gray-500">ROLE</span>
            <span className="stat-val">{displayRole}</span>
          </div>
          <div className="stat-item">
            <span className="text-gray-500">PROTOCOL</span>
            <span className="stat-val">{mode?.toUpperCase()}</span>
          </div>
          <div className="stat-item">
            <span className="text-gray-500">TOTAL XP</span>
            <span className="stat-val text-yellow-500">{score} / {safeMax}</span>
          </div>
          <div className="stat-item">
            <span className="text-gray-500">STATUS</span>
            <span className={`stat-val ${percentage >= 50 ? 'text-green-400' : 'text-red-400'}`}>
              {percentage >= 50 ? 'CLEARED' : 'FAILED'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-bold uppercase tracking-widest text-xs transition"
          >
            Return to Base
          </button>
          <button 
            onClick={onClose}
            className={`flex-1 py-3 rounded font-bold uppercase tracking-widest text-xs transition text-white shadow-lg ${
              percentage >= 50 ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {percentage >= 50 ? 'Next Mission' : 'Retry Simulation'}
          </button>
        </div>

      </div>
    </div>
  );
}