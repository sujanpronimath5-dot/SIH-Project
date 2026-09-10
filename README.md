# Patient Care & Assistance System (Memory Care / Cognitive Memory Assistant)

A multilingual, elderly-friendly healthcare companion built with **React** and packaged as a native **Android** app with **Capacitor**. It helps patients with dementia/cognitive decline through cognitive games, medication reminders, breathing exercises, an emergency SOS, and a multilingual voice assistant — with dedicated portals for family/caregivers and nurses to monitor progress.

## Highlights

- **9 built-in languages** — English, Hindi, Bengali, Assamese, Manipuri, Bodo, Khasi, Garo, Mizo — covering full app UI, games, and story content.
- **Offline-first voice output** — bundled pre-recorded audio bundles (`public/voice/<lang>/*.mp3`) for common phrases fall back to browser TTS and Bhashini (ULCA/Dhruva) TTS for online Indian-language speech.
- **Role-based flows** — Patient, Family/Caregiver, and Nurse portals. Family and nurse logins persist across app restarts.
- **Native notifications** — Capacitor Local Notifications plugin with a bundled double-chime notification sound.
- Runs as a **PWA-friendly React web app** and as an **Android APK** through Capacitor.

## Features

- **Welcome → Role Selection → Patient Setup** onboarding with a patient registry stored in `localStorage`.
- **Patient Dashboard** — quick tiles for Games, Reminders, Breathing, Emergency (SOS), and Profile.
- **Cognitive Games** (`/games`):
  - Memory Match — flip cards to find pairs.
  - Face & Name — match faces to names for recognition training.
  - Shape Sort — sort shapes by category.
  - Story Reading — reading/comprehension with localized story content.
  - Pattern Matching — adaptive difficulty based on performance.
- **Reminders** — add/edit/complete medication and daily reminders, with native scheduled notifications and the double-chime sound.
- **Breathing Exercise** — guided breathing with real-time pacing and spoken cues.
- **Emergency Call** — one-tap SOS contact dialing with confirmation and safety guidance.
- **Voice Assistant** — large mic interface, multilingual prompts, spoken-back responses.
- **Profile** — view/edit patient info, choose app language (speaks the new language), and manage **Bhashini API keys** (update key + inference key); blank fields fall back to the built-in default keys.
- **Family/Caregiver Dashboard** — patient progress, game analytics, reminders overview, family photos, and link/members management (4-digit code sign-up/login).
- **Nurse Dashboard** — clinical access to patient performance, progress trends, and insights (4-digit code + patient ID login).
- **My Progress** — per-game accuracy and session history for the patient.
- **Smart adaptive difficulty** — tunes games to the patient's accuracy.

## Voice / Offline Audio

The app speaks text through a three-tier pipeline in `src/services/voice.js`:

1. **Bundled offline MP3s** — `src/voicePhrases.js` maps every spoken phrase (per language) to `public/voice/{lang}/{key}.mp3`. Bundles exist for **en, hi, bn, as, mni, brx**.
2. **Local browser TTS** — used when a phrase is not bundled.
3. **Bhashini (ULCA/Dhruva) TTS** — online Indian-language synthesis via `src/services/bhashiniTTS.js`.

Regenerating the audio bundles:

```bash
# 1. Extract per-language story phrases (stories, questions, options)
node scripts/extract-story.js

# 2. Synthesize MP3s for all languages (skips existing files; as/mni/brx use Bhashini)
python scripts/gen-voice.py          # or: python scripts/gen-voice.py <lang>
```

Notes:
- Story option audio uses the localized format spoken by the game, e.g. `विकल्प 1: अस्पताल`, `थाखाय 1: ओसदखाना`.
- `edge-tts` synthesizes en/hi/bn; `as`/`mni`/`brx` are synthesized through the Bhashini pipeline and converted with `ffmpeg`.
- Content translations live in `src/content/` (e.g. `Bodo story.js`), UI strings in `src/i18n.js`.

## Project Structure

```
.
├── MemoryCare/Cognitive-Memory-Assistant/   # Main application
│   ├── public/
│   │   ├── index.html
│   │   ├── voice/<lang>/*.mp3               # Bundled pre-recorded phrase audio (6 languages)
│   │   └── sounds/notification.mp3          # Notification chime
│   ├── src/
│   │   ├── App.js                           # Routes and app shell
│   │   ├── index.js                         # React entry point
│   │   ├── i18n.js / i18nReact.js / i18nLegacy.js  # 9-language UI strings
│   │   ├── voicePhrases.js                  # Phrase keys per language (for /voice bundles)
│   │   ├── content/                         # Story / game content per language
│   │   ├── components/                      # Navigation, back button, alerts, insights
│   │   ├── pages/                           # All screens (games, dashboards, login, SOS…)
│   │   ├── services/                        # voice, bhashiniTTS, patientRegistry, gameStore, pwa, adaptive…
│   │   └── styles/                          # Per-page + shared CSS
│   ├── scripts/
│   │   ├── extract-story.js                 # Extract per-language story phrases
│   │   └── gen-voice.py                     # Generate offline audio bundles (edge-tts / Bhashini)
│   └── android/                             # Capacitor Android project (assembleDebug → APK)
└── README.md                                # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn)
- Python 3 (for the voice bundle scripts) with `ffmpeg` and `edge-tts`
- Java 21 (JDK) and the Android SDK to build the APK

### Web development

```bash
cd MemoryCare/Cognitive-Memory-Assistant
npm install
npm start          # http://localhost:3000
npm run build      # production build -> build/
```

### Android APK

```bash
npm run build                 # 1. build web assets
npx cap sync android          # 2. copy assets + plugins into android/
# 3. build the debug APK (Windows):
$env:JAVA_HOME="<path-to-jdk21>"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
.\android\gradlew.bat -p android assembleDebug --no-daemon
# APK output: android/app/build/outputs/apk/debug/app-debug.apk
```

## Data Storage

Everything persists in the WebView's `localStorage` (per-app storage on Android; cleared on uninstall):

- `patientData` — current patient profile
- `memoryCareResults` — game results/accuracy
- `reminders` — reminder list (also scheduled natively)
- `familyAccounts` / `nurseAccounts` — registered users with 4-digit codes
- `currentFamilyUser` / `currentNurseUser` — active sessions (kept until logout)
- `bhashiniUpdateKey` / `bhashiniInferenceKey` — custom Bhashini API keys

## Configuration

- **Bhashini API keys** — set custom update/inference keys from **Profile → API Keys**, or edit constants in `src/services/bhashiniTTS.js` and `scripts/gen-voice.py`.
- **Adaptive difficulty** — tune thresholds in `src/services/adaptive.js`.
- **Game content** — edit files under `src/content/` (story/pattern/shape/face-name content per language).

## Troubleshooting

- **Port in use**: `npm start -- --port 3001`
- **Stale after a release**: clear app data (or `localStorage.clear()` in DevTools).
- **TTS offline**: bundled audio covers en/hi/bn/as/mni/brx; other languages need a connection for Bhashini TTS.
- **APK build fails**: confirm `JAVA_HOME` points to a JDK 21 install and `ANDROID_HOME` to the Android SDK.

## License

Built for healthcare accessibility.