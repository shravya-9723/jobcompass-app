import express from "express";
import { Message } from "../models/Message.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Create new message in DB
    await Message.create({ name, email, message });
    
    res.status(201).json({ success: true, message: "Transmission Received" });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ success: false, message: "Transmission Failed" });
  }
});

export default router;