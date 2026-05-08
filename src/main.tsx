import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// هێنانی سیستەمی ئۆفلاین و ئەپدەیت لە ڤایت PWA
import { registerSW } from 'virtual:pwa-register';

// دروستکردنی پەیوەندی زیرەک لەنێوان React و فایلی index.html
const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('app-update-available', { detail: updateSW }));
  },
  onOfflineReady() {
    console.log('BioKurd is ready for offline use!');
  },
});

// فێڵی چارەسەری ئایفۆن و ئەندرۆید لەسەر هۆم سکرین (ڕێگری لە کۆنبوونی داتا)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.update();
      });
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);