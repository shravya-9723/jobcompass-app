import React from "react";
import "./particles.css";

export default function Particles({ count = 30 }) {
  const particles = [...Array(count)];

  return (
    <div className="particle-container">
      {particles.map((_, i) => (
        <span key={i} className="particle"></span>
      ))}
    </div>
  );
}
