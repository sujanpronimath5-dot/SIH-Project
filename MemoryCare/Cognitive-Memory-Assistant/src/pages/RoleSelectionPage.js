import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, Stethoscope } from 'lucide-react';
import '../styles/RoleSelectionPage.css';

function RoleSelectionPage({ setRole }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    localStorage.setItem('userRole', role);
    setRole(role);
    
    setTimeout(() => {
      if (role === 'patient') {
        const savedPatient = localStorage.getItem('patientData');
        if (savedPatient) {
          navigate('/dashboard');
        } else {
          navigate('/patient-setup');
        }
      } else if (role === 'family') {
        localStorage.setItem('viewerRole', 'family');
        const savedFamily = localStorage.getItem('currentFamilyUser');
        if (savedFamily) {
          navigate('/family-dashboard');
        } else {
          navigate('/family-login');
        }
      } else if (role === 'nurse') {
        localStorage.setItem('viewerRole', 'nurse');
        const savedNurse = localStorage.getItem('currentNurseUser');
        if (savedNurse) {
          navigate('/nurse-dashboard');
        } else {
          navigate('/nurse-login');
        }
      }
    }, 300);
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-content">
        <h1 className="role-title">Who are you?</h1>
        <p className="role-subtitle">Please select your role to continue</p>

        <div className="role-cards">
          <div 
            className={`role-card ${selectedRole === 'patient' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('patient')}
          >
            <div className="role-icon">
              <User size={60} />
            </div>
            <h2 className="role-label">Patient</h2>
            <p className="role-description">I am looking for healthcare assistance</p>
          </div>

          <div 
            className={`role-card ${selectedRole === 'family' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('family')}
          >
            <div className="role-icon">
              <Users size={60} />
            </div>
            <h2 className="role-label">Family</h2>
            <p className="role-description">I am assisting a loved one</p>
          </div>

          <div 
            className={`role-card ${selectedRole === 'nurse' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('nurse')}
          >
            <div className="role-icon">
              <Stethoscope size={60} />
            </div>
            <h2 className="role-label">Nurse</h2>
            <p className="role-description">I am a healthcare professional</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
