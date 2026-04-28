import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup'; // 🔴 هێنانە ناوەوەی مۆکئەپەکە

interface Props { user: any; settings: any; theme: any; }

export default function Home({ user, settings, theme }: Props) {
  const [mockup, setMockup] = useState(settings?.mockup || { name: 'کۆسرەت مامە', bio: 'شارەزا لە تەکنەلۆژیا', avatar: '/social/admin.png' });

  useEffect(() => { if (settings?.mockup) setMockup(settings.mockup); }, [settings]);

  const mockupLinks = [
    { name: 'فەیسبووک', icon: '/social/facebook.png', bg: 'bg-[#1877F2]', border: 'border-white/20', text: 'text-white' },
    { name: 'ئینستاگرام', icon: '/social/instagram.png', bg: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040]', border: 'border-white/20', text: 'text-white' },
    { name: 'تیکتۆک', icon: '/social/tiktok.png', bg: 'bg-black', border: 'border-white/20', text: 'text-white' },
    { name: 'سناپچات', icon: '/social/snapchat.svg', bg: 'bg-[#FFFC00]', border: 'border-black/10', text: 'text-black' },
    { name: 'واتساپ', icon: '/social/whatsapp.png', bg: 'bg-[#25D366]', border: 'border-white/20', text: 'text-white' },
  ];

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col font-sans overflow-hidden relative selection:bg-orange-200" dir="rtl">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@700&display=swap');`}</style>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none transform-gpu z-0">
         <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[60%] bg-gradient-to-b from-orange-100 to-transparent rounded-full blur-3xl opacity-60"></div>
         <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-t from-blue-50 to-transparent rounded-full blur-3xl opacity-60"></div>
      </div>

      <nav className="max-w-7xl mx-auto w-full px-6 sm:px-8 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ${theme?.main || 'bg-orange-500'}`}>B</div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900 hidden sm:block">BioKurd</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? <Link to="/dashboard" className="font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 transition-colors">داشبۆرد</Link> : <Link to="/auth" className="font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 transition-colors hidden sm:block">چوونەژوورەوە</Link>}
          <Link to={user ? "/dashboard" : "/auth"} className={`px-6 py-2.5 rounded-full font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all transform-gpu ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>دەستپێکردن</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 py-10 lg:py-0 gap-16 relative z-10">
        
        <div className="flex-1 text-center lg:text-right space-y-8 relative z-10 w-full mt-4 lg:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold text-sm shadow-sm mx-auto lg:mx-0">
            <Sparkles size={16} /> <span>نوێترین شێوازی پرۆفایلی دیجیتاڵی</span>
          </div>
          
          <h1 className="text-[2.75rem] sm:text-6xl lg:text-[75px] font-black text-neutral-900 leading-[1.1] tracking-tight">
            کۆتایی بە <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-600 to-amber-500 relative inline-block">لینکە زۆرەکان <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg></span> بهێنە
          </h1>
          
          <p className="text-lg sm:text-xl text-neutral-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            هەموو تۆڕە کۆمەڵایەتییەکان، کارەکانت و زانیارییەکانت لە یەک شوێنی ناوازەدا کۆبکەرەوە و با هەمووان بە ئاسانی بتبینن.
          </p>
          
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/auth" className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-5 text-white rounded-full font-black text-lg hover:-translate-y-1 active:scale-95 transition-all shadow-[0_8px_25px_rgba(249,115,22,0.3)] transform-gpu ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>هەژمارت دروست بکە <ArrowLeft size={22} strokeWidth={3} /></Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-neutral-400 font-bold text-sm">
            <div className="flex items-center gap-2"><Zap size={18} className="text-amber-500"/> خێرا</div><div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500"/> پارێزراو</div><div className="flex items-center gap-2"><Sparkles size={18} className="text-blue-500"/> ناوازە</div>
          </div>
        </div>

        {/* 🔴 بانگکردنی فایلە نوێیەکەی مۆکئەپ */}
        <PhoneMockup mockup={mockup} mockupLinks={mockupLinks} />
        
      </main>
    </div>
  );
}