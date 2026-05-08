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

// 🔴 سیستەمی دژە-کراش (وەرگیراو لە دەرمانزانی) بۆ ڕێگریکردن لە شاشەی سپی
class AppErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, errorMsg: string, errorStack: string}> {
  state = { hasError: false, errorMsg: '', errorStack: '' };
  static getDerivedStateFromError(error: any) { return { hasError: true, errorMsg: error.toString(), errorStack: error.stack || '' }; }
  componentDidCatch(error: any) { console.error("App Global Error:", error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="text-rose-500 mb-4">
             <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h1 className="text-xl font-black text-slate-800 mb-2">هەڵەیەک ڕوویدا!</h1>
          <p className="text-sm text-slate-500 font-bold mb-4">تکایە وێنەی ئەم هەڵەیە بنێرە بۆم بۆ ئەوەی چاکی بکەم:</p>
          <div className="w-full bg-white p-4 rounded-xl border border-rose-200 shadow-sm text-left dir-ltr overflow-auto max-h-48 mb-6">
              <p className="text-rose-600 font-bold text-xs mb-2 border-b border-rose-100 pb-2">{this.state.errorMsg}</p>
              <pre className="text-[10px] text-slate-500 font-mono whitespace-pre-wrap">{this.state.errorStack}</pre>
          </div>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold active:scale-95 transition-transform">نوێکردنەوەی پەڕە</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const THEMES: any = {
  orange: { main: 'bg-orange-500', hover: 'bg-orange-600', text: 'text-orange-500', light: 'bg-orange-50', border: 'border-orange-200', grad: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-200' },
  blue: { main: 'bg-blue-600', hover: 'bg-blue-700', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', grad: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-200' },
  emerald: { main: 'bg-emerald-600', hover: 'bg-emerald-700', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', grad: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-200' },
  purple: { main: 'bg-purple-600', hover: 'bg-purple-700', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', grad: 'from-purple-600 to-fuchsia-600', shadow: 'shadow-purple-200' },
  rose: { main: 'bg-rose-600', hover: 'bg-rose-700', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200', grad: 'from-rose-600 to-pink-600', shadow: 'shadow-rose-200' },
  slate: { main: 'bg-slate-800', hover: 'bg-slate-900', text: 'text-slate-800', light: 'bg-slate-100', border: 'border-slate-300', grad: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-300' }
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentTheme = THEMES[settings?.siteTheme || 'orange'] || THEMES.orange;
  const isUserAdmin = user?.user?.isAdmin || user?.isAdmin;

  return (
    <BrowserRouter>
      {/* 🌟 ئەپ مانیجەرە زیرەکەکە کە بەسەر هەموو سایتەکەدا زاڵە 🌟 */}
      <AppManager />

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