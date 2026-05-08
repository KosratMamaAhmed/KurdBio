import React, { useState, useEffect, Component, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Admin from './pages/Admin';
import Payment from './pages/Payment';

// 🌟 هێنانی AppManagerە یەکگرتووە زیرەکەکە 🌟
import AppManager from './components/AppManager'; 

// 🔴 سیستەمی دژە-کراش بە پشتگیری تەواوی دارک مۆد
class AppErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, errorMsg: string, errorStack: string}> {
  state = { hasError: false, errorMsg: '', errorStack: '' };
  static getDerivedStateFromError(error: any) { return { hasError: true, errorMsg: error.toString(), errorStack: error.stack || '' }; }
  componentDidCatch(error: any) { console.error("App Global Error:", error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-neutral-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="text-rose-500 mb-4 bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white mb-2">هەڵەیەک ڕوویدا!</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-4">تکایە وێنەی ئەم هەڵەیە بنێرە بۆم بۆ ئەوەی چاکی بکەم:</p>
          <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 shadow-sm text-left dir-ltr overflow-auto max-h-48 mb-6">
              <p className="text-rose-600 dark:text-rose-400 font-bold text-xs mb-2 border-b border-rose-100 dark:border-rose-900/50 pb-2">{this.state.errorMsg}</p>
              <pre className="text-[10px] text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap">{this.state.errorStack}</pre>
          </div>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-orange-500/30">نوێکردنەوەی پەڕە</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const THEMES: any = {
  orange: { main: 'bg-orange-500', hover: 'bg-orange-600', text: 'text-orange-500', light: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-500/30', grad: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-200 dark:shadow-none' },
  blue: { main: 'bg-blue-600', hover: 'bg-blue-700', text: 'text-blue-600', light: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-500/30', grad: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-200 dark:shadow-none' },
  emerald: { main: 'bg-emerald-600', hover: 'bg-emerald-700', text: 'text-emerald-600', light: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-500/30', grad: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-200 dark:shadow-none' },
  purple: { main: 'bg-purple-600', hover: 'bg-purple-700', text: 'text-purple-600', light: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-500/30', grad: 'from-purple-600 to-fuchsia-600', shadow: 'shadow-purple-200 dark:shadow-none' },
  rose: { main: 'bg-rose-600', hover: 'bg-rose-700', text: 'text-rose-600', light: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-500/30', grad: 'from-rose-600 to-pink-600', shadow: 'shadow-rose-200 dark:shadow-none' },
  slate: { main: 'bg-slate-800 dark:bg-slate-700', hover: 'bg-slate-900 dark:hover:bg-slate-600', text: 'text-slate-800 dark:text-slate-300', light: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700', grad: 'from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800', shadow: 'shadow-slate-300 dark:shadow-none' }
};

function ProfileOrApk({ settings }: { settings: any }) {
  const { slug } = useParams();

  if (slug?.endsWith('.apk')) {
    window.location.href = '/';
    return null;
  }

  return <PublicProfile settings={settings} />;
}

function MainApp() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🌟 کۆنترۆڵی زیرەکی ڕەنگی Status Bar بەپێی دارک مۆدی سیستەم 🌟
  useEffect(() => {
    const updateThemeColor = () => {
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDarkMode ? '#0f172a' : '#f8fafc'); // ڕەنگەکانی Tailwind (slate-900 و slate-50)
      } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = isDarkMode ? '#0f172a' : '#f8fafc';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    };

    updateThemeColor();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeColor);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateThemeColor);
    };
  }, []);

  useEffect(() => {
    if (window.location.pathname === '/vip' || window.location.pathname === '/vip/') {
      window.location.href = '/vip.html';
      return;
    }

    const savedUser = localStorage.getItem('biokurd_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const cacheKey = 'biokurd_settings_cache';
    const cachedSettings = localStorage.getItem(cacheKey);
    if (cachedSettings) {
      setSettings(JSON.parse(cachedSettings));
    }

    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('biokurd_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('biokurd_user');
    window.location.href = '/auth';
  };

  if (loading && !settings) {
    return (
      <div className="min-h-[100dvh] bg-neutral-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-orange-500 dark:border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentTheme = THEMES[settings?.siteTheme || 'orange'] || THEMES.orange;
  const isUserAdmin = user?.user?.isAdmin || user?.isAdmin;

  return (
    <BrowserRouter>
      {/* 🌟 ئەپ مانیجەرە زیرەکەکە کە بەسەر هەموو سایتەکەدا زاڵە 🌟 */}
      <AppManager />

      {/* 🌟 Wrapper ی Safe Area بۆ ئەوەی ناوەڕۆک نەچێتە ژێر کامێرا 🌟 */}
      <div className="flex flex-col min-h-[100dvh] w-full bg-[#f8fafc] dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-[env(safe-area-inset-bottom)]">
        <Routes>
          <Route path="/" element={<Home user={user} theme={currentTheme} settings={settings} />} />
          
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} theme={currentTheme} />} 
          />
          
          <Route path="/login" element={<Navigate to="/auth" />} />

          <Route 
            path="/dashboard" 
            element={
              user ? (
                isUserAdmin ? (
                  <Admin user={user} onLogout={handleLogout} theme={currentTheme} />
                ) : (
                  <Dashboard user={user} onLogout={handleLogout} theme={currentTheme} settings={settings} />
                )
              ) : (
                <Navigate to="/auth" />
              )
            } 
          />

          <Route 
            path="/payment" 
            element={user ? <Payment theme={currentTheme} /> : <Navigate to="/auth" />} 
          />

          <Route path="/:slug" element={<ProfileOrApk settings={settings} />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// 🔴 لێرەدا کۆدەکە دەبەسترێتەوە بە سیستەمی دژە-کراشەکە
export default function App() {
  return (
    <AppErrorBoundary>
      <MainApp />
    </AppErrorBoundary>
  );
}