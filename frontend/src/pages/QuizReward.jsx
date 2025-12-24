import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reward.css";

export default function QuizReward() {
  const navigate = useNavigate();
useEffect(() => {
  const audio = new Audio("/assets/reward.mp3");
  audio.play();

  setTimeout(() => navigate("/reveal"), 2500);
}, []);


  return (
    <div className="reward-bg flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="reward-title">✨ QUEST COMPLETE!</h1>
      <p className="reward-sub">Your brilliance has earned you XP...</p>
      <div className="xp-orb">+100 XP</div>
    </div>
  );
}
