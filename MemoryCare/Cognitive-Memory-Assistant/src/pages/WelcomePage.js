import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import '../styles/WelcomePage.css';

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <div className="welcome-icon">
            <Heart size={80} fill="#2E7D32" color="#2E7D32" />
          </div>
          <h1 className="welcome-title">Patient Care & Assistance System</h1>
          <p className="welcome-subtitle">Your Health, Our Priority</p>
        </div>

        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">🎮</span>
            <p>Cognitive Games</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏰</span>
            <p>Medication Reminders</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚨</span>
            <p>Emergency Support</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌬️</span>
            <p>Breathing Exercise</p>
          </div>
        </div>

        <button 
          className="get-started-btn"
          onClick={() => navigate('/role-selection')}
        >
          Get Started
        </button>

        <p className="welcome-footer">
          A simple and friendly healthcare companion for you and your family.
        </p>
      </div>
    </div>
  );
}

export default WelcomePage;
