import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { requestNotificationPermission, registerServiceWorker } from './services/pwa';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  registerServiceWorker();
  requestNotificationPermission();
}
