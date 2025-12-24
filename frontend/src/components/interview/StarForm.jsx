import React, { useState } from "react";

export default function StarForm({ onSubmit, disabled }) {
  const [formData, setFormData] = useState({
    situation: "",
    task: "",
    action: "",
    result: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.situation || !formData.action) return;
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="star-grid">
        
        {/* 1. SITUATION */}
        <div className="star-field star-s">
          <label className="star-label">
            <span>01 // Situation</span>
            <span>📍</span>
          </label>
          <textarea 
            className="star-textarea"
            rows="3"
            placeholder="Describe the context or challenge..."
            value={formData.situation}
            onChange={(e) => handleChange("situation", e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* 2. TASK */}
        <div className="star-field star-t">
          <label className="star-label">
            <span>02 // Task</span>
            <span>🎯</span>
          </label>
          <textarea 
            className="star-textarea"
            rows="3"
            placeholder="What was your specific goal?"
            value={formData.task}
            onChange={(e) => handleChange("task", e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* 3. ACTION */}
        <div className="star-field star-a">
          <label className="star-label">
            <span>03 // Action (Crucial)</span>
            <span>⚡</span>
          </label>
          <textarea 
            className="star-textarea"
            rows="3"
            placeholder="What steps did YOU take? (Use 'I', not 'We')"
            value={formData.action}
            onChange={(e) => handleChange("action", e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* 4. RESULT */}
        <div className="star-field star-r">
          <label className="star-label">
            <span>04 // Result</span>
            <span>📈</span>
          </label>
          <textarea 
            className="star-textarea"
            rows="2"
            placeholder="What was the outcome? Mention metrics/numbers."
            value={formData.result}
            onChange={(e) => handleChange("result", e.target.value)}
            disabled={disabled}
          />
        </div>

      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end mt-2">
        <button 
          onClick={handleSubmit} 
          disabled={disabled || !formData.action}
          className="btn-primary"
          style={{ width: '100%', padding: '1rem', background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
        >
          {disabled ? "TRANSMITTING DATA..." : "UPLOAD STAR RECORD"}
        </button>
      </div>
    </div>
  );
}