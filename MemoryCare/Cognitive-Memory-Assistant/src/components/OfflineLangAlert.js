import React, { useState, useEffect, useCallback } from 'react';
import { isBhashiniLang, checkBhashiniOnline } from '../services/bhashiniTTS';
import { LANGUAGE_LABELS } from '../i18n';
import '../styles/OfflineLangAlert.css';

const OFFLINE_MESSAGES = {
  hi: 'इस भाषा में आवाज़ के लिए इंटरनेट ज़रूरी है। कृपया English में बदलें या WiFi से जुड़ें।',
  bn: 'এই ভাষায় কণ্ঠের জন্য ইন্টারনেট প্রয়োজন। অনুগ্রহ করে English এ পরিবর্তন করুন বা WiFi এ সংযুক্ত করুন।',
  as: 'এই ভাষাত কণ্ঠৰ বাবে ইণ্টাৰনেট লাগে। অনুগ্ৰহ কৰি English লৈ সলনি কৰক বা WiFi ত সংযোগ কৰক।',
  mni: 'মসি লোনদা খোলগীদমক ইন্টাৰনেট মথৌ তাই। চানবীদুনা English দা হোংদোকো নত্ৰগা WiFi দা চোংশিন্নবীয়ু।',
  brx: 'बे रावआव राव सोदोबनि थाखाय इन्टारनेट नांगौ। अननानै English आव सोलाय एबा WiFi जों फोनांजाब।',
  kha: 'Ka internet ka donkam ban pynmih ktien ha kane ka jait ktien. Sngewbha kylla sha ka English lane pyniasoh sha ka WiFi.',
  grt: 'Ia gita ku·sikko agananaba internet nanggen. Dakchake English-ona dingtangbo ba WiFi-o nangrimatbo.',
  lus: 'He ṭawng aw hman theih nan internet a ngai a. Khawngaihin English-ah thlak la, a nih loh pawhin WiFi connect rawh.',
};

/**
 * Reusable alert banner that appears when:
 * - Current language is a Bhashini language (hi/bn/as/mni)
 * - AND the device is offline
 *
 * Listens to online/offline events to auto-show/hide.
 */
function OfflineLangAlert({ lang }) {
  const [dismissed, setDismissed] = useState(false);
  const [isOffline, setIsOffline] = useState(!checkBhashiniOnline());

  const handleOnline = useCallback(() => {
    setIsOffline(false);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOffline(true);
    setDismissed(false); // re-show if goes offline again
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Don't render if: English, online, or dismissed
  if (!isBhashiniLang(lang) || !isOffline || dismissed) {
    return null;
  }

  const langName = LANGUAGE_LABELS[lang] || lang;
  const message = OFFLINE_MESSAGES[lang] || OFFLINE_MESSAGES.hi;

  return (
    <div className="offline-lang-alert" role="alert">
      <div className="offline-lang-alert-icon">📶</div>
      <div className="offline-lang-alert-content">
        <strong className="offline-lang-alert-title">
          {langName} — Internet Required
        </strong>
        <p className="offline-lang-alert-message">{message}</p>
      </div>
      <button
        className="offline-lang-alert-dismiss"
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export default OfflineLangAlert;
