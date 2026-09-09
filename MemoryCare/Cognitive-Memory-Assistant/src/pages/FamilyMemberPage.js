import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Loader, User } from 'lucide-react';
import '../styles/FamilyMemberPage.css';
import viewerApi, {
  ensureSession,
  getSelectedPatientId,
} from '../services/viewerApi';

const RELATIONSHIPS = [
  'mother', 'father', 'daughter', 'son', 'sister', 'brother',
  'spouse', 'neighbor', 'nurse', 'doctor', 'granddaughter', 'grandson', 'friend',
];

function relLabel(r) {
  return r ? r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';
}

function FamilyMemberPage() {
  const navigate = useNavigate();
  const patientId = getSelectedPatientId();
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('daughter');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const loadMembers = useCallback(async () => {
    if (!patientId) return;
    setLoadingList(true);
    setError('');
    try {
      await ensureSession('family');
      const list = await viewerApi.listFamilyMembers(patientId);
      setMembers(list);
    } catch (e) {
      setError(e.message || 'Could not load family members.');
    } finally {
      setLoadingList(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setPhotoFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(String(reader.result));
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview('');
    }
  };

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter the person's name.");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await ensureSession('family', true);
      await viewerApi.addFamilyMember(patientId, {
        name: trimmed,
        relationship,
        photoFile,
      });
      setSuccess('Family member added. This photo is now available to the patient\'s memory games.');
      setName('');
      setPhotoFile(null);
      setPhotoPreview('');
      await loadMembers();
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      setError(e.message || 'Could not add family member.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    setError('');
    try {
      await ensureSession('family', true);
      await viewerApi.deleteFamilyMember(patientId, memberId);
      await loadMembers();
    } catch (e) {
      setError(e.message || 'Could not remove family member.');
    }
  };

  const handleBack = () => navigate('/family-dashboard');

  return (
    <div className="family-member-page">
      <div className="family-member-header">
        <button className="family-back" onClick={handleBack}>
          <ArrowLeft size={18} /> Dashboard
        </button>
        <h1 className="family-member-title">Family Photos</h1>
        <p className="family-member-subtitle">
          Add names, relationships, and photos so your loved one can recognise you in their memory games.
        </p>
      </div>

      {error && <div className="family-error">{error}</div>}
      {success && <div className="family-success">{success}</div>}

      <div className="family-member-form">
        <div className="family-photo-preview">
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" />
          ) : (
            <User size={40} />
          )}
        </div>
        <input
          className="family-photo-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label className="family-input-label" htmlFor="family-name">Name</label>
        <input
          id="family-name"
          className="family-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grandma Meera"
        />
        <label className="family-input-label" htmlFor="family-rel">Relationship</label>
        <select
          id="family-rel"
          className="family-input"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
        >
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>{relLabel(r)}</option>
          ))}
        </select>
        <button className="family-add-button" onClick={handleAdd} disabled={loading}>
          {loading ? <Loader size={18} className="spin" /> : <Plus size={18} />}
          {loading ? 'Adding…' : 'Add Family Member'}
        </button>
      </div>

      <div className="family-member-list-section">
        <h2>Added family ({members.length})</h2>
        {loadingList ? (
          <p className="family-muted">Loading…</p>
        ) : members.length === 0 ? (
          <p className="family-muted">
            No family members added yet. Add your first person above.
          </p>
        ) : (
          <div className="family-member-list">
            {members.map((m) => (
              <div className="family-member-item" key={m.id}>
                {m.photo_url ? (
                  <img className="family-member-thumb" src={m.photo_url} alt={m.name} />
                ) : (
                  <div className="family-member-thumb family-member-thumb-placeholder">
                    <User size={24} />
                  </div>
                )}
                <div className="family-member-main">
                  <strong>{m.name}</strong>
                  <span>{relLabel(m.relationship)}</span>
                </div>
                <button
                  className="family-member-delete"
                  onClick={() => handleDelete(m.id)}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FamilyMemberPage;
