import { STRINGS as LEGACY_STRINGS } from './i18nLegacy';
import { LANGUAGE_LABELS as REACT_LABELS } from './i18nReact';

export const LANGUAGES = ['en', 'hi', 'as', 'bn', 'mni'];

export const SUPPORTED_LANGUAGES = LANGUAGES;

export const LANGUAGE_LABELS = {
  ...REACT_LABELS,
  mni: 'মণিপুরী',
};

const EXTRA = {
  en: {
    navHome: 'Home',
    navReminders: 'Reminders',
    navGames: 'Games',
    navSos: 'SOS',
    navProfile: 'Profile',
    stateLabel: 'State',
    statePlaceholder: 'Select your state',
    stateError: 'Please select your state',
    gameAlreadyAtLevel4: 'Highest level reached',
    progressEmptyTitle: 'Ready when you are',
    breathingTabTitle: 'Breathing',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    featureGamesDesc: 'Stimulating games for the mind',
    featureRemindersDesc: 'Daily tasks and medication times',
    featureBreathingDesc: 'A calm moment',
    featureVoiceDesc: 'Talk and get help by voice',
    featureFaceDesc: 'Quick secure check-in',
    featureProgressDesc: 'Your activity and improvements',
    featureEmergencyDesc: 'Quick access to help',
    featureProfileDesc: 'Your health information',
    dailyTipTitle: 'Daily Tip',
    dailyTipText: 'Remember to stay hydrated! Drink at least 8 glasses of water today.',
    pleaseCompleteProfile: 'Please complete your profile first.',
    goToSetup: 'Go to Setup',
    voiceAssistant: 'Voice Assistant',
    faceLogin: 'Face Login',
    levelCurrent: 'Level {n}',
  },
  hi: {
    navHome: 'होम',
    navReminders: 'रिमाइंडर',
    navGames: 'खेल',
    navSos: 'SOS',
    navProfile: 'प्रोफ़ाइल',
    stateLabel: 'राज्य',
    statePlaceholder: 'अपना राज्य चुनें',
    stateError: 'कृपया अपना राज्य चुनें',
    gameAlreadyAtLevel4: 'अधिकतम स्तर',
    progressEmptyTitle: 'जब आप तैयार हों',
    breathingTabTitle: 'सांस अभ्यास',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्ते',
    goodEvening: 'शुभ संध्या',
    featureGamesDesc: 'दिमाग के लिए खेल',
    featureRemindersDesc: 'दैनिक कार्य और दवा के समय',
    featureBreathingDesc: 'सुकून का एक पल',
    featureVoiceDesc: 'बोलें और वॉयस से मदद पाएं',
    featureFaceDesc: 'तेज़ सुरक्षित चेक-इन',
    featureProgressDesc: 'आपकी गतिविधि और सुधार',
    featureEmergencyDesc: 'मदद तक तुरंत पहुंच',
    featureProfileDesc: 'आपकी स्वास्थ्य जानकारी',
    dailyTipTitle: 'दैनिक सुझाव',
    dailyTipText: 'पानी पीना याद रखें! आज कम से कम 8 गिलास पानी पिएं।',
    pleaseCompleteProfile: 'कृपया पहले अपनी प्रोफ़ाइल पूरी करें।',
    goToSetup: 'सेटअप पर जाएं',
    voiceAssistant: 'वॉयस असिस्टेंट',
    faceLogin: 'फेस लॉगिन',
    levelCurrent: 'स्तर {n}',
  },
  as: {
    navHome: 'ঘৰ',
    navReminders: 'ৰিমাইণ্ডাৰ',
    navGames: 'খেলা',
    navSos: 'SOS',
    navProfile: 'প্ৰফাইল',
    stateLabel: 'ৰাজ্য',
    statePlaceholder: 'আপোনাৰ ৰাজ্য বাছনি কৰক',
    stateError: 'অনুগ্ৰহ কৰি আপোনাৰ ৰাজ্য বাছনি কৰক',
    gameAlreadyAtLevel4: 'সৰ্বোচ্চ স্তৰ',
    progressEmptyTitle: 'আপুনি সাজু হ’লেই',
    breathingTabTitle: 'উশাহ অভ্যাস',
    goodMorning: 'সুপ্ৰভাত',
    goodAfternoon: 'নমস্কাৰ',
    goodEvening: 'শুভ সন্ধ্যা',
    featureGamesDesc: 'মগজৰ বাবে উত্তেজনাপূৰ্ণ খেল',
    featureRemindersDesc: 'দৈনিক কাম আৰু ঔষধৰ সময়',
    featureBreathingDesc: 'এটা শান্ত মুহূৰ্ত',
    featureVoiceDesc: 'কওক আৰু কণ্ঠ সহায়কৰ সহায় লওক',
    featureFaceDesc: 'ক্ষিপ্ৰ নিৰাপদ চেক-ইন',
    featureProgressDesc: 'আপোনাৰ কাৰ্যকলাপ আৰু উন্নতি',
    featureEmergencyDesc: 'সহায়লৈ দ্ৰুত প্ৰৱেশ',
    featureProfileDesc: 'আপোনাৰ স্বাস্থ্য তথ্য',
    dailyTipTitle: 'দৈনিক পৰামৰ্শ',
    dailyTipText: 'পানী খোৱাটো মনত ৰাখক! আজি কমেও ৮ গিলাচ পানী খাওক।',
    pleaseCompleteProfile: 'অনুগ্ৰহ কৰি প্ৰথমে আপোনাৰ প্ৰফাইল সম্পূৰ্ণ কৰক।',
    goToSetup: 'ছেটআপলৈ যাওক',
    voiceAssistant: 'ভইচ সহায়ক',
    faceLogin: 'ফেচ লগইন',
    levelCurrent: 'স্তৰ {n}',
  },
  bn: {
    navHome: 'হোম',
    navReminders: 'রিমাইন্ডার',
    navGames: 'খেলা',
    navSos: 'SOS',
    navProfile: 'প্রোফাইল',
    stateLabel: 'রাজ্য',
    statePlaceholder: 'আপনার রাজ্য নির্বাচন করুন',
    stateError: 'আপনার রাজ্য নির্বাচন করুন',
    gameAlreadyAtLevel4: 'সর্বোচ্চ স্তর',
    progressEmptyTitle: 'আপনি তৈরি থাকলেই',
    breathingTabTitle: 'শ্বাস ব্যায়াম',
    goodMorning: 'সুপ্রভাত',
    goodAfternoon: 'নমস্কার',
    goodEvening: 'শুভ সন্ধ্যা',
    featureGamesDesc: 'মনের জন্য উদ্দীপক খেলা',
    featureRemindersDesc: 'দৈনিক কাজ ও ওষুধের সময়',
    featureBreathingDesc: 'একটু প্রশান্তির মুহূর্ত',
    featureVoiceDesc: 'বলে ভয়েস দিয়ে সাহায্য নিন',
    featureFaceDesc: 'দ্রুত নিরাপদ চেক-ইন',
    featureProgressDesc: 'আপনার কার্যকলাপ ও উন্নতি',
    featureEmergencyDesc: 'সাহায্যে দ্রুত প্রবেশ',
    featureProfileDesc: 'আপনার স্বাস্থ্য তথ্য',
    dailyTipTitle: 'দৈনিক টিপস',
    dailyTipText: 'পানি পান করার কথা মনে রাখুন! আজ অন্তত ৮ গ্লাস পানি পান করুন।',
    pleaseCompleteProfile: 'আগে আপনার প্রোফাইল সম্পূর্ণ করুন।',
    goToSetup: 'সেটআপে যান',
    voiceAssistant: 'ভয়েস অ্যাসিস্ট্যান্ট',
    faceLogin: 'ফেস লগইন',
    levelCurrent: 'স্তর {n}',
  },
  mni: {
    navHome: 'য়ুম',
    navReminders: 'মাং-নিংশিনপা থৌরমশিং',
    navGames: 'শানবা',
    navSos: 'SOS',
    navProfile: 'মসীবু শাংলেনশিং',
    stateLabel: 'লেইন্মক',
    statePlaceholder: 'নহাক্কী লেইন্মক খনবীয়ু',
    stateError: 'অনৌতবুনা নহাক্কী লেইন্মক খনবীয়ু',
    gameAlreadyAtLevel4: 'অরোইবা থাক',
    progressEmptyTitle: 'নহাক শেম-শাবা মতমদা',
    breathingTabTitle: 'স্বাস হোনবা',
    goodMorning: 'য়াম্না ফ্বরবা য়ুকথাং',
    goodAfternoon: 'নুংঙাইবা অফুংবা',
    goodEvening: 'মানকৈ য়াইরোইবগী মতম',
    featureGamesDesc: 'নিংগোন্দারশিংগী শানবা',
    featureRemindersDesc: 'নুমিদাঙী থৌরমশিং অমসুং ডবগী মতম',
    featureBreathingDesc: 'তপ্না নুংঙাইবা মতম',
    featureVoiceDesc: 'ৱারী তাবিযু অমসুং খোলদগী মাতেং লৌবিযু',
    featureFaceDesc: 'থাংনোল নুংঙাইবা চেক-ইন',
    featureProgressDesc: 'নহগী থৌরমশিং অমসুং চেংহন্বা',
    featureEmergencyDesc: 'মাতেংগী থোকদনা লৌবা',
    featureProfileDesc: 'নহগী মাও-সরুককী মন্তকশিং',
    dailyTipTitle: 'নুমিদাঙী ৱাহঙ',
    dailyTipText: 'ইসিঙ থকপা নিংশিনবীয়ু! ঙসি খুদ্যম অপুনা ইসিঙ চথরু।',
    pleaseCompleteProfile: 'চানবীদুনা মারনী নহগী প্রোফাইল লোইশিল্লো।',
    goToSetup: 'ছেটআপদা চত্থবীয়ু',
    voiceAssistant: 'খোল সহায়ক',
    faceLogin: 'মাইথোং লগইন',
    levelCurrent: 'থাক {n}',
  },
};

const MERGED = {};
for (const lang of LANGUAGES) {
  MERGED[lang] = {
    ...(LEGACY_STRINGS[lang] || {}),
    ...(EXTRA[lang] || {}),
  };
}

/**
 * Looks up a translation. Falls back to English for missing keys/placeholders.
 */
export function t(lang, key) {
  const normalized = LANGUAGES.includes(lang) ? lang : 'en';
  const pack = MERGED[normalized];
  const value = pack && Object.prototype.hasOwnProperty.call(pack, key)
    ? pack[key]
    : undefined;
  const isPlaceholder = typeof value === 'string' && value.includes('TRANSLATION NEEDED');
  if (value === undefined || isPlaceholder) {
    const fallback = MERGED.en[key];
    return fallback !== undefined ? fallback : `[${key}]`;
  }
  return value;
}

export function tf(lang, key, vars = {}) {
  let text = t(lang, key);
  for (const [name, value] of Object.entries(vars)) {
    text = text.split(`{${name}}`).join(String(value));
  }
  return text;
}

export function missingTranslation(lang, key) {
  return `[${key}]`;
}

export const RELATIONSHIP_KEYS = [
  'mother',
  'father',
  'daughter',
  'son',
  'sister',
  'brother',
  'spouse',
  'neighbor',
  'nurse',
  'doctor',
  'granddaughter',
  'grandson',
  'friend',
];

export function tRel(lang, key) {
  return t(lang, `rel_${key}`);
}

export function languageLabel(code) {
  return LANGUAGE_LABELS[code] || code;
}

export function detectLanguage() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('preferredLang');
    if (saved && LANGUAGES.includes(saved)) return saved;
  }
  if (typeof navigator !== 'undefined') {
    const userLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (LANGUAGES.includes(userLang)) return userLang;
  }
  return 'en';
}

/**
 * Preferred language for the whole patient app.
 * Priority: saved patient record -> localStorage pick -> browser language.
 */
export function getAppLanguage() {
  if (typeof localStorage !== 'undefined') {
    try {
      const patient = localStorage.getItem('patientData');
      if (patient) {
        const parsed = JSON.parse(patient);
        if (parsed && parsed.language && LANGUAGES.includes(parsed.language)) {
          return parsed.language;
        }
      }
    } catch (error) {
      // fall through
    }
  }
  return detectLanguage();
}