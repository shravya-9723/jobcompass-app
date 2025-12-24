import React, { useEffect, useState } from "react";
import "../styles/butterflies.css";

export default function Butterflies({ count = 15 }) { // Default 15, but customizable
  const [butterflies, setButterflies] = useState([]);

  useEffect(() => {
    const newButterflies = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "vw",
      top: Math.random() * 100 + "vh",
      animationDuration: Math.random() * 10 + 10 + "s",
      delay: Math.random() * 5 + "s",
      scale: Math.random() * 0.5 + 0.5,
      hue: Math.random() * 50 // Slight color variation
    }));
    setButterflies(newButterflies);
  }, [count]);

  return (
    <div className="butterflies-container">
      {butterflies.map((b) => (
        <div
          key={b.id}
          className="butterfly"
          style={{
            left: b.left,
            top: b.top,
            animationDuration: b.animationDuration,
            animationDelay: b.delay,
            transform: `scale(${b.scale})`,
            filter: `hue-rotate(${b.hue}deg) drop-shadow(0 0 10px cyan)`
          }}
        >
          <div className="wing left-wing"></div>
          <div className="wing right-wing"></div>
        </div>
      ))}
    </div>
  );
}