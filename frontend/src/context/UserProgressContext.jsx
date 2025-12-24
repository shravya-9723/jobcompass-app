import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api"; // Your axios instance

const UserProgressContext = createContext();

const LEVEL_XP = { 1: 500, 2: 700, 3: 1000 };

export function UserProgressProvider({ children }) {
  // 1. Initialize State with NULL (not hardcoded)
  const [progress, setProgress] = useState({
    role: null,         // <--- FIXED: Starts empty
    title: "Novice",
    level: 1,
    xp: 0,
    streak: 0,
    completedLevels: [],
    unlockedLevels: [1],
    currentQuest: 1,
    bossUnlocked: false,
  });

  const [loading, setLoading] = useState(true);

  // 2. Load Progress from Backend on Startup
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Fetch user profile from DB (You need this endpoint, or use localStorage for now)
          // const res = await api.get("/user/profile"); 
          // setProgress(res.data);
          
          // Fallback: Check localStorage for role if DB not ready
          const savedRole = localStorage.getItem("recommendedRole");
          if (savedRole) {
            setProgress(prev => ({ ...prev, role: savedRole }));
          }
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  // 3. Helper to Update Role (called by Popup or Quiz)
  function setRole(newRole) {
    localStorage.setItem("recommendedRole", newRole);
    setProgress(prev => ({ ...prev, role: newRole, title: "Apprentice" }));
    // TODO: Sync with Backend here if needed
    // api.post("/user/update-role", { role: newRole });
  }

  function completeLevel(levelId) {
    setProgress((prev) => {
      const nextLevel = levelId + 1;
      return {
        ...prev,
        completedLevels: [...prev.completedLevels, levelId],
        unlockedLevels: prev.unlockedLevels.includes(nextLevel)
          ? prev.unlockedLevels
          : [...prev.unlockedLevels, nextLevel],
        currentQuest: nextLevel,
        xp: prev.xp + 500 // Instant visual reward
      };
    });
  }

  function addXP(amount) {
    setProgress((prev) => {
      let xp = prev.xp + amount;
      let level = prev.level;
      while (xp >= LEVEL_XP[level]) {
        xp -= LEVEL_XP[level];
        level += 1;
      }
      return { ...prev, xp, level };
    });
  }

  return (
    <UserProgressContext.Provider value={{ progress, setRole, completeLevel, addXP, loading }}>
      {children}
    </UserProgressContext.Provider>
  );
}

export const useProgress = () => useContext(UserProgressContext);