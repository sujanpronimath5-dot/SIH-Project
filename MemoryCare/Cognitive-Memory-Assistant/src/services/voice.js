const LANG_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
  bn: "bn-IN",
  mni: "mni-IN",
};

const REMOTE_LOCALES = {
  en: "en",
  hi: "hi",
  bn: "bn",
  as: "as",
  mni: "mni",
};

let currentLang = "en";
let lastSpokenText = "";
let speakGeneration = 0;
let activeUtterance = null;
let activeAudio = null;
let speakTimer = 0;
let pausedByUser = false;
let resumeFallbackTimer = 0;
let voicesCache = [];
let voicesAttached = false;
let pendingRemote = null;
let unlockAttached = false;

function refreshVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return voicesCache;
  const list = window.speechSynthesis.getVoices() || [];
  if (list.length) voicesCache = list;
  if (!voicesAttached) {
    voicesAttached = true;
    try {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        const updated = window.speechSynthesis.getVoices() || [];
        if (updated.length) voicesCache = updated;
      });
    } catch {
      /* ignore */
    }
  }
  return voicesCache;
}

export function setVoiceLang(lang) {
  currentLang = Object.prototype.hasOwnProperty.call(LANG_MAP, lang) ? lang : "en";
  refreshVoices();
}

export function getVoiceLang() {
  return currentLang;
}

export function hasVoiceFor(lang) {
  const code = String(lang || currentLang).slice(0, 2).toLowerCase();
  const wanted = String(LANG_MAP[lang] || "").toLowerCase();
  return refreshVoices().some(
    (voice) =>
      (String(voice.lang || "").toLowerCase() === wanted && wanted !== "")
      || String(voice.lang || "").toLowerCase().startsWith(code)
  );
}

export function canSpeak(lang) {
  const code = String(lang || currentLang).slice(0, 2).toLowerCase();
  if (REMOTE_LOCALES[code] || REMOTE_LOCALES[lang]) return true;
  return hasVoiceFor(lang);
}

function pickVoice() {
  const voices = refreshVoices();
  if (!voices.length) return null;
  const wanted = LANG_MAP[currentLang];
  const prefix = currentLang.slice(0, 2);
  return (
    voices.find((v) => v.lang === wanted)
    || voices.find((v) => (v.lang || "").toLowerCase().startsWith(prefix))
    || null
  );
}

function remoteUrl(text, lang) {
  const locale = REMOTE_LOCALES[lang];
  if (!locale) return null;
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${locale}&q=${encodeURIComponent(
    String(text).slice(0, 200)
  )}`;
}

function attachGestureUnlock() {
  if (unlockAttached || typeof document === "undefined") return;
  unlockAttached = true;
  const tryPlay = () => {
    const item = pendingRemote;
    if (!item) return;
    pendingRemote = null;
    const { audio, onend, generation } = item;
    if (!audio || generation !== speakGeneration) {
      if (onend) onend();
      return;
    }
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        if (activeAudio === audio) activeAudio = null;
        if (onend) onend();
      });
    }
  };
  document.addEventListener("pointerdown", tryPlay, { capture: true });
  document.addEventListener("touchstart", tryPlay, { capture: true });
  document.addEventListener("keydown", tryPlay, { capture: true });
}

function speakRemote(text, generation, onend) {
  const url = remoteUrl(text, currentLang);
  if (!url) return false;
  try {
    const audio = new Audio();
    audio.src = url;
    audio.preload = "auto";
    activeAudio = audio;
    const clear = () => {
      if (activeAudio === audio) activeAudio = null;
    };
    const okEnd = () => {
      clear();
      if (generation === speakGeneration && onend) onend();
    };
    audio.onended = okEnd;
    audio.onerror = () => {
      clear();
      if (pendingRemote && pendingRemote.audio === audio) pendingRemote = null;
      if (generation === speakGeneration) startUtterance(text, generation, onend);
      else if (onend) onend();
    };
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch((err) => {
        if (generation !== speakGeneration) {
          clear();
          return;
        }
        const blocked = err && (err.name === "NotAllowedError" || err.name === "AbortError");
        if (blocked) {
          pendingRemote = { audio, onend, generation };
          attachGestureUnlock();
          window.setTimeout(() => {
            if (pendingRemote && pendingRemote.generation === generation) {
              pendingRemote = null;
              clear();
              startUtterance(text, generation, onend);
            }
          }, 2500);
          return;
        }
        clear();
        startUtterance(text, generation, onend);
      });
    }
    return true;
  } catch {
    activeAudio = null;
    return false;
  }
}

function emitSpeech(text, generation, onend) {
  if (generation !== speakGeneration) return;

  const scheduleLocal = () => {
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isiOS) {
      startUtterance(text, generation, onend);
      return;
    }
    speakTimer = window.setTimeout(() => {
      speakTimer = 0;
      startUtterance(text, generation, onend);
    }, 80);
  };

  if (hasVoiceFor(currentLang)) {
    scheduleLocal();
    return;
  }
  if (speakRemote(text, generation, onend)) {
    return;
  }
  scheduleLocal();
}

function startUtterance(text, generation, onend) {
  if (generation !== speakGeneration) return;
  if (!("speechSynthesis" in window)) {
    if (onend) onend();
    return;
  }

  const voices = refreshVoices();
  if (!voices.length) {
    window.setTimeout(() => startUtterance(text, generation, onend), 250);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_MAP[currentLang];
  utterance.rate = currentLang === "hi" ? 0.85 : 0.9;
  utterance.pitch = currentLang === "hi" ? 1.05 : 1;
  utterance.volume = 1;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    if (activeUtterance === utterance) activeUtterance = null;
    if (generation === speakGeneration && onend) onend();
  };
  utterance.onerror = () => {
    if (activeUtterance === utterance) activeUtterance = null;
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  try {
    window.speechSynthesis.resume();
  } catch {
    /* ignore */
  }
}

export function speak(text, onend = null) {
  if (text == null) return;
  const next = String(text).trim();
  if (!next) return;

  lastSpokenText = next;
  if (!("speechSynthesis" in window)) {
    if (onend) onend();
    return;
  }

  const generation = ++speakGeneration;
  pausedByUser = false;
  if (resumeFallbackTimer) {
    window.clearTimeout(resumeFallbackTimer);
    resumeFallbackTimer = 0;
  }
  if (speakTimer) {
    window.clearTimeout(speakTimer);
    speakTimer = 0;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  activeUtterance = null;
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch {
      /* ignore */
    }
    activeAudio = null;
  }

  // Chrome reports voices asynchronously; wait a moment for the list before deciding.
  let waited = 0;
  const begin = () => {
    if (generation !== speakGeneration) return;
    if (!voicesCache.length && waited < 4) {
      waited += 1;
      window.setTimeout(begin, 200);
      return;
    }
    emitSpeech(next, generation, onend);
  };
  begin();
}

export function speakSequence(texts) {
  const sequence = texts
    .filter((text) => text != null)
    .map((text) => String(text).trim())
    .filter(Boolean)
    .join(" ");
  if (sequence) speak(sequence);
}

export function repeatLast() {
  if (!lastSpokenText) return;
  speak(lastSpokenText);
}

export function isSpeechPaused() {
  return pausedByUser;
}

export function toggleSpeaking() {
  if (activeAudio) {
    if (pausedByUser) {
      pausedByUser = false;
      try {
        activeAudio.play();
      } catch {
        /* ignore */
      }
      return false;
    }
    pausedByUser = true;
    try {
      activeAudio.pause();
    } catch {
      /* ignore */
    }
    return true;
  }

  if (!("speechSynthesis" in window)) return false;
  if (pausedByUser) {
    pausedByUser = false;
    try {
      window.speechSynthesis.resume();
    } catch {
      /* ignore */
    }
    if (resumeFallbackTimer) window.clearTimeout(resumeFallbackTimer);
    const phrase = lastSpokenText;
    resumeFallbackTimer = window.setTimeout(() => {
      resumeFallbackTimer = 0;
      if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) speak(phrase);
    }, 1500);
    return false;
  }

  pausedByUser = true;
  try {
    window.speechSynthesis.pause();
  } catch {
    /* ignore */
  }
  return true;
}

export function stopSpeaking() {
  ++speakGeneration;
  pausedByUser = false;
  if (speakTimer) {
    window.clearTimeout(speakTimer);
    speakTimer = 0;
  }
  if (resumeFallbackTimer) {
    window.clearTimeout(resumeFallbackTimer);
    resumeFallbackTimer = 0;
  }
  pendingRemote = null;
  activeUtterance = null;
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch {
      /* ignore */
    }
    activeAudio = null;
  }

  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}