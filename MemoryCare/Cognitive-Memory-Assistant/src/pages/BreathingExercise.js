import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t, getAppLanguage } from '../i18n';
import { speak, setVoiceLang, stopSpeaking } from '../services/voice';
import { saveBreathingSession } from '../services/gameStore';
import Navigation from '../components/Navigation';
import TopBackButton from '../components/TopBackButton';
import '../styles/BreathingExercise.css';

const INHALE_SECONDS = 4;
const HOLD_SECONDS = 4;
const EXHALE_SECONDS = 8;
const QUICK_DURATION_SECONDS = 60;
const GENTLE_DURATION_SECONDS = 300;

const PHASE_KEY = { in: 'breatheIn', hold: 'breatheHold', out: 'breatheOut' };

function BreathingExercise({ onBack }) {
  const navigate = useNavigate();
  const lang = getAppLanguage();
  const [screen, setScreen] = useState('start'); // 'start' | 'run' | 'done'
  const [phase, setPhase] = useState('in');
  const [, setPhaseRemaining] = useState(INHALE_SECONDS * 1000);
  const [, setSessionRemaining] = useState(0);
  const [paused, setPaused] = useState(false);
  const [, setCycles] = useState(0);
  

  const phaseRef = useRef('in');
  const cyclesRef = useRef(0);
  const phaseRemainingRef = useRef(INHALE_SECONDS * 1000);
  const sessionRemainingRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastTickRef = useRef(0);

  const back = () => (onBack ? onBack() : navigate('/dashboard'));

  useEffect(() => {
    setVoiceLang(lang);
    speak(t(lang, 'breathingInstruction'));
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phaseDurationMs = (currentPhase) => {
    if (currentPhase === 'in') return INHALE_SECONDS * 1000;
    if (currentPhase === 'hold') return HOLD_SECONDS * 1000;
    return EXHALE_SECONDS * 1000;
  };

  const phaseKey = (currentPhase) => PHASE_KEY[currentPhase];

  const announcePhase = (currentPhase) => {
    speak(t(lang, phaseKey(currentPhase)));
  };

  const chooseSession = (durationSeconds) => {
    startedAtRef.current = Date.now();
    phaseRef.current = 'in';
    cyclesRef.current = 0;
    phaseRemainingRef.current = INHALE_SECONDS * 1000;
    sessionRemainingRef.current = durationSeconds * 1000;
    lastTickRef.current = Date.now();
    setPhase('in');
    setPhaseRemaining(phaseRemainingRef.current);
    setSessionRemaining(sessionRemainingRef.current);
    setCycles(0);
    setPaused(false);
    setScreen('run');
    announcePhase('in');
  };

  const togglePause = () => {
    const now = Date.now();
    if (paused) {
      lastTickRef.current = now;
      setPaused(false);
      announcePhase(phaseRef.current);
    } else {
      const elapsed = now - lastTickRef.current;
      phaseRemainingRef.current -= elapsed;
      sessionRemainingRef.current -= elapsed;
      setPhaseRemaining(phaseRemainingRef.current);
      setSessionRemaining(sessionRemainingRef.current);
      setPaused(true);
      stopSpeaking();
    }
  };

  const finish = async () => {
    stopSpeaking();
    const totalTimeSeconds = startedAtRef.current
      ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
      : 0;
    setScreen('done');
    await saveBreathingSession({ cyclesCompleted: cyclesRef.current, totalTimeSeconds });
    speak(t(lang, 'breathingCompletedMessage'));
  };

  useEffect(() => {
    if (screen !== 'run' || paused) return undefined;
    lastTickRef.current = Date.now();
    const timerId = window.setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - lastTickRef.current;
      lastTickRef.current = now;

      sessionRemainingRef.current -= elapsedMs;
      phaseRemainingRef.current -= elapsedMs;

      if (sessionRemainingRef.current <= 0) {
        finish();
        return;
      }

      if (phaseRemainingRef.current <= 0) {
        if (phaseRef.current === 'out') {
          cyclesRef.current += 1;
          setCycles(cyclesRef.current);
        }
        const nextPhase = phaseRef.current === 'in' ? 'hold' : phaseRef.current === 'hold' ? 'out' : 'in';
        phaseRef.current = nextPhase;
        phaseRemainingRef.current = phaseDurationMs(nextPhase);
        setPhase(nextPhase);
        setPhaseRemaining(phaseRemainingRef.current);
        announcePhase(nextPhase);
      } else {
        setPhaseRemaining(phaseRemainingRef.current);
      }
      setSessionRemaining(sessionRemainingRef.current);
    }, 250);
    return () => window.clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, paused]);

  const instructionLines = t(lang, 'breathingInstruction').split('\n');

  return (
    <div className="breathing-page">
      <header className="app-header breathing-header">
        <div className="top-back-row breathing-top-back">
          <TopBackButton onClick={back} />
        </div>
        <h1>{t(lang, 'breathingName')}</h1>
      </header>

      <main className="screen breathing-screen">
        {screen === 'start' && (
          <>
            {instructionLines.map((line, index) => (
              <p className="instruction breathing-instruction" key={index}>
                {line}
              </p>
            ))}
            <p className="instruction breathing-instruction">{t(lang, 'breathingSafety')}</p>
            <div className="breathing-session-options">
              <button className="btn" type="button" onClick={() => chooseSession(QUICK_DURATION_SECONDS)}>
                {t(lang, 'breathingQuick')}
              </button>
              <button className="btn" type="button" onClick={() => chooseSession(GENTLE_DURATION_SECONDS)}>
                {t(lang, 'breathingLong')}
              </button>
            </div>
          </>
        )}

        {screen === 'run' && (
          <>
            <div className={`breathing-circle breathing-${phase}`} role="img">
              <p className="breathing-phase">{t(lang, phaseKey(phase))}</p>
            </div>
            <p className="instruction breathing-instruction">
              {paused
                ? `${t(lang, 'breathingPaused')} — ${t(lang, 'breathingPausedHelp')}`
                : t(lang, 'breathingPace')}
            </p>
            <div className="breathing-controls">
              <button className="btn" type="button" onClick={togglePause}>
                {paused ? t(lang, 'resume') : t(lang, 'pause')}
              </button>
              <button className="btn breathing-stop" type="button" onClick={finish}>
                {t(lang, 'stopExercise')}
              </button>
            </div>
          </>
        )}

        {screen === 'done' && (
          <div className="breathing-complete">
            <div className="breathing-rest-icon" aria-hidden="true">○</div>
            <h2>{t(lang, 'breathingComplete')}</h2>
            <p>{t(lang, 'breathingCompletedMessage')}</p>
            <p>{t(lang, 'breathingClosing')}</p>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setPaused(false);
                setScreen('start');
              }}
            >
              {t(lang, 'startAgain')}
            </button>
          </div>
        )}
      </main>
      <Navigation />
    </div>
  );
}

export default BreathingExercise;