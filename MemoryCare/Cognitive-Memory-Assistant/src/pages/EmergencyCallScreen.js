import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Phone, X } from 'lucide-react';
import '../styles/EmergencyCallScreen.css';
import Navigation from '../components/Navigation';

function EmergencyCallScreen({ patient }) {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [callType, setCallType] = useState(null);

  const handleEmergencyServicesPress = () => {
    setCallType('services');
    setShowConfirmation(true);
  };

  const handleContactCallPress = () => {
    setCallType('contact');
    setShowConfirmation(true);
  };

  const handleConfirmCall = () => {
    setCallInitiated(true);
    setShowConfirmation(false);
    
    if (callType === 'services') {
      setTimeout(() => {
        alert('Emergency services call initiated! (This is a simulation)\n\nIn a real application, this would connect to emergency services.');
        setCallInitiated(false);
      }, 3000);
    } else {
      setTimeout(() => {
        alert(`Calling ${patient?.emergencyContact || 'your emergency contact'}! (This is a simulation)\n\nIn a real application, this would call: ${patient?.emergencyPhone || 'saved number'}`);
        setCallInitiated(false);
      }, 3000);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setCallType(null);
  };

  return (
    <div className="emergency-page">
      <div className="emergency-container">
        <div className="emergency-content">
          <div className="emergency-header">
            <h1 className="emergency-title">Emergency Assistance</h1>
            <p className="emergency-subtitle">Quick access to help when you need it</p>
          </div>

          <div className="emergency-section">
            <div className="emergency-services-section">
              <div className="section-header">
                <span className="section-icon">🚨</span>
                <h2 className="section-title">Emergency Services</h2>
              </div>
              <a 
                href="tel:911" 
                className="emergency-action-btn services-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleEmergencyServicesPress();
                }}
              >
                <Phone size={32} />
                <span>Call 911</span>
              </a>
              <p className="section-note">Emergency Services</p>
            </div>

            <div className="emergency-contact-section">
              <div className="section-header">
                <span className="section-icon">👤</span>
                <h2 className="section-title">Your Emergency Contact</h2>
              </div>
              
              {patient ? (
                <div className="contact-details">
                  <div className="contact-info-row">
                    <span className="contact-label">Name:</span>
                    <span className="contact-value">{patient.emergencyContact || 'Not set'}</span>
                  </div>
                  <div className="contact-info-row">
                    <span className="contact-label">Phone:</span>
                    <span className="contact-value">{patient.emergencyPhone || 'Not set'}</span>
                  </div>
                  <a 
                    href={`tel:${patient.emergencyPhone}`}
                    className="emergency-action-btn contact-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleContactCallPress();
                    }}
                  >
                    <Phone size={32} />
                    <span>Call Emergency Contact</span>
                  </a>
                </div>
              ) : (
                <div className="no-contact">
                  <p>No emergency contact found. Please set up your profile first.</p>
                  <button className="setup-link" onClick={() => navigate('/patient-setup')}>
                    Go to Setup
                  </button>
                </div>
              )}
            </div>
          </div>

          {showConfirmation && (
            <div className="confirmation-modal">
              <div className="modal-box">
                <AlertCircle size={48} className="warning-icon" />
                <h2>Confirm Call</h2>
                <p>
                  {callType === 'services' 
                    ? 'Are you sure you want to call emergency services?' 
                    : `Call ${patient?.emergencyContact || 'your emergency contact'}?`
                  }
                </p>
                <div className="confirmation-buttons">
                  <button className="btn-yes" onClick={handleConfirmCall}>
                    <Phone size={24} />
                    Yes, Call
                  </button>
                  <button className="btn-no" onClick={handleCancel}>
                    <X size={24} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {callInitiated && (
            <div className="calling-modal">
              <div className="modal-box">
                <div className="calling-spinner"></div>
                <h2>Calling...</h2>
                <p>Please wait while the call connects</p>
              </div>
            </div>
          )}

          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Home
          </button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default EmergencyCallScreen;
