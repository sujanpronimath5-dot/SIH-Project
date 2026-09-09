# Development Guide

## Architecture Overview

### Directory Structure
```
src/
├── App.js                      # Main app with routing
├── index.js                    # Entry point
├── components/                 # Reusable components
│   └── Navigation.js           # Bottom navigation bar
├── pages/                      # Page components
│   ├── WelcomePage.js
│   ├── RoleSelectionPage.js
│   ├── PatientSetupPage.js
│   ├── PatientDashboard.js
│   ├── GameScreen.js
│   ├── ReminderScreen.js
│   ├── VoiceAssistantScreen.js
│   ├── FaceLoginScreen.js
│   ├── EmergencyCallScreen.js
│   └── ProfileScreen.js
└── styles/                     # CSS modules
    └── [component].css
```

## Component Pattern

Each page component follows this pattern:

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PageName.css';

function PageName({ patient }) {
  const navigate = useNavigate();
  const [state, setState] = useState(null);

  useEffect(() => {
    // Load data from localStorage
  }, []);

  const handleAction = () => {
    // Save to localStorage
    navigate('/next-page');
  };

  return (
    <div className="page-container">
      {/* Component JSX */}
    </div>
  );
}

export default PageName;
```

## State Management

### LocalStorage Keys
```javascript
// Patient Profile
localStorage.setItem('patientData', JSON.stringify({
  name: 'John Doe',
  age: 75,
  phone: '+1-123-456-7890',
  emergencyContact: 'Jane Doe',
  createdAt: ISO_STRING
}));

// User Role
localStorage.setItem('userRole', 'patient'); // or 'caregiver'

// Reminders List
localStorage.setItem('reminders', JSON.stringify([
  {
    id: TIMESTAMP,
    name: 'Take Medicine',
    time: '09:00',
    description: 'Take daily medication',
    completed: false,
    createdAt: ISO_STRING
  }
]));

// Game Score
localStorage.setItem('gameScore', '150');
```

## Routing

Routes are defined in `App.js`:
```javascript
<Route path="/" element={<WelcomePage />} />
<Route path="/role-selection" element={<RoleSelectionPage setRole={setRole} />} />
<Route path="/patient-setup" element={<PatientSetupPage setPatient={setPatient} />} />
<Route path="/dashboard" element={<PatientDashboard patient={patient} />} />
<Route path="/game" element={<GameScreen patient={patient} />} />
<Route path="/reminders" element={<ReminderScreen patient={patient} />} />
<Route path="/voice-assistant" element={<VoiceAssistantScreen patient={patient} />} />
<Route path="/face-login" element={<FaceLoginScreen />} />
<Route path="/emergency" element={<EmergencyCallScreen patient={patient} />} />
<Route path="/profile" element={<ProfileScreen patient={patient} setPatient={setPatient} />} />
```

## CSS Variables

Defined in `src/styles/App.css`:
```css
:root {
  /* Colors */
  --primary-color: #2E7D32;
  --secondary-color: #0097A7;
  --accent-color: #FF6F00;
  
  /* Spacing */
  --spacing-xs: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  
  /* Typography */
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-3xl: 40px;
  
  /* Transitions */
  --transition-normal: 300ms ease-in-out;
  
  /* Border Radius */
  --border-radius-md: 16px;
}
```

## Adding a New Page

1. **Create Component**
   ```bash
   touch src/pages/NewPage.js
   ```

2. **Create Styles**
   ```bash
   touch src/styles/NewPage.css
   ```

3. **Add Route in App.js**
   ```javascript
   <Route path="/new-page" element={<NewPage patient={patient} />} />
   ```

4. **Import in Navigation** (if needed)
   ```javascript
   <button onClick={() => navigate('/new-page')}>New Page</button>
   ```

## Styling Guidelines

### Accessibility First
- Minimum font size: 16px
- Minimum button size: 48x48px
- Color contrast ratio: 4.5:1 (WCAG AA)
- Clear focus indicators

### Mobile Responsive
```css
/* Mobile First */
.component { /* ... */ }

/* Tablet */
@media (min-width: 768px) { /* ... */ }

/* Desktop */
@media (min-width: 1024px) { /* ... */ }
```

### Animations
```css
/* Use GPU-accelerated properties */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

## Form Validation

Pattern used in `PatientSetupPage.js`:
```javascript
const validateForm = () => {
  const errors = {};
  if (!formData.name) errors.name = 'Name is required';
  if (formData.age < 1 || formData.age > 150) errors.age = 'Invalid age';
  return errors;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const errors = validateForm();
  if (Object.keys(errors).length === 0) {
    // Save data
  } else {
    setErrors(errors);
  }
};
```

## Data Persistence

### Reading from LocalStorage
```javascript
useEffect(() => {
  const savedData = localStorage.getItem('key');
  if (savedData) {
    setData(JSON.parse(savedData));
  }
}, []);
```

### Writing to LocalStorage
```javascript
const updateData = (newData) => {
  localStorage.setItem('key', JSON.stringify(newData));
};
```

## Common Patterns

### Navigation Hook
```javascript
const navigate = useNavigate();
navigate('/path');
navigate(-1); // Go back
```

### Conditional Rendering
```javascript
{patient ? (
  <Dashboard patient={patient} />
) : (
  <Navigate to="/patient-setup" />
)}
```

### Event Handlers
```javascript
const handleChange = (e) => {
  const { name, value } = e.target;
  setState(prev => ({ ...prev, [name]: value }));
};
```

## Performance Optimization

### Code Splitting (Ready)
```javascript
const GameScreen = React.lazy(() => import('./pages/GameScreen'));
```

### Memoization
```javascript
const MemoComponent = React.memo(Component);
```

### useCallback for Event Handlers
```javascript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

## Testing

### Manual Testing Checklist
- [ ] Test on mobile (< 480px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (> 1024px)
- [ ] Test keyboard navigation
- [ ] Test screen reader
- [ ] Test with reduced motion enabled
- [ ] Test color contrast
- [ ] Test touch targets (48px minimum)

### Browser Testing
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile Chrome, Mobile Firefox, Safari iOS

## Debugging

### Console Logging
```javascript
console.log('Component mounted', { patient });
console.warn('Warning message');
console.error('Error occurred', error);
```

### React DevTools
- Install React Developer Tools extension
- Inspect component state and props
- Track re-renders

### LocalStorage Inspection
```javascript
// Browser console
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

## Integration Points

### Reminder Engine (API)
Replace localStorage in `ReminderScreen.js`:
```javascript
// From:
const savedReminders = localStorage.getItem('reminders');

// To:
const fetchReminders = async () => {
  const response = await fetch('/api/reminders');
  setReminders(await response.json());
};
```

### Voice Assistant (Whisper)
Replace simulation in `VoiceAssistantScreen.js`:
```javascript
// Integrate Web Speech API or Whisper
const recognition = new webkitSpeechRecognition();
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setRecognizedText(transcript);
};
```

### Face Login (MobileFaceNet)
Replace simulation in `FaceLoginScreen.js`:
```javascript
// Integrate face detection library
import * as tf from '@tensorflow/js';
import * as faceLandmarksDetection from '@tensorflow-models/coco-ssd';
```

## Build and Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create `.env.production.local`:
```
REACT_APP_API_URL=https://api.production.com
REACT_APP_ENABLE_ANALYTICS=true
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=build
```

## Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Happy developing! 🚀**
