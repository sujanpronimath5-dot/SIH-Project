import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { t, getAppLanguage } from '../i18n';
import { levelTier } from '../services/adaptive';
import { GAME_TYPES, getLevelState } from '../services/gameStore';
import MemoryMatchGame from './games/MemoryMatchGame';
import ShapeSortGame from './games/ShapeSortGame';
import FaceNameGame from './games/FaceNameGame';
import StoryGame from './games/StoryGame';
import { GameHeader } from './games/GameParts';
import Navigation from '../components/Navigation';
import '../styles/GameScreen.css';
import '../styles/Games.css';

const GAME_COMPONENTS = {
  [GAME_TYPES.pattern_matching]: MemoryMatchGame,
  [GAME_TYPES.shape_sort]: ShapeSortGame,
  [GAME_TYPES.face_name_recall]: FaceNameGame,
  [GAME_TYPES.remember_my_story]: StoryGame,
};

const GAME_META = {
  [GAME_TYPES.pattern_matching]: { nameKey: 'patternName', blurbKey: 'patternBlurb' },
  [GAME_TYPES.shape_sort]: { nameKey: 'shapeName', blurbKey: 'shapeBlurb' },
  [GAME_TYPES.face_name_recall]: { nameKey: 'faceName', blurbKey: 'faceBlurb' },
  [GAME_TYPES.remember_my_story]: { nameKey: 'storyName', blurbKey: 'storyBlurb' },
};

function GameScreen() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const lang = getAppLanguage();
  const [phase, setPhase] = useState('pick'); // 'pick' | 'play'
  const [levels, setLevels] = useState(null);
  const [picked, setPicked] = useState(1);
  const [sessionKey, setSessionKey] = useState(0);

  const Component = GAME_COMPONENTS[gameId];
  const meta = GAME_META[gameId];

  useEffect(() => {
    if (!Component) {
      navigate('/games', { replace: true });
      return;
    }
    let cancelled = false;
    getLevelState(gameId).then((states) => {
      if (cancelled) return;
      setLevels(states);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  if (!Component || !meta) return null;

  const goBackToGames = () => navigate('/games');

  const startLevel = (n) => {
    setPicked(n);
    setSessionKey((key) => key + 1);
    setPhase('play');
  };

  if (phase === 'play') {
    return (
      <div className="game-page">
        <div className="game-container">
          <div className="game-content">
            <Component
              key={sessionKey}
              lang={lang}
              level={picked}
              onHome={() => setPhase('pick')}
            />
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  const gameLevels = levels || [];

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="game-content">
          <GameHeader lang={lang} title={t(lang, meta.nameKey)} subtitle={t(lang, meta.blurbKey)} onBack={goBackToGames} />
          <main className="screen">
            <p className="instruction">{t(lang, 'chooseLevel')}</p>
            <div className="grid level-grid">
              {gameLevels.map((state, index) => {
                const n = index + 1;
                const locked = !state.unlocked;
                return (
                  <button
                    key={n}
                    className={`level-btn${locked ? ' level-locked' : ''}${state.passed ? ' level-passed' : ''}`}
                    type="button"
                    disabled={locked}
                    onClick={() => startLevel(n)}
                    aria-label={`${t(lang, 'level')} ${n}`}
                  >
                    <span className="level-btn-mark">
                      {locked ? '🔒' : state.passed ? '✓' : '▶'}
                    </span>
                    <span className="level-btn-label">
                      {t(lang, 'level')} {n}
                    </span>
                    <span className="level-btn-tier">{t(lang, levelTier(n))}</span>
                  </button>
                );
              })}
            </div>
          </main>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default GameScreen;