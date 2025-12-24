import React from "react";
import "../styles/roadmap.css";

// EXACT DATA MATCHING YOUR ASSETS
const ROLE_DATA = [
  { name: "Full Stack", title: "The Architect", desc: "Master of Web", img: "/assets/card-fullstack.jpg" },
  { name: "GenAI Eng.", title: "The Oracle", desc: "LLMs & RAG", img: "/assets/card-genai.jpg" },
  { name: "Cloud Native", title: "Sky Warden", desc: "AWS & K8s", img: "/assets/card-cloud.jpg" },
  { name: "DevOps / SRE", title: "System Mancer", desc: "Scale Systems", img: "/assets/card-devops.jpg" },
  { name: "Data Eng.", title: "The Keeper", desc: "Big Data Pipes", img: "/assets/card-data.jpg" },
  { name: "Cybersecurity", title: "Netrunner", desc: "Network Defense", img: "/assets/card-cyber.jpg" },
  { name: "Web3 Dev", title: "Chain Binder", desc: "Smart Contracts", img: "/assets/card-web3.jpg" },
  { name: "AR/VR Dev", title: "Reality Warper", desc: "Spatial Comp.", img: "/assets/card-arvr.jpg" },
  { name: "Game Dev", title: "World Builder", desc: "Unity & Unreal", img: "/assets/card-game.jpg" },
  { name: "Mobile Dev", title: "Pocket Mage", desc: "iOS & Android", img: "/assets/card-mobile.jpg" },
  { name: "QA Auto.", title: "Bug Hunter", desc: "Testing & SDET", img: "/assets/card-qa.jpg" },
  { name: "UI/UX Eng.", title: "Illusionist", desc: "Design Systems", img: "/assets/card-uiux.jpg" },
];

export default function RoleSelectionModal({ onSelect }) {
  return (
    <div className="role-modal-overlay">
      <div className="role-modal-container">
        
        {/* HEADER */}
        <div className="role-modal-header">
          <div className="system-tag">System Initialized</div>
          <h1 className="main-title">CHOOSE YOUR CLASS</h1>
        </div>

        {/* SCROLLABLE GRID */}
        <div className="role-grid-scroll custom-scrollbar">
          <div className="role-grid">
            {ROLE_DATA.map((role) => (
              <div 
                key={role.name} 
                className="role-card" 
                onClick={() => onSelect(role.name)}
              >
                {/* Background Image */}
                <img src={role.img} alt={role.name} className="card-bg" />
                
                {/* Content Overlay */}
                <div className="card-content">
                  <div className="class-title">{role.title}</div>
                  <h3 className="role-name">{role.name}</h3>
                  <div className="role-desc">[{role.desc}]</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="role-modal-footer">
          <span className="footer-text">UNCERTAIN OF DESTINY?</span>
          <a href="/quiz-intro" className="quiz-link">
            INITIATE APTITUDE TEST
          </a>
        </div>

      </div>
    </div>
  );
}