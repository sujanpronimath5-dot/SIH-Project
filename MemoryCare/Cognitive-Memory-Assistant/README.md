# Patient Care & Assistance System (Memory Care / Cognitive Memory Assistant)

A multilingual, elderly-friendly healthcare companion built with React and packaged as a native Android app with Capacitor. It helps patients with dementia/cognitive decline through cognitive games, medication reminders, breathing exercises, an emergency SOS, and a multilingual voice assistant — with dedicated portals for family/caregivers and nurses to monitor progress.

## Highlights

- **9 built-in languages** (English, Hindi, Bengali, Assamese, Manipuri, Bodo, Khasi, Garo, Mizo) — full app UI, games, and story content localized.
- **Offline-first** voice output: bundled pre-recorded audio bundles for common phrases fall back to browser TTS, and Bhashini (ULCA/Dhruva) TTS for online Indian-language speech.
- **Role-based flows**: Patient, Family/Caregiver, and Nurse. Family and nurse logins persist across app restarts (until logout/uninstall).
- **Native notifications** via the Capacitor Local Notifications plugin, with a bundled notification sound played twice on reminder triggers.
- Runs as a **PWA-friendly React web app** and as an **Android APK** through Capacitor.

## Features

- **Welcome → Role Selection → Patient Setup** onboarding with a patient registry stored in `localStorage`.
- **Patient Dashboard**: quick tiles for Games, Reminders, Breathing, Emergency (SOS), and Profile.
- **Cognitive Games** (`/games`):
  - Memory Match — flip cards to find pairs.
  - Face & Name — match faces to names for recognition training.
  - Shape Sort — sort shapes by category.
  - Story Reading — reading/comprehension with story content.
  - Pattern Matching — adaptive difficulty based on performance.
- **Reminders**: add/edit/complete medication and daily reminders, with native scheduled notifications and the double-chime sound.
- **Breathing Exercise**: guided breathing with real-time pacing and spoken cues.
- **Emergency Call**: one-tap SOS contact dialing with confirmation and safety guidance.
- **Voice Assistant**: large mic interface, multilingual prompts, spoke-back responses.
- **Profile**: view/edit patient info, choose app language (speaks the new language), and manage **Bhashini API keys** (update/ULCA key + inference key) — blank fields fall back to the built-in default keys.
- **Family/Caregiver Dashboard**: patient progress, game analytics, reminders overview, family photos, and link/members management (requires 4-digit code sign-up / login).
- **Nurse Dashboard**: clinical access to patient performance, progress trends, and insights (4-digit code + patient ID login).
- **My Progress**: per-game accuracy and session history for the patient.
- **Smart adaptive difficulty** (`services/adaptive.js`) that tunes games to the patient's accuracy.

## Project Structure

```
.
├── public/
│   ├── index.html
│   ├── voice/<lang>/*.mp3      # Bundled pre-recorded phrase audio (en/hi/bn/...)
│   └── sounds/notification.mp3 # Notification chime (also copied to Android res/raw)
├── src/
│   ├── App.js                  # Routes and app shell
│   ├── index.js                # React entry point
│   ├── i18n.js / i18nReact.js / i18nLegacy.js  # 9-language UI strings
│   ├── voicePhrases.js         # Phrase keys per language (for /voice bundles)
│   ├── components/
│   │   ├── Navigation.js       # Bottom navigation bar
│   │   ├── TopBackButton.js    # Reusable top-left back button
│   │   ├── ViewerInsights.js   # Nurse/family performance insights
│   │   └── OfflineLangAlert.js
│   ├── pages/
│   │   ├── WelcomePage.js, RoleSelectionPage.js, PatientSetupPage.js
│   │   ├── PatientDashboard.js
│   │   ├── GamesPage.js, GameScreen.js
│   │   ├── games/              # MemoryMatchGame, FaceNameGame, ShapeSortGame, StoryGame, GameParts
│   │   ├── content/            # Story / game content per language
│   │   ├── ReminderScreen.js, BreathingExercise.js, MyProgress.js
│   │   ├── VoiceAssistantScreen.js, EmergencyCallScreen.js, ProfileScreen.js
│   │   ├── FamilyLoginPage.js, FamilyDashboard.js, LinkPatientPage.js, FamilyMemberPage.js
│   │   └── NurseLoginPage.js, NurseDashboard.js
│   ├── services/
│   │   ├── patientRegistry.js  # Patient records in localStorage
│   │   ├── gameStore.js        # Game results / accuracy persistence
│   │   ├── viewerApi.js        # Family/nurse linking sessions
│   │   ├── voice.js            # Bundle-first speech playback
│   │   ├── bhashiniTTS.js      # Online Bhashini (ULCA/Dhruva) TTS
│   │   ├── pwa.js              # Notification scheduling + double-chime sound
│   │   └── adaptive.js         # Adaptive difficulty engine
│   └── styles/                 # Per-page + shared CSS
└── android/                    # Capacitor Android project (assembleDebug produces the APK)
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or yarn)
- Java 21 (JDK) and the Android SDK to build the APK

### Web development

```bash
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

## Multilingual Support

- Language packs live in `i18n.js` (merged from `i18nLegacy.js` → `i18nReact.js` → per-language extras). `t(lang, key)` falls back to English for any missing key.
- Voice: `voice.js` first plays bundled `/voice/{lang}/{key}.mp3`, then falls back to browser TTS / Bhashini TTS.
- Games also localize their content (story books, shape-sort labels, face-name prompts).

## Notifications

- `services/pwa.js` schedules reminders through the Capacitor Local Notifications plugin.
- `playNotificationSound(repeats = 2)` plays `sounds/notification.mp3` twice with an autoplay-block fallback (queues a retry on the next user gesture).
- The MP3 is bundled both as a web asset (`public/sounds/`) and a native raw resource (`android/app/src/main/res/raw/notification.mp3`).

## Configuration

- **Bhashini API keys**: set custom Update/ULCA key and Inference key from the patient **Profile → API Keys** section, or edit the constants in `src/services/bhashiniTTS.js`.
- **Adaptive difficulty**: tune thresholds in `src/services/adaptive.js`.
- **Game content**: edit files under `src/content/` (story/pattern/shape/face-name content per language).

## Troubleshooting

- **Port in use**: `npm start -- --port 3001`
- **App looks stale after a release**: clear app data (or `localStorage.clear()` in DevTools).
- **TTS offline**: bundled phrase audio only covers recorded languages (en/hi/bn and more) — other languages need a connection for Bhashini TTS.
- **APK build fails**: confirm `JAVA_HOME` points to a JDK 21 install and `ANDROID_HOME` to the Android SDK.

## License

Built for healthcare accessibility.