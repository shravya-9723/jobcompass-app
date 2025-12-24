import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MagicalCompass from "../components/MagicalCompass";
import ProfileCard from "../components/ProfileCard";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const recommendedRole = localStorage.getItem("recommendedRole");

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-content">

        {/* STATUS */}
        <div className="system-text">
          <p>SYSTEM ONLINE</p>
          <h1>
            {recommendedRole ? "DESTINY REVEALED" : "DESTINY UNALIGNED"}
          </h1>
        </div>

        {/* COMPASS */}
        <div className="compass-holder">
          <MagicalCompass
            recommendedRole={recommendedRole || null}
          />
        </div>

        {/* PRIMARY ACTION */}
        <button
          className="primary-btn"
          onClick={() =>
            navigate(recommendedRole ? "/roadmap" : "/quiz-intro")
          }
        >
          {recommendedRole ? "ENTER ROADMAP" : "START DESTINY"}
        </button>

        {/* SECONDARY */}
        {recommendedRole && (
          <button
            className="secondary-btn"
            onClick={() => navigate("/quiz-intro")}
          >
            ↻ REALIGN DESTINY
          </button>
        )}

        {/* PROFILE */}
        <div className="profile-wrap">
          <ProfileCard />
        </div>

      </div>
    </div>
  );
}
