// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Helper to create JWT
function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
}

// REGISTER (email + password + name) -> returns token
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ message: "Name, email and password are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // return token so frontend can auto-login
    const token = createToken(newUser);
    res.json({ token, message: "Account created successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (email + password) -> returns token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GOOGLE LOGIN (from frontend Firebase result)
// Expects: { email, googleId, name }
// If user exists with googleId or email -> return token. Otherwise create user with googleId.
router.post("/google", async (req, res) => {
  try {
    const { email, googleId, name } = req.body;
    if (!email || !googleId) return res.status(400).json({ message: "Invalid payload" });

    // Prefer matching by googleId first, then by email
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (user) {
      // If user doesn't have googleId but we matched by email, attach it
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user with googleId (no password)
      user = new User({ name: name || email.split("@")[0], email, googleId });
      await user.save();
    }

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth API working" });
});

export default router;
