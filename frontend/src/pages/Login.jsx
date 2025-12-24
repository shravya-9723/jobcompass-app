import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import api from "../utils/api"; // axios instance

// Import the initialized instances from your corrected firebase.js file
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [activeLevel, setActiveLevel] = useState(0);
  const [stars, setStars] = useState([]);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const colors = ["#ffffff", "#ff00cc", "#00ffff", "#ffff00", "#00ff00", "#ff4444"];
    setStars(
      [...Array(30)].map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 2 + 3}s`,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    );
  }, []);

  // Backend EMAIL login
  const handleEmailLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // Save token from your backend
      localStorage.setItem("token", res.data.token);

      alert("🔓 Welcome Back, Warrior!");
      navigate("/dashboard");
      localStorage.removeItem("recommendedRole");

    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "⚠️ Login failed");
    }
  };

  // GOOGLE SOCIAL LOGIN
  const handleSocialLogin = async () => {
    try {
      // Use the imported auth and provider from src/firebase.js
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Send to backend to upsert user and get token
      const res = await api.post("/auth/google", {
        email: googleUser.email,
        googleId: googleUser.uid,
        name: googleUser.displayName,
      });

      localStorage.setItem("token", res.data.token);

      alert(`⚔ Welcome, ${googleUser.displayName || "Hero"}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("⚠️ Google login failed");
    }
  };

  const levels = [
    { title: "NOVICE", icon: "⚔️", quote: "Begin your journey." },
    { title: "APPRENTICE", icon: "🛡️", quote: "Forge your skills." },
    { title: "ADEPT", icon: "📜", quote: "Knowledge is power." },
    { title: "MAGE", icon: "🔮", quote: "Code is magic." },
    { title: "ARCHITECT", icon: "🏛️", quote: "Design the future." },
    { title: "MASTER", icon: "👑", quote: "Lead the realm." },
    { title: "GOD MODE", icon: "⚡", quote: "Total control." },
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: "#050505", color: "white" }}>
      {stars.map((s) => (
        <div key={s.id} className="shooting-star" style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.duration, "--star-color": s.color }} />
      ))}

      <div className="main-container">
        <div className="runic-staff">
          {levels.map((lvl, index) => (
            <div key={index} onClick={() => setActiveLevel(index)} className={`rune-socket ${activeLevel === index ? "active" : ""}`} title={lvl.title}>
              <div className="flex items-center justify-center text-xl select-none">{lvl.icon}</div>
            </div>
          ))}
        </div>

        <div className="rpg-card">
          <div className="mb-8 w-full flex flex-col items-center justify-center text-center">
            <span className="text-cyan-600 text-[10px] tracking-[0.5em] font-bold uppercase game-font block text-center">Level {activeLevel + 1}</span>
            <h1 style={{ padding: "10px" }} className="text-4xl mt-3 mb-3 gem-text w-full text-center">{levels[activeLevel].title}</h1>
            <p className="text-gray-500 italic text-xs game-font tracking-wide text-center px-4">"{levels[activeLevel].quote}"</p>
          </div>

          <form className="flex flex-col">
            <input style={{ marginTop: "20px" }} type="email" placeholder="EMAIL" className="fantasy-input" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="relative w-full">
              <input type={showPassword ? "text" : "password"} placeholder="PASSWORD" className="fantasy-input pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[22px] -translate-y-1/2 text-cyan-500 hover:text-white transition-colors cursor-pointer" style={{ background: "transparent", border: "none" }}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button style={{ marginBottom: "20px", marginTop: "10px" }} type="button" className="mint-btn" onClick={handleEmailLogin}>
              ENTER REALM
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-500 tracking-widest game-font">NEW HERE? <Link style={{ color: "cyan" }} to="/register" className="text-cyan-400 hover:text-white transition cursor-pointer font-bold ml-1">CREATE HERO</Link></div>

          <div className="my-6 flex items-center opacity-30">
            <div className="h-px bg-white grow" />
            <span className="px-3 text-[10px] tracking-widest font-bold text-gray-400 game-font">SUMMON WITH</span>
            <div className="h-px bg-white grow" />
          </div>

          <div className="flex justify-center mb-5">
            <button style={{ marginTop: "20px" }} onClick={handleSocialLogin} className="game-circle-btn" title="Sign in with Google">
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 8.16-3.293 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.133H12.48z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}