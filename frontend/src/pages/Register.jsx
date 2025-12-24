// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api"; // axios instance with baseURL: http://localhost:5000/api

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password || !confirmPass) {
      return setError("⚠️ Please fill all fields.");
    }

    if (password !== confirmPass) {
      return setError("⚠️ Passwords do not match.");
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Save token and redirect
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert("🎉 Account forged successfully! Welcome to the Guild.");
      navigate("/dashboard");
      localStorage.removeItem("recommendedRole");

    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "⚠️ Registration failed");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: "#050505", color: "white" }}>
      <div className="rpg-card">
        <h1 style={{ padding: "20px" }} className="gem-text text-3xl mb-6">
          Forge Your Account ⚒️
        </h1>

        {error && (
          <div className="mb-4 px-4 py-2 rounded-md text-xs text-center font-bold tracking-widest bg-red-500/10 border border-red-500/70 text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="NAME"
            className="fantasy-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="EMAIL"
            className="fantasy-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              className="fantasy-input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[22px] -translate-y-1/2 text-cyan-500 hover:text-white transition-colors cursor-pointer"
              style={{ background: "transparent", border: "none" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="CONFIRM PASSWORD"
            className="fantasy-input"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>

        <button className="mint-btn mt-6" onClick={handleRegister}>
          CREATE ACCOUNT
        </button>

        <p style={{ paddingTop: "10px" }} className="mt-5 text-gray-500 text-xs tracking-widest game-font">
          ALREADY A MEMBER?{" "}
          <Link style={{ color: "cyan" }} to="/" className="text-cyan-400 hover:text-white transition font-bold ml-1">
            RETURN TO REALM
          </Link>
        </p>
      </div>
    </div>
  );
}
