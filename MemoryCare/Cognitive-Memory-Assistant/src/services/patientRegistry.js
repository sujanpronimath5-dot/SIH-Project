const KEY_REGISTRY = 'memoryCarePatientsInfo';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function nextPatientId(registry) {
  const year = String(new Date().getFullYear()).slice(-2);
  const prefix = `MM${year}A`;
  let max = 0;
  registry.forEach((record) => {
    const match = String(record.patient_id || '').match(new RegExp(`^${prefix}(\\d+)$`));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

export function registerPatient(data) {
  const registry = read(KEY_REGISTRY, []);
  const existing = data.patient_id && registry.find((p) => p.patient_id === data.patient_id);
  const lang = data.language || data.preferred_language || localStorage.getItem('preferredLang') || 'en';
  const emergencyContact = data.emergencyContact || data.emergency_contact || '';
  const emergencyPhone = data.emergencyPhone || data.emergency_phone || '';
  const record = {
    patient_id: existing ? data.patient_id : nextPatientId(registry),
    name: data.name || 'Patient',
    age: Number(data.age) || 0,
    gender: data.gender || '—',
    preferred_language: lang,
    language: lang,
    state: data.state || '',
    phone: data.phone || '',
    emergency_contact: emergencyContact,
    emergencyContact: emergencyContact,
    emergency_phone: emergencyPhone,
    emergencyPhone: emergencyPhone,
  };
  if (existing) {
    const idx = registry.indexOf(existing);
    registry[idx] = { ...existing, ...record };
  } else {
    registry.push(record);
  }
  write(KEY_REGISTRY, registry);
  return { ...data, ...record };
}

export function ensureCurrentPatientRegistered() {
  const patient = read('patientData', null);
  if (!patient) return null;
  const registry = read(KEY_REGISTRY, []);
  const registered = patient.patient_id && registry.find((p) => p.patient_id === patient.patient_id);
  if (registered) {
    const lang = patient.language || registered.language || registered.preferred_language || localStorage.getItem('preferredLang') || 'en';
    const emergencyContact = patient.emergencyContact || registered.emergencyContact || registered.emergency_contact || '';
    const emergencyPhone = patient.emergencyPhone || registered.emergencyPhone || registered.emergency_phone || '';
    const merged = {
      ...registered,
      ...patient,
      patient_id: registered.patient_id,
      language: lang,
      preferred_language: lang,
      emergencyContact,
      emergency_contact: emergencyContact,
      emergencyPhone,
      emergency_phone: emergencyPhone,
    };
    write('patientData', merged);
    return merged;
  }
  const updated = registerPatient(patient);
  write('patientData', updated);
  return updated;
}

export function listRegisteredPatients() {
  ensureCurrentPatientRegistered();
  return read(KEY_REGISTRY, []);
}

export function findRegisteredPatient(patientId) {
  const id = String(patientId || '').trim().toUpperCase();
  if (!id) return null;
  return listRegisteredPatients().find((p) => String(p.patient_id).toUpperCase() === id) || null;
}