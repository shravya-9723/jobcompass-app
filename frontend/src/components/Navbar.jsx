import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Used to highlight active link

  const handleLogout = async () => {
    try {
      await signOut(auth);
      
      // ✅ CLEAR EVERYTHING
      localStorage.removeItem("jobcompass_user");
      localStorage.removeItem("token");
      localStorage.removeItem("recommendedRole"); 
      
      // Force reload to clear React state
      window.location.href = "/"; 
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Helper for active styling (optional, keeps your holo look)
  const getLinkClass = (path) => {
    const baseClass = "holo-text transition-all duration-300";
    return location.pathname === path 
      ? `${baseClass} opacity-100 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]` 
      : `${baseClass} opacity-70 hover:opacity-100`;
  };

  return (
    <nav 
      id="game-navbar"
      className="bg-[#050505]/95 backdrop-blur-xl border-b border-[#333] flex items-center justify-between px-10 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
      // 🛡️ INLINE STYLES: Forces Fixed Position
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "90px", 
        zIndex: 100,
        display: "flex" 
      }}
    >

      {/* 🛡️ LEFT: LOGO */}
      <Link to="/dashboard" className="flex items-center gap-4 group min-w-[200px]">
        {/* Animated Orb */}
        <div className="w-12 h-12 rounded-full 
          bg-gradient-to-br from-cyan-400 via-purple-500 to-amber-400 
          shadow-[0_0_15px_#22d3ee] 
          group-hover:shadow-[0_0_30px_#d946ef] 
          group-hover:scale-110 transition-all duration-300 border-2 border-white/10">
        </div>

        <div className="flex flex-col">
          <span className="gem-text text-xl tracking-widest font-bold leading-none">
            JOB COMPASS
          </span>
        </div>
      </Link>

      {/* 🧭 CENTER: NAVIGATION LINKS */}
      <div className="hidden md:flex gap-12 absolute left-1/2 transform -translate-x-1/2">
        <Link to="/dashboard" className={getLinkClass("/dashboard")}>
          COMMAND CENTER
        </Link>

        <Link to="/roadmap" className={getLinkClass("/roadmap")}>
          ROADMAP
        </Link>

        <Link to="/interview" className={getLinkClass("/interview")}>
          TRAINING SIM
        </Link>

        {/* ✅ UPDATED: Links to New Pages */}
        <Link to="/about" className={getLinkClass("/about")}>
          ABOUT
        </Link>

        <Link to="/contact" className={getLinkClass("/contact")}>
          CONTACT
        </Link>
      </div>

      {/* 🔴 RIGHT: LOGOUT BUTTON */}
      <div className="min-w-[200px] flex justify-end">
        <button           onClick={handleLogout}
          className="px-8 py-3 border border-[#444] rounded-lg 
          text-[12px] tracking-[0.3em] font-bold text-gray-300 bg-black 
          hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]
          transition-all duration-300 tech-font log"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}