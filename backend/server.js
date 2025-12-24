import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"; // ✅ 1. IMPORT THIS

dotenv.config();

// Connect to DB
connectDB().then(() => {
    console.log("✅ MongoDB Connected Successfully");
}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
});

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // Allow all connections (Fixes Network Error)
app.use(express.json());

// Logging (Helps you see if the request hits the server)
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/contact", contactRoutes); // ✅ 2. ADD THIS LINE

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));