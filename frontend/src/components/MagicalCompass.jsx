import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./compass.css";

export default function MagicalCompass({ recommendedRole }) {
  const [showCards, setShowCards] = useState(false);
  const canvasRef = useRef(null);
  
  // ✅ UPDATED PATHS: Matches your screenshot (public/assets/card-name.jpg)
  const roles = [
    { title: "Full Stack", img: "/assets/card-fullstack.jpg", desc: "Master of Web" },
    { title: "GenAI Engineer", img: "/assets/card-genai.jpg", desc: "LLMs & RAG" },
    { title: "Cloud Native", img: "/assets/card-cloud.jpg", desc: "AWS & K8s" },
    { title: "DevOps / SRE", img: "/assets/card-devops.jpg", desc: "Scale Systems" },
    { title: "Data Engineer", img: "/assets/card-data.jpg", desc: "Big Data" },
    { title: "Cybersecurity", img: "/assets/card-cyber.jpg", desc: "Defense Ops" },
    { title: "Web3 Dev", img: "/assets/card-web3.jpg", desc: "Smart Contracts" },
    { title: "AR/VR Dev", img: "/assets/card-arvr.jpg", desc: "Spatial Tech" },
    { title: "Game Dev", img: "/assets/card-game.jpg", desc: "Unity / Unreal" },
    { title: "Mobile Dev", img: "/assets/card-mobile.jpg", desc: "Flutter" },
    { title: "QA Automation", img: "/assets/card-qa.jpg", desc: "Testing" },
    { title: "UI/UX Engineer", img: "/assets/card-uiux.jpg", desc: "Design Systems" },
  ];

  const roleMap = {
    "Full Stack Developer": 0, "GenAI Engineer": 30, "Cloud Native Dev": 60,
    "DevOps & SRE": 90, "Data Engineer": 120, "Cybersecurity": 150,
    "Blockchain Dev": 180, "AR/VR Developer": 210, "Game Developer": 240,
    "Mobile Developer": 270, "QA Automation": 300, "UI/UX Engineer": 330,
  };
  const angle = roleMap[recommendedRole] ?? 0;

  useEffect(() => {
    // Particle system (Kept simple for brevity)
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.clientWidth * devicePixelRatio;
    let height = canvas.height = canvas.clientHeight * devicePixelRatio;
    const particles = [];
    let rafId;

    function makeParticle() {
      return { x: width/2, y: height/2, vx: (Math.random()-0.5), vy: (Math.random()-0.5), life: 100, hue: Math.random()*360 };
    }
    for(let i=0; i<20; i++) particles.push(makeParticle());

    function step() {
      ctx.clearRect(0,0,width,height);
      if(Math.random()<0.1) particles.push(makeParticle());
      particles.forEach((p, i) => {
        p.x+=p.vx; p.y+=p.vy; p.life--;
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.life/100})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
        if(p.life<=0) particles.splice(i,1);
      });
      rafId = requestAnimationFrame(step);
    }
    step();
    return () => cancelAnimationFrame(rafId);
  }, []);

  // THE FIXED OVERLAY STRUCTURE
  const overlayContent = (
    <div className="portal-overlay-container">
      {/* 1. BACKGROUND LAYER (Blurry) */}
      <div className="portal-backdrop" />

      {/* 2. SCROLLABLE CONTENT LAYER */}
      <div className="portal-scroll-view">
        <h2 className="overlay-title">CHOOSE YOUR DESTINY</h2>
        <div className="cards-grid-12">
          {roles.map((r) => (
            <div key={r.title} className="fantasy-card">
              <div className="card-image-wrapper">
                <img src={r.img} alt={r.title} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                <div className="card-fallback-icon" style={{display:'none'}}>✦</div>
              </div>
              <div className="card-content">
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Spacer to ensure last cards aren't hidden behind button */}
        <div style={{ height: "120px" }}></div>
      </div>

      {/* 3. BUTTON LAYER (Truly Fixed on top) */}
      <div className="portal-fixed-ui">
        <button className="bottom-close-btn" onClick={() => setShowCards(false)}>
          ▼ RETURN TO DASHBOARD ▼
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="compass-container polished">
        <canvas ref={canvasRef} className="compass-canvas" />
        <div className="arcane-compass polished-arcane">
          <div className="gold-ring" />
          <div className="compass-star" />
          <div className="compass-pointer2" style={{ transform: `rotate(${angle}deg)` }} />
          <div className="core-crystal" onClick={() => setShowCards(true)}>
            <span>EXPLORE</span>
          </div>
          <div className="role-label">
            {recommendedRole ? (
              <> <p>RECOMMENDED ROLE</p> <h2>{recommendedRole}</h2> </>
            ) : (
              <> <p>DESTINY STATUS</p> <h2>UNALIGNED</h2> </>
            )}
          </div>
        </div>
      </div>
      {showCards && ReactDOM.createPortal(overlayContent, document.body)}
    </>
  );
}