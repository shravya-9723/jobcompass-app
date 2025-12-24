import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/contact.css"; 
import api from "../utils/api"; 

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    
    try {
      // ✅ REAL BACKEND CALL
      await api.post("/contact", formData);
      setStatus("sent");
    } catch (error) {
      console.error("Transmission Error", error);
      alert("Uplink Failed. Check Console.");
      setStatus("idle");
    }
  };

  return (
    <div className="contact-container">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="contact-grid">
        
        {/* LEFT SIDE: Visuals */}
        <div className="holo-side animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="holo-emitter">
            <div className="holo-icon">📡</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide font-[Cinzel]">
            UPLINK
          </h1>
          <p className="text-gray-400 tracking-widest text-sm">SECURE TRANSMISSION PROTOCOL</p>
          
          <div className="mt-8">
            <div className="status-badge">
              STATUS: {status === "sent" ? "PACKET DELIVERED" : "AWAITING INPUT"}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Terminal Form */}
        <div className="terminal-card animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
          
          {status === "sent" ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6 animate-bounce">✅</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">TRANSMISSION SUCCESSFUL</h2>
              <p className="text-gray-400 text-sm mb-8">
                Your data packet has been encrypted and logged at HQ.
              </p>
              <button style={{color:"cyan"}}
                onClick={() => { setStatus("idle"); setFormData({ name: "", email: "", message: "" }); }}
                className="text-cyan-400 hover:text-white underline underline-offset-4 text-xs tracking-widest uppercase"
              >
                Establish New Connection
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="form-title">ENCRYPTED MESSAGE</h2>

              <div className="input-group">
                <label className="terminal-label">Operative ID // Name</label>
                <input 
                  type="text" 
                  className="terminal-input"
                  placeholder="Enter Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={status === "sending"}
                />
              </div>

              <div className="input-group">
                <label className="terminal-label">Frequency // Email</label>
                <input 
                  type="email" 
                  className="terminal-input"
                  placeholder="name@sector7.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={status === "sending"}
                />
              </div>

              <div className="input-group">
                <label className="terminal-label">Payload // Message</label>
                <textarea 
                  rows="4"
                  className="terminal-input resize-none"
                  placeholder="Type your message..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  disabled={status === "sending"}
                />
              </div>

              <button type="submit" className="transmit-btn" disabled={status === "sending"}>
                {status === "sending" ? "ENCRYPTING DATA..." : "TRANSMIT PACKET"}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}