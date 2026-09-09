import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, Gamepad2, User, Phone } from 'lucide-react';
import { t, getAppLanguage } from '../i18n';
import '../styles/Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = getAppLanguage();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-navigation">
      <button
        className={`nav-button ${isActive('/dashboard') ? 'active' : ''}`}
        onClick={() => navigate('/dashboard')}
        title={t(lang, 'navHome')}
      >
        <Home size={28} />
        <span>{t(lang, 'navHome')}</span>
      </button>
      <button
        className={`nav-button ${isActive('/reminders') ? 'active' : ''}`}
        onClick={() => navigate('/reminders')}
        title={t(lang, 'navReminders')}
      >
        <Clock size={28} />
        <span>{t(lang, 'navReminders')}</span>
      </button>
      <button
        className={`nav-button ${isActive('/games') ? 'active' : ''}`}
        onClick={() => navigate('/games')}
        title={t(lang, 'navGames')}
      >
        <Gamepad2 size={28} />
        <span>{t(lang, 'navGames')}</span>
      </button>
      <button
        className={`nav-button ${isActive('/emergency') ? 'active' : ''}`}
        onClick={() => navigate('/emergency')}
        title={t(lang, 'navSos')}
      >
        <Phone size={28} />
        <span>{t(lang, 'navSos')}</span>
      </button>
      <button
        className={`nav-button ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
        title={t(lang, 'navProfile')}
      >
        <User size={28} />
        <span>{t(lang, 'navProfile')}</span>
      </button>
    </nav>
  );
}

export default Navigation;
