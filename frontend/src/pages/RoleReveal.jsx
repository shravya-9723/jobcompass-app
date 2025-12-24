import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reveal.css";
import Butterflies from "../components/Butterflies"; // Import butterflies

export default function RoleReveal() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("recommendedRole") || "Full Stack Developer";
    setRole(stored);

    // FIXED PATH: removed "/sounds" to match your uploaded file
    const audio = new Audio("/assets/reveal.mp3");
    audio.play().catch(e => console.log("Audio play failed:", e)); // Safety catch
  }, []);

  return (
    <div className="reveal-bg">
      <Butterflies /> {/* 🦋 Added Butterflies */}
      
      <h1 className="reveal-title">🏆 YOUR TRUE TECH ROLE</h1>

      <div className="role-card">
        <p className="role-name">{role}</p>
      </div>

      <button className="go-btn" onClick={() => navigate("/dashboard")}>
        ENTER GUILD
      </button>
    </div>
  );
}