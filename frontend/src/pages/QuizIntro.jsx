import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quizintro.css";
import Butterflies from "../components/Butterflies";

export default function QuizIntro() {
  const navigate = useNavigate();
  const [showParchment, setShowParchment] = useState(false); // 🔒 Locked initially

  // Function to unlock the parchment
  const handleContinue = () => {
    const audio = new Audio("/assets/reveal.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("Audio blocked:", e));
    
    setShowParchment(true); // 🔓 Unlock!
  };

  return (
    <div className="intro-bg">
      <Butterflies count={20} />
      <div className="dark-overlay"></div>

      {/* STAGE 1: THE MYSTERIOUS BUTTON */}
      {!showParchment && (
        <button 
          className="continue-btn animate-pulse-glow"
          onClick={handleContinue}
        >
          CONTINUE...
        </button>
      )}

      {/* STAGE 2: THE ANCIENT PARCHMENT (Summoned) */}
      {showParchment && (
        <div className="scroll-card animate-summon">
          <h1 className="game-font">🧭 QUEST OF DESTINY</h1>
          <p>
            The map is laid out before you.<br />
            The stars await your command.<br />
            <strong>Are you ready to find your path?</strong>
          </p>

          <button className="begin-btn" onClick={() => navigate("/quiz")}>
            ⚔️ BEGIN QUEST ⚔️
          </button>
        </div>
      )}
    </div>
  );
}