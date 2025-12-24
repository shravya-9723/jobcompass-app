import React from "react";
import { useProgress } from "../context/UserProgressContext";
import "./ProfileCard.css";

export default function ProfileCard() {
  const { progress } = useProgress();

  // 1. SAFETY CHECK: If no role, show "Unassigned" state (Prevents Crash)
  if (!progress.role) {
    return (
      <div className="holo-card unassigned">
        <div className="holo-scanner"></div>
        <div className="holo-header justify-center">
          <div className="avatar-frame grayscale">
            <span className="avatar-emoji">❓</span>
          </div>
          <div className="identity-data">
            <h2 className="glitch-text">UNKNOWN</h2>
            <p className="rank-badge">DESTINY UNALIGNED</p>
          </div>
        </div>
        <div className="card-footer justify-center">
          <span className="blink-text">WAITING FOR INPUT...</span>
        </div>
      </div>
    );
  }

  // 2. Dynamic Icon Logic
  const getRoleIcon = (role) => {
    if (!role) return "❓";
    if (role.includes("Full Stack")) return "⚔️";
    if (role.includes("Data")) return "📊";
    if (role.includes("Cyber")) return "🛡️";
    if (role.includes("AI") || role.includes("GenAI")) return "✨";
    if (role.includes("Cloud") || role.includes("DevOps")) return "☁️";
    if (role.includes("Game") || role.includes("AR/VR")) return "🎮";
    return "🔮";
  };

  return (
    <div className="holo-card">
      <div className="holo-scanner"></div> {/* Scanning animation */}
      
      {/* HEADER: AVATAR & ROLE */}
      <div className="holo-header">
        <div className="avatar-frame">
          <div className="avatar-glow"></div>
          <span className="avatar-emoji">{getRoleIcon(progress.role)}</span>
        </div>
        <div className="identity-data">
          {/* text-overflow handling prevents 'cut' text */}
          <h2 className="glitch-text" title={progress.role}>
            {progress.role}
          </h2>
          <p className="rank-badge">{progress.title}</p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="holo-grid">
        <div className="holo-stat">
          <span className="label">LEVEL</span>
          <span className="value text-gold">{progress.level}</span>
        </div>
        <div className="holo-stat">
          <span className="label">STREAK</span>
          <span className="value text-flame">🔥 {progress.streak}</span>
        </div>
        <div className="holo-stat">
          <span className="label">QUESTS</span>
          <span className="value text-cyan">{progress.completedLevels.length}</span>
        </div>
      </div>

      {/* XP PROGRESS BAR */}
      <div className="xp-container">
        <div className="xp-info">
          <span>XP PROGRESS</span>
          <span>{progress.xp} / 1000</span>
        </div>
        <div className="xp-track">
          <div 
            className="xp-fill" 
            style={{ width: `${Math.min(100, (progress.xp / 1000) * 100)}%` }}
          >
            <div className="xp-flare"></div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="status-dot"></div>
        <span>SYSTEM ONLINE</span>
      </div>
    </div>
  );
}