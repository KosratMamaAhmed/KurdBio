import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react'; 

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Admin from './pages/Admin';
import Payment from './pages/Payment';
// 🌟 هێنانی کۆمپۆنێنتە زیرەکەکە
import AppPromptModal from './components/AppPromptModal'; 

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
  const [apkStatus, setApkStatus] = useState<'loading' | 'error' | null>(null);

  useEffect(() => {
    if (slug?.endsWith('.apk')) {
      setApkStatus('loading');
      const fileUrl = `/${slug}`;
      
      fetch(fileUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', slug);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            setApkStatus('error');
          }
        })
        .catch(() => {
          setApkStatus('error');
        });
    }
  }, [slug]);

  if (slug?.endsWith('.apk')) {
    if (apkStatus === 'error') {
      return (
        <div className="min-h-[100dvh] w-full bg-gradient-to-br from-neutral-950 to-black flex flex-col items-center justify-center text-center p-6" dir="rtl">
          <div className="bg-red-500/10 p-5 rounded-full mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertCircle className="text-red-500 w-12 h-12" />
          </div>
          <h2 className="text-white font-black text-2xl mb-4 tracking-wide">بەرنامەکە نەدۆزرایەوە!</h2>
          <p className="text-red-400 font-bold text-base max-w-sm leading-relaxed bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
            ئەم ئەپڵیکەیشنە نەدۆزرایەوە یان سڕاوەتەوە. دڵنیابە لە ناوی لینکەکە.
          </p>
          <button onClick={() => window.location.href = '/'} className="mt-8 px-8 py-3.5 bg-white text-black font-black rounded-xl hover:scale-105 transition-all shadow-lg">
            گەڕانەوە بۆ سەرەتا
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-[100dvh] w-full bg-gradient-to-br from-neutral-950 to-black flex flex-col items-center justify-center text-center p-6" dir="rtl">
        <div className="relative mb-6">
           <div className="w-16 h-16 border-4 border-amber-500/30 rounded-full absolute inset-0"></div>
           <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
        </div>
        <h2 className="text-white font-black text-2xl mb-2 tracking-wide">لە داگرتنی بەرنامەکەداین...</h2>
        <p className="text-neutral-400 font-bold text-sm max-w-sm">
           تکایە چاوەڕێبە، فایلەکە بەشێوەیەکی خێرا دادەبەزێتە ناو ئامێرەکەت.
        </p>
      </div>
    );
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
      {/* 🌟 دانانی کۆمپۆنێنتی داگرتنی ئەپەکە لێرە بۆ ئەوەی بەسەر هەموو سایتەکەدا زاڵ بێت 🌟 */}
      {/* تێبینی: دەتوانیت ناوی .apk ـەکە لێرەدا بگۆڕیت بەوی خۆت */}
      <AppPromptModal apkUrl="/biokurd.apk" />

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