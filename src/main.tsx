import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// هێنانی سیستەمی ئۆفلاین و ئەپدەیت لە ڤایت PWA
import { registerSW } from 'virtual:pwa-register';

// دروستکردنی پەیوەندی زیرەک لەنێوان React و فایلی index.html
const updateSW = registerSW({
  onNeedRefresh() {
    // ناردنی ئیڤێنتێک بۆ index.html بۆ ئەوەی دیزاینە تایبەتەکەی ئەپدەیت دەربخات
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
        // پشکنینی خێرا بۆ ئەپدەیت کاتێک ئەپەکە دەکرێتەوە
        registration.update().catch(() => console.log('Offline/No update available'));
      });
    }
  }
});

// 🚀 لابردنی شاشەی لۆدینگە خاوەکە ڕاستەوخۆ پێش ئەوەی ڕیئاکت دەست پێ بکات
const splashScreen = document.getElementById('initial-splash');
if (splashScreen) {
  // بە نەرمی لایدەبەین بۆ ئەوەی فلاش نەکات
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 300);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}