import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, User } from 'lucide-react';
import '../styles/ProfileScreen.css';
import Navigation from '../components/Navigation';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function profileStats() {
  const results = readJson('memoryCareResults', []);
  const plays = results.length;
  const accuracies = results
    .map((record) => Number(record.accuracy_percent))
    .filter((value) => !Number.isNaN(value) && value >= 0 && value <= 100);
  const averageAccuracy = accuracies.length
    ? Math.round(accuracies.reduce((sum, value) => sum + value, 0) / accuracies.length)
    : 0;
  const reminders = readJson('reminders', []);
  return { plays, averageAccuracy, reminderCount: Array.isArray(reminders) ? reminders.length : 0 };
}

function ProfileScreen({ patient, setPatient }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(patient || {});

  if (!patient) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p className="error">Please complete your profile first.</p>
          <button onClick={() => navigate('/patient-setup')}>Setup Profile</button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(patient);
  };

  const handleSave = () => {
    const updatedPatient = { ...patient, ...editData };
    localStorage.setItem('patientData', JSON.stringify(updatedPatient));
    setPatient(updatedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(patient);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('patientData');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-header">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Your health information</p>
          </div>

          <div className="profile-avatar">
            <User size={80} />
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-section">
                <div className="info-item">
                  <span className="info-label">Patient ID</span>
                  <span className="info-value">{patient.patient_id || '—'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{patient.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{patient.age} years old</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{patient.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">State</span>
                  <span className="info-value">{patient.state || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Emergency Contact</span>
                  <span className="info-value">{patient.emergencyContact}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Emergency Contact Phone</span>
                  <span className="info-value">{patient.emergencyPhone || 'Not set'}</span>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-card">
                  <span className="stat-icon">🎮</span>
                  <span className="stat-title">Games Played</span>
                  <span className="stat-value">{profileStats().plays}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🎯</span>
                  <span className="stat-title">Average Accuracy</span>
                  <span className="stat-value">{profileStats().averageAccuracy}%</span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">⏰</span>
                  <span className="stat-title">Reminders</span>
                  <span className="stat-value">{profileStats().reminderCount}</span>
                </div>
              </div>

              <button className="edit-btn" onClick={handleEdit}>
                <Edit2 size={24} />
                Edit Profile
              </button>
            </div>
          ) : (
            <form className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={editData.age}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <select
                  name="state"
                  value={editData.state || ''}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="" disabled>Select your state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={editData.emergencyContact}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={editData.emergencyPhone || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="edit-buttons">
                <button type="button" className="save-btn" onClick={handleSave}>
                  <Save size={24} />
                  Save Changes
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  <X size={24} />
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="profile-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>

          <div className="profile-footer">
            <p>Last updated: {new Date(patient.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default ProfileScreen;
