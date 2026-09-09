import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t, getAppLanguage } from '../i18n';
import { GAME_TYPES, getPlayLevel } from '../services/gameStore';
import { levelSubtitle } from './games/GameParts';
import Navigation from '../components/Navigation';
import '../styles/GamesPage.css';
import '../styles/Games.css';

const GAMES = [
  { id: GAME_TYPES.pattern_matching, nameKey: 'patternName', blurbKey: 'patternBlurb', category: 'memory' },
  { id: GAME_TYPES.shape_sort, nameKey: 'shapeName', blurbKey: 'shapeBlurb', category: 'attention' },
  { id: GAME_TYPES.face_name_recall, nameKey: 'faceName', blurbKey: 'faceBlurb', category: 'memory' },
  { id: GAME_TYPES.remember_my_story, nameKey: 'storyName', blurbKey: 'storyBlurb', category: 'story' },
];

function GamesPage() {
  const navigate = useNavigate();
  const lang = getAppLanguage();
  const [levels, setLevels] = useState({});

  useEffect(() => {
    const loadLevels = async () => {
      const map = {};
      for (const game of GAMES) {
        map[game.id] = await getPlayLevel(game.id);
      }
      setLevels(map);
    };
    loadLevels();
  }, []);

  return (
    <div className="games-page">
      <div className="games-container">
        <div className="games-grid">
          {GAMES.map((game) => {
            const level = levels[game.id] || 1;
            return (
              <button
                key={game.id}
                className="games-card"
                type="button"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <h3 className="games-card-title">{t(lang, game.nameKey)}</h3>
                <p className="games-card-desc">{t(lang, game.blurbKey)}</p>
                <div className="games-card-footer">
                  <span className="games-card-level">{levelSubtitle(lang, level)}</span>
                  <span className="games-card-play">{t(lang, 'play')} →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default GamesPage;