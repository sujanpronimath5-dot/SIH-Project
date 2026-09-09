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
  const record = {
    patient_id: existing ? data.patient_id : nextPatientId(registry),
    name: data.name || 'Patient',
    age: Number(data.age) || 0,
    gender: data.gender || '—',
    preferred_language: data.language || 'en',
    state: data.state || '',
    phone: data.phone || '',
    emergency_contact: data.emergencyContact || '',
    emergency_phone: data.emergencyPhone || '',
  };
  if (existing) {
    const idx = registry.indexOf(existing);
    registry[idx] = { ...existing, ...record };
  } else {
    registry.push(record);
  }
  write(KEY_REGISTRY, registry);
  return { ...data, patient_id: record.patient_id };
}

export function ensureCurrentPatientRegistered() {
  const patient = read('patientData', null);
  if (!patient) return null;
  const registry = read(KEY_REGISTRY, []);
  const registered = patient.patient_id && registry.find((p) => p.patient_id === patient.patient_id);
  if (registered) return registered;
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