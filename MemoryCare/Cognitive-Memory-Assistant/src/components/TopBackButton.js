import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t, getAppLanguage } from '../i18n';

function TopBackButton({ to = '/dashboard', onClick, children }) {
  const navigate = useNavigate();
  const lang = getAppLanguage();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };
  return (
    <button type="button" className="top-back-btn" onClick={handleClick}>
      <span className="top-back-arrow" aria-hidden="true">←</span>
      <span className="top-back-label">{children || t(lang, 'back')}</span>
    </button>
  );
}

export default TopBackButton;