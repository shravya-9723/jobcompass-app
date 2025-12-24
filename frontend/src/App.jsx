import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizIntro from "./pages/QuizIntro";
import Quiz from "./pages/Quiz";
import QuizReward from "./pages/QuizReward";
import RoleReveal from "./pages/RoleReveal";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Interview from "./pages/Interview";

// ✅ 1. IMPORT THE NEW PAGES
import About from "./pages/About";
import Contact from "./pages/Contact";

import ProtectedRoute from "./components/ProtectedRoute";
import { UserProgressProvider } from "./context/UserProgressContext";

export default function App() {
  return (
    <BrowserRouter>
      {/* 🔑 GLOBAL PROGRESS STATE */}
      <UserProgressProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ✅ 2. ADD THE ROUTES HERE */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Quiz Flow */}
          <Route path="/quiz-intro" element={<QuizIntro />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/reward" element={<QuizReward />} />
          <Route path="/reveal" element={<RoleReveal />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />

        </Routes>
      </UserProgressProvider>
    </BrowserRouter>
  );
}