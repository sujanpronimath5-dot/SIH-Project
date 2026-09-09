# Quick Start Guide

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

The application will automatically open at `http://localhost:3000`

### 3. Explore the Application

**First Time Users:**
1. Click "Get Started" on the welcome page
2. Select "Patient" role
3. Fill in your profile information
4. Start exploring the dashboard!

**Test Accounts:**
- No login required - the app uses local storage
- Data persists in your browser

### 4. Try the Features

#### Memory Game
- Navigate to the Game section
- Click cards to find matching pairs
- Your score increases with each match

#### Reminders
- Go to Reminders
- Click "Add New Reminder"
- Set time and description
- Mark complete when done

#### Dashboard
- View all features from the main dashboard
- Each card represents a different feature
- Swipe or click to navigate

### 5. Build for Production
```bash
npm run build
```
Creates an optimized production build in the `build/` folder.

## Common Tasks

### Clear All Data
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

### Change Port
```bash
npm start -- --port 3001
```

### Stop Development Server
Press `Ctrl+C` in the terminal

## Testing Different Roles

1. Complete Patient Setup
2. Sign Out (Profile → Sign Out)
3. Start fresh to test Caregiver role

## Feature Availability

✅ **Fully Implemented**
- Patient Dashboard
- Profile Management
- Reminder System
- Memory Game
- Emergency Call Interface
- Face Login Simulation
- Voice Assistant Simulation
- Bottom Navigation

🔄 **Ready for Integration**
- Reminder Engine (API)
- Voice Recognition (Whisper)
- Face Detection (MobileFaceNet)
- Emergency Dispatch
- Analytics

## Troubleshooting

**App won't start?**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

**Port 3000 already in use?**
```bash
npm start -- --port 3001
```

**Data not persisting?**
- Check browser privacy settings
- Try incognito/private mode
- Check browser console for errors

**Styling looks broken?**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)

## Next Steps

1. Read [README.md](./README.md) for full documentation
2. Review [Development Guide](./DEVELOPMENT.md)
3. Explore individual page components
4. Customize colors in `src/styles/App.css`

## Support

For issues or questions:
1. Check browser console for error messages
2. Review the component files
3. Check network tab for API errors (when integrated)

---

**Happy coding! 🎉**
