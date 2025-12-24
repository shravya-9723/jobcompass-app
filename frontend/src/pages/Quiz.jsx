import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizQuestions } from "../data/quizData";
import "../styles/quiz.css";
import Butterflies from "../components/Butterflies"; 

export default function Quiz() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [animate, setAnimate] = useState(false);

  // Role Mapping Logic (Keep your existing map here)
  const rolesMap = {
    FullStack: "Full Stack Developer",
    Backend: "Backend Engineer",
    GenAI: "GenAI Engineer",
    Data: "Data Engineer",
    Cyber: "Cybersecurity Engineer",
    Cloud: "Cloud Native Developer",
    DevOps: "DevOps / SRE",
    Mobile: "Mobile Developer",
    UIUX: "UI/UX Engineer",
    QA: "QA Automation / SDET",
    ARVR: "AR/VR Developer",
    Blockchain: "Blockchain Developer",
    GameDev: "Game Developer"
  };

  function chooseOption(scoreObj) {
    const newScores = { ...scores };
    for (const key in scoreObj) {
      newScores[key] = (newScores[key] || 0) + scoreObj[key];
    }
    setScores(newScores);
    setAnimate(true);

    setTimeout(() => {
      if (index + 1 < quizQuestions.length) {
        setIndex(index + 1);
        setAnimate(false);
      } else {
        finishQuiz(newScores);
      }
    }, 400);
  }

  function finishQuiz(finalScores) {
    let best = null;
    let max = 0;
    for (const key in finalScores) {
      if (finalScores[key] > max) {
        max = finalScores[key];
        best = key;
      }
    }
    const recommended = rolesMap[best] || "Full Stack Developer";
    localStorage.setItem("recommendedRole", recommended);
    navigate("/reward");
  }

  const q = quizQuestions[index];
  const progress = ((index + 1) / quizQuestions.length) * 100;

  return (
    <div className="quiz-bg">
      {/* 🦋 50 BUTTERFLIES FOR MAX MAGIC */}
      <Butterflies count={50} />

      <h2 className="quiz-title">⚡ CHOOSE YOUR DESTINY</h2>
      
      {/* MANA BAR PROGRESS */}
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className={`quiz-card ${animate ? "fade-out" : "fade-in"}`}>
        <p className="question-text">{q.q}</p>

        <div className="options-wrap">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => chooseOption(opt.score)}
              className="option-btn"
            >
              <span className="btn-glow"></span>
              {opt.text}
            </button>
          ))}
        </div>

        <p className="counter">
          Riddle {index + 1} of {quizQuestions.length}
        </p>
      </div>
    </div>
  );
}