import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t, getAppLanguage } from '../i18n';
import '../styles/PatientDashboard.css';
import Navigation from '../components/Navigation';

function PatientDashboard({ patient }) {
  const navigate = useNavigate();
  const lang = getAppLanguage();

  if (!patient) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <p className="error-message">{t(lang, 'pleaseCompleteProfile')}</p>
          <button onClick={() => navigate('/patient-setup')}>{t(lang, 'goToSetup')}</button>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t(lang, 'goodMorning');
    if (hour < 18) return t(lang, 'goodAfternoon');
    return t(lang, 'goodEvening');
  };

  const features = [
    { id: 'game', icon: '🎮', label: t(lang, 'navGames'), path: '/games', description: t(lang, 'featureGamesDesc') },
    { id: 'reminders', icon: '⏰', label: t(lang, 'navReminders'), path: '/reminders', description: t(lang, 'featureRemindersDesc') },
    { id: 'breathing', icon: '🌬️', label: t(lang, 'breathingName'), path: '/breathing', description: t(lang, 'featureBreathingDesc') },
    { id: 'face', icon: '🔐', label: t(lang, 'faceLogin'), path: '/face-login', description: t(lang, 'featureFaceDesc') },
    { id: 'emergency', icon: '🚨', label: t(lang, 'navSos'), path: '/emergency', description: t(lang, 'featureEmergencyDesc') },
    { id: 'profile', icon: '👤', label: t(lang, 'navProfile'), path: '/profile', description: t(lang, 'featureProfileDesc') },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="greeting-section">
              <h1 className="greeting">
                {getGreeting()}, <span className="patient-name">{patient.name}</span>
              </h1>
              <p className="time">
                {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'today', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              {patient.patient_id && <p className="patient-id">Patient ID: {patient.patient_id}</p>}
            </div>
          </div>

          <div className="features-grid">
            {features.map(feature => (
              <button
                key={feature.id}
                className="feature-card"
                onClick={() => navigate(feature.path)}
              >
                <div className="feature-icon-large">{feature.icon}</div>
                <h2 className="feature-title">{feature.label}</h2>
                <p className="feature-desc">{feature.description}</p>
              </button>
            ))}
          </div>

          <div className="health-tips">
            <h3>{t(lang, 'dailyTipTitle')}</h3>
            <p>{t(lang, 'dailyTipText')}</p>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default PatientDashboard;