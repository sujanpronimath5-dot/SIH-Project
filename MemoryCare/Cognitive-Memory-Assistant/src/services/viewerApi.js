import {
  ensureCurrentPatientRegistered,
  listRegisteredPatients,
  findRegisteredPatient,
} from './patientRegistry';

const VIEWER_TOKEN_KEY = 'viewerToken';
const VIEWER_ROLE_KEY = 'viewerRole';
const VIEWER_PATIENT_KEY = 'viewerPatientId';

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

function uuid() {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function resultResponseTime(record) {
  if (record.total_time_seconds != null) return Number(record.total_time_seconds);
  if (record.avg_response_ms != null) return Number(record.avg_response_ms) / 1000;
  return 0;
}

function resultAccuracy(record) {
  const v = Number(record.accuracy_percent);
  return Number.isFinite(v) ? v / 100 : 0;
}

function getRawResults() {
  return read('memoryCareResults', []);
}

function currentPatientRecord() {
  const patient = ensureCurrentPatientRegistered();
  if (!patient) return null;
  return patient;
}

function registeredPatients() {
  return listRegisteredPatients();
}

function findPatientRecord(patientId) {
  return findRegisteredPatient(patientId);
}

function buildOverview(results, patientId) {
  const gamesPlayed = results.length;
  const avgAccuracy = gamesPlayed
    ? results.reduce((sum, r) => sum + resultAccuracy(r), 0) / gamesPlayed
    : 0;
  const avgTimeSeconds = gamesPlayed
    ? results.reduce((sum, r) => sum + resultResponseTime(r), 0) / gamesPlayed
    : 0;

  const now = new Date();
  const dayKey = (date) => date.toISOString().slice(0, 10);
  const daysFrom = (d, offset) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset);

  const inCurrentWeek = (ts) => {
    const d = new Date(ts);
    const start = daysFrom(now, -6);
    return d >= start;
  };
  const inPreviousWeek = (ts) => {
    const d = new Date(ts);
    const start = daysFrom(now, -13);
    const end = daysFrom(now, -6);
    return d >= start && d < end;
  };

  const current = results.filter((r) => inCurrentWeek(new Date(r.timestamp)));
  const previous = results.filter((r) => inPreviousWeek(new Date(r.timestamp)));
  let improvementPercentage = null;
  if (current.length && previous.length) {
    const cur = current.reduce((s, r) => s + resultAccuracy(r), 0) / current.length * 100;
    const prev = previous.reduce((s, r) => s + resultAccuracy(r), 0) / previous.length * 100;
    improvementPercentage = Math.round((cur - prev) * 10) / 10;
  }

  const trend = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = daysFrom(now, -i);
    const key = dayKey(date);
    const sessions = results.filter((r) => dayKey(new Date(r.timestamp)) === key);
    trend.push({
      date: key,
      sessions: sessions.length,
      avg_accuracy: sessions.length
        ? sessions.reduce((s, r) => s + resultAccuracy(r), 0) / sessions.length
        : 0,
    });
  }

  const byGame = {};
  results.forEach((r) => {
    const game = r.gameType || r.game || 'unknown';
    if (!byGame[game]) byGame[game] = [];
    byGame[game].push(r);
  });

  const highestLevels = Object.keys(byGame).map((game) => {
    const list = byGame[game];
    return {
      category: game,
      highest_level: Math.max(...list.map((r) => Number(r.level) || 0)),
      avg_accuracy: list.reduce((s, r) => s + resultAccuracy(r), 0) / list.length,
    };
  });

  const recentGame = (r) => ({
    id: r.id,
    game_id: r.gameType || r.game,
    difficulty: Number(r.level) || 0,
    accuracy: resultAccuracy(r),
    response_time: resultResponseTime(r),
    played_at: r.timestamp,
  });

  const timeByGame = Object.keys(byGame).map((game) => {
    const list = byGame[game];
    return {
      game_id: game,
      sessions: list.length,
      avg_time_seconds: list.reduce((s, r) => s + resultResponseTime(r), 0) / list.length,
      total_time_seconds: list.reduce((s, r) => s + resultResponseTime(r), 0),
    };
  });

  return {
    patient_id: patientId || (currentPatientRecord() ? currentPatientRecord().patient_id : null),
    overall_progress: {
      percent: Math.round(avgAccuracy * 100),
      avg_accuracy: Math.round(avgAccuracy * 1000) / 1000,
      avg_time_seconds: Math.round(avgTimeSeconds * 10) / 10,
      games_played: gamesPlayed,
    },
    improvement_percentage: improvementPercentage,
    trend,
    highest_levels: highestLevels,
    recent_games: results.slice(-20).map(recentGame),
    time_by_game: timeByGame,
  };
}

function placeholderPhoto(name, hue) {
  const letter = (name || '?').slice(0, 1).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="${hue}" width="400" height="400"/><text x="200" y="245" text-anchor="middle" font-size="180" fill="#FDF6EC" font-family="system-ui,sans-serif">${letter}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function ensureFamilySeeded() {
  const family = read('memoryCareFamily', null);
  if (family && family.length > 0) return family;
  const seeded = [
    { name: 'Meena', relationshipKey: 'daughter', hue: '#D85A30' },
    { name: 'Rajesh', relationshipKey: 'son', hue: '#C0432E' },
    { name: 'Lata', relationshipKey: 'sister', hue: '#8A4A32' },
    { name: 'Suresh', relationshipKey: 'neighbor', hue: '#3B3B3F' },
    { name: 'Anita', relationshipKey: 'nurse', hue: '#E28364' },
    { name: 'Priya', relationshipKey: 'granddaughter', hue: '#B85C38' },
    { name: 'Ravi', relationshipKey: 'grandson', hue: '#9C5A2C' },
    { name: 'Kamal', relationshipKey: 'doctor', hue: '#59595D' },
  ].map((person, index) => ({
    id: `demo-${index}`,
    name: person.name,
    relationshipKey: person.relationshipKey,
    photoDataUrl: placeholderPhoto(person.name, person.hue),
  }));
  write('memoryCareFamily', seeded);
  return seeded;
}

function memberToView(member) {
  return {
    id: member.id,
    name: member.name,
    relationship: member.relationshipKey || member.relationship || '',
    photo_url: member.photoDataUrl || member.photo_url || '',
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error('Could not read photo.'));
    reader.readAsDataURL(file);
  });
}

export function getViewerToken() {
  return localStorage.getItem(VIEWER_TOKEN_KEY);
}

export function setViewerToken(token) {
  if (token) {
    localStorage.setItem(VIEWER_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(VIEWER_TOKEN_KEY);
  }
}

export function getViewerRole() {
  return localStorage.getItem(VIEWER_ROLE_KEY);
}

export function getSelectedPatientId() {
  return localStorage.getItem(VIEWER_PATIENT_KEY);
}

export function selectPatient(patientId) {
  if (patientId) {
    localStorage.setItem(VIEWER_PATIENT_KEY, patientId);
  } else {
    localStorage.removeItem(VIEWER_PATIENT_KEY);
  }
}

export function ensureSession(role, force = false) {
  const existing = getViewerToken();
  if (existing && !force) return Promise.resolve({ session_token: existing, role });
  return viewerApi.createSession(role);
}

const viewerApi = {
  getViewerToken,
  setViewerToken,

  async createSession(role) {
    const token = `local-${role}-${Date.now()}`;
    setViewerToken(token);
    return { session_token: token, role };
  },

  ensureSession,

  async listPatients() {
    return registeredPatients();
  },

  async getOverview(patientId) {
    const patient = findPatientRecord(patientId);
    if (!patient) throw new Error(`Patient not found with ID ${patientId}`);
    return buildOverview(getRawResults(), patientId);
  },

  async linkPatient(patientId) {
    const patient = findPatientRecord(patientId);
    if (!patient) throw new Error(`Patient not found with ID ${patientId}.`);
    const linked = read('memoryCareLinkedPatients', []);
    if (!linked.some((p) => p.patient_id === patientId)) {
      linked.push(patient);
      write('memoryCareLinkedPatients', linked);
    }
    return { patient };
  },

  async getLinkedPatients() {
    return registeredPatients();
  },

  async getPatientProfile(patientId) {
    const patient = findPatientRecord(patientId);
    if (!patient) throw new Error(`Patient not found with ID ${patientId}`);
    return patient;
  },

  async getPatientOverview(patientId) {
    return this.getOverview(patientId);
  },

  async getPatientPerformance(patientId) {
    return this.getOverview(patientId);
  },

  async getPatientReminders(patientId, activeOnly = false) {
    if (!findPatientRecord(patientId)) throw new Error(`Patient not found with ID ${patientId}`);
    const reminders = read('reminders', []);
    const mapped = reminders
      .filter((r) => (activeOnly ? !r.completed : true))
      .map((r) => ({
        reminder_id: r.id,
        title: r.name || 'Reminder',
        reminder_type: 'other',
        frequency: 'daily',
        time_of_day: r.time || '',
        created_at: r.createdAt || new Date().toISOString(),
      }));
    return mapped;
  },

  async getPatientGameResults(patientId, filters = {}) {
    if (!findPatientRecord(patientId)) throw new Error(`Patient not found with ID ${patientId}`);
    const all = getRawResults().map((r) => ({
      id: r.id,
      game_id: r.gameType || r.game,
      difficulty: Number(r.level) || 0,
      accuracy: resultAccuracy(r),
      response_time: resultResponseTime(r),
      played_at: r.timestamp,
    }));
    const perPage = Number(filters.per_page) || 20;
    return {
      game_results: all.slice(-perPage),
      total: all.length,
    };
  },

  async addFamilyMember(patientId, { name, relationship, photoFile }) {
    if (!findPatientRecord(patientId)) throw new Error(`Patient not found with ID ${patientId}`);
    const family = ensureFamilySeeded();
    let photoDataUrl = '';
    if (photoFile) {
      photoDataUrl = await fileToDataUrl(photoFile);
    } else {
      photoDataUrl = placeholderPhoto(name, '#D85A30');
    }
    const member = {
      id: uuid(),
      name,
      relationshipKey: relationship || 'other',
      photoDataUrl,
    };
    family.push(member);
    write('memoryCareFamily', family);
    return memberToView(member);
  },

  async listFamilyMembers(patientId) {
    if (!findPatientRecord(patientId)) throw new Error(`Patient not found with ID ${patientId}`);
    return ensureFamilySeeded().map(memberToView);
  },

  async deleteFamilyMember(patientId, memberId) {
    if (!findPatientRecord(patientId)) throw new Error(`Patient not found with ID ${patientId}`);
    const family = ensureFamilySeeded();
    const next = family.filter((m) => m.id !== memberId);
    write('memoryCareFamily', next);
    return { success: true };
  },
};

export default viewerApi;