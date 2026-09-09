import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t, tf, getAppLanguage } from '../i18n';
import { GAME_TYPES, getPlayLevel, listGameResults, listBreathingSessions } from '../services/gameStore';
import { levelSubtitle } from './games/GameParts';
import Navigation from '../components/Navigation';
import '../styles/MyProgress.css';

const GAME_KEYS = [
  [GAME_TYPES.pattern_matching, 'patternName'],
  [GAME_TYPES.shape_sort, 'shapeName'],
  [GAME_TYPES.face_name_recall, 'faceName'],
  [GAME_TYPES.remember_my_story, 'storyName'],
];
const RANGES = { day: 1, week: 7, month: 30 };

function MyProgress({ onBack }) {
  const navigate = useNavigate();
  const lang = getAppLanguage();
  const [results, setResults] = useState([]);
  const [breathing, setBreathing] = useState([]);
  const [levels, setLevels] = useState({});
  const [range, setRange] = useState('week');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [gameResults, breathingSessions] = await Promise.all([
        listGameResults(),
        listBreathingSessions(),
      ]);
      if (cancelled) return;
      setResults(gameResults);
      setBreathing(breathingSessions);
    })();
    const loadLevels = async () => {
      const map = {};
      for (const [gameType] of GAME_KEYS) {
        map[gameType] = await getPlayLevel(gameType);
      }
      if (!cancelled) setLevels(map);
    };
    loadLevels();
    return () => {
      cancelled = true;
    };
  }, []);

  const back = () => (onBack ? onBack() : navigate('/dashboard'));

  const data = aggregate(results, breathing, range);
  const recentResults = results.filter((result) => isInRange(result.timestamp, 'week'));
  const averageAccuracy = recentResults.length
    ? recentResults.reduce((sum, result) => sum + accuracy(result), 0) / recentResults.length
    : 0;
  const stars = recentResults.length ? Math.max(1, Math.min(5, Math.round(averageAccuracy / 20))) : 0;
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentBreathing = breathing.filter((session) => Date.parse(session.timestamp) >= cutoff);
  const latestBreathing = breathing.slice().sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];

  const maxCount = Math.max(1, ...data.counts);
  const maxAccuracy = 100;

  return (
    <div className="progress-page">
      <div className="progress-container">
        <div className="progress-header">
          <button className="header-btn" type="button" onClick={back}>
            {t(lang, 'back')}
          </button>
          <h1 className="progress-title">{t(lang, 'progressTitle')}</h1>
          <p className="progress-subtitle">{t(lang, 'progressHelp')}</p>
        </div>

        <div className="progress-intro">
          <div className="progress-stars" role="img" aria-label={tf(lang, 'progressStars', { n: stars })}>
            {'★'.repeat(stars) + '☆'.repeat(5 - stars)}
          </div>
          <h2>{t(lang, stars ? 'progressGreatWeek' : 'progressFreshStart')}</h2>
          <p>{t(lang, 'progressHelp')}</p>
        </div>

        <section className="progress-dashboard">
          <div className="progress-range-tabs" role="tablist" aria-label={t(lang, 'progressRange')}>
            {Object.keys(RANGES).map((r) => (
              <button
                key={r}
                className={`progress-range-tab ${range === r ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={range === r}
                onClick={() => setRange(r)}
              >
                {t(lang, `progress${r[0].toUpperCase()}${r.slice(1)}`)}
              </button>
            ))}
          </div>

          <div className="progress-summary">
            <div className="progress-summary-item">
              <strong>{data.totalActivities}</strong>
              <span>{t(lang, 'progressTotalActivities')}</span>
            </div>
            <div className="progress-summary-item">
              <strong>{formatDuration(data.totalSeconds)}</strong>
              <span>{tf(lang, 'progressTotalTime', { range: t(lang, `progress${range[0].toUpperCase()}${range.slice(1)}`).toLowerCase() })}</span>
            </div>
          </div>

          <div className="progress-chart-panel">
            <h3>{t(lang, 'progressSessionsByGame')}</h3>
            <div className="bar-chart">
              {GAME_KEYS.map(([gameType, nameKey], index) => (
                <div className="bar-row" key={gameType}>
                  <span className="bar-label">{t(lang, nameKey)}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(data.counts[index] / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="bar-value">{data.counts[index]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="progress-chart-panel">
            <h3>{t(lang, 'progressAccuracyTrend')}</h3>
            <div className="trend-chart">
              {data.labels.map((label, index) => (
                <div className="trend-block" key={label}>
                  <div className="trend-bar-wrap">
                    <div
                      className="trend-bar"
                      style={{
                        height: `${(data.accuracy[index] || 0) / maxAccuracy * 100}%`,
                      }}
                    />
                  </div>
                  <span className="trend-label">{label.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <h3 className="progress-section-title">{t(lang, 'progressRecentActivity')}</h3>

        {GAME_KEYS.map(([gameType, nameKey]) => {
          const level = levels[gameType] || 1;
          const allGameResults = results
            .filter((result) => result.gameType === gameType)
            .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
          const recentGameResults = recentResults
            .filter((result) => result.gameType === gameType)
            .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
          const latest = allGameResults[0];
          return (
            <section className="progress-game-card" key={gameType}>
              <h3>{t(lang, nameKey)}</h3>
              <div className="progress-game-row">
                <span>{t(lang, 'progressLastPlayed')}</span>
                <strong>{latest ? relativeDay(lang, latest.timestamp) : t(lang, 'progressNotPlayed')}</strong>
              </div>
              <div className="progress-game-row">
                <span>{recentGameResults.length ? tf(lang, 'progressPlayed', { n: recentGameResults.length }) : t(lang, 'progressNoRecentPlays')}</span>
                <strong>{levelSubtitle(lang, level)}</strong>
              </div>
            </section>
          );
        })}

        <section className="progress-activity-card">
          <h3>{t(lang, 'breathingName')}</h3>
          <div className="progress-game-row">
            <span>{t(lang, 'progressLastPlayed')}</span>
            <strong>{latestBreathing ? relativeDay(lang, latestBreathing.timestamp) : t(lang, 'progressNotPlayed')}</strong>
          </div>
          <div className="progress-game-row">
            <span>{recentBreathing.length ? tf(lang, 'breathingSessionsThisWeek', { n: recentBreathing.length }) : t(lang, 'breathingNoSessions')}</span>
            <strong>{t(lang, 'calmingActivity')}</strong>
          </div>
        </section>
      </div>
      <Navigation />
    </div>
  );
}

function aggregate(results, breathingSessions, range) {
  const days = RANGES[range];
  const labels = Array.from({ length: days }, (_, index) => dateKey(Date.now() - (days - 1 - index) * 86400000));
  const gameResults = results.filter((result) => isInRange(result.timestamp, range));
  const breathing = breathingSessions.filter((session) => isInRange(session.timestamp, range));
  return {
    totalActivities: gameResults.length + breathing.length,
    totalSeconds: gameResults.reduce((sum, result) => sum + duration(result), 0) + breathing.reduce((sum, session) => sum + duration(session), 0),
    counts: GAME_KEYS.map(([gameType]) => gameResults.filter((result) => result.gameType === gameType).length),
    labels,
    accuracy: labels.map((day) => {
      const daily = gameResults.filter((result) => dateKey(result.timestamp) === day);
      return daily.length ? daily.reduce((sum, result) => sum + accuracy(result), 0) / daily.length : null;
    }),
  };
}

function isInRange(timestamp, range) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (RANGES[range] - 1));
  return Date.parse(timestamp) >= start.getTime();
}

function dateKey(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function duration(record) {
  const value = Number(record.totalTimeSeconds ?? record.total_time_seconds);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  return minutes ? `${minutes}m ${Math.round(seconds % 60)}s` : `${Math.round(seconds)}s`;
}

function accuracy(result) {
  const value = Number(result.accuracy ?? result.accuracy_percent);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

function relativeDay(lang, timestamp) {
  const today = new Date();
  const played = new Date(timestamp);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const playedStart = new Date(played.getFullYear(), played.getMonth(), played.getDate());
  const days = Math.round((todayStart - playedStart) / (24 * 60 * 60 * 1000));
  if (days <= 0) return t(lang, 'progressToday');
  if (days === 1) return t(lang, 'progressYesterday');
  return tf(lang, 'progressDaysAgo', { n: days });
}

export default MyProgress;