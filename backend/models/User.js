// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String }, // hashed password for email/password users
    googleId: { type: String }, // present for Google users
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
