import React from "react";
import Navbar from "../components/Navbar";
import "../styles/about.css"; // Uses the stunning visuals

export default function About() {
  return (
    <div className="about-container">
      <Navbar />
      
      {/* 🕸️ Background Grid */}
      <div className="cyber-grid"></div>

      {/* 🛸 Hero Section */}
      <div className="about-hero">
        <div className="system-status">
          <div className="status-dot"></div>
          <span className="status-text">SYSTEM OPERATIONAL // V2.0</span>
        </div>
        
        <h1 className="hero-title">JOB COMPASS</h1>
        <p className="hero-desc">
          A Next-Generation Career Guidance System powered by Generative AI.
          Bridging the gap between academic theory and industry reality.
        </p>
      </div>

      {/* 📦 Data Modules Grid */}
      <div className="modules-grid animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Module 1: The Problem */}
        <div className="data-module mod-problem">
          <div className="module-header">
            <span className="module-icon">⚠️</span>
            <span className="module-id">ERR_CODE: CHAOS</span>
          </div>
          <h2 className="module-title">The Anomaly</h2>
          <p className="module-text">
            Students suffer from <strong>"Decision Paralysis"</strong> due to overwhelming choices. 
            Educational content is fragmented across disjointed platforms (YouTube, LeetCode, Blogs), 
            lacking a unified mentorship structure.
          </p>
        </div>

        {/* Module 2: The Solution */}
        <div className="data-module mod-solution">
          <div className="module-header">
            <span className="module-icon">🧭</span>
            <span className="module-id">SYS_FIX: GUIDANCE</span>
          </div>
          <h2 className="module-title">The Solution</h2>
          <p className="module-text">
            A comprehensive <strong>Digital Counselor</strong> built on three pillars:
            <br/><br/>
            1. <strong>Discovery:</strong> Logic-based Role Mapping.<br/>
            2. <strong>Roadmap:</strong> Curated Learning Paths.<br/>
            3. <strong>Training:</strong> STAR-Method Behavioral Sim.
          </p>
        </div>

        {/* Module 3: The Tech Stack */}
        <div className="data-module mod-tech">
          <div className="module-header">
            <span className="module-icon">⚡</span>
            <span className="module-id">CORE_ARCH: MERN</span>
          </div>
          <h2 className="module-title">System Specs</h2>
          <p className="module-text">
            Built on the <strong>MERN Stack</strong> (MongoDB, Express, React, Node) for high scalability.
            Features a flexible JSON-based schema for dynamic interviews and real-time AI evaluation using Gemini models.
          </p>
        </div>

      </div>

      {/* 🆔 Developer Badge (Updated) */}
      <div className="dev-section animate-in fade-in zoom-in duration-700 delay-200">
        <div className="security-badge">
          <div className="dev-avatar">👩‍💻</div>
          
          <div className="dev-info">
            <h3>SHRAVYA PALEGARTHULI</h3>
            <span className="dev-role">LEAD SYSTEM ARCHITECT</span>
            
            {/* ✅ FIXED CONTACT LINK */}
            <div className="text-cyan-400 font-mono text-xs tracking-widest mt-2 mb-4">
               <span>CONTACT_LINK: </span>
               <a style={{color:"cyan"}}
                 href="mailto:shravyapalegarthuli79@gmail.com"
                 className="underline hover:text-white transition-colors"
               >
                 Mail ME
               </a>
            </div>
            
            {/* Motivational Message */}
            <div className="guide-info">
              "The future belongs to those who prepare for it today. 
              May your code run clean, your path be clear, and your potential remain infinite. 
              All the best in your career journey."
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}