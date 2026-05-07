import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Admin from './pages/Admin';
import Payment from './pages/Payment';

// 🌟 هێنانی AppManagerە یەکگرتووە زیرەکەکە 🌟
import AppManager from './components/AppManager'; 

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

  // ئەگەر کەسێک ویستی .apk دابگرێت دەیباتەوە سەرەتا، چونکە چیتر باسی APK نەماوە
  if (slug?.endsWith('.apk')) {
    window.location.href = '/';
    return null;
  }

  return <PublicProfile settings={settings} />;
}

function App() {
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

export default App;