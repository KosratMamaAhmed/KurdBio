import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, ShieldCheck, Play, Send } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';

interface Props { user: any; settings: any; theme: any; }

// 🌟 بەکارهێنانی ئایکۆنە ئۆرجیناڵەکان (بێ imageUrl) بۆ ئەوەی هەڵە نەکات 🌟
const MOCKUP_DATA_SAMPLES = [
  { title: 'ئینستاگرام', iconName: 'Instagram', url: 'instagram.com', color: '#E4405F', textColor: '#FFFFFF' },
  { title: 'تیکتۆک', iconName: 'Music', url: 'tiktok.com', color: '#000000', textColor: '#FFFFFF' },
  { title: 'سناپچات', iconName: 'Ghost', url: 'snapchat.com', color: '#FFFC00', textColor: '#000000' }, // ڕەنگی نووسین ڕەش کرا
  { title: 'واتسئاپ', iconName: 'MessageCircle', url: 'wa.me', color: '#25D366', textColor: '#FFFFFF' },
  { title: 'تێلیگرام', iconName: 'Send', url: 't.me', color: '#26A5E4', textColor: '#FFFFFF' },
  { title: 'یوتیوب', iconName: 'Youtube', url: 'youtube.com', color: '#FF0000', textColor: '#FFFFFF' },
  { title: 'پلەی ستۆر', iconName: 'Play', url: 'play.google.com', color: '#00D859', textColor: '#FFFFFF' },
  { title: 'ڤایبەر', iconName: 'Phone', url: 'viber://', color: '#7360F2', textColor: '#FFFFFF' }
];

export default function Home({ user, settings, theme }: Props) {
  const [mockup, setMockup] = useState(settings?.mockup || { 
    name: 'کۆسرەت مامە', 
    bio: 'گەشەپێدەری بەرنامەکانی ئەندرۆید و وێب', 
    avatar: 'https://ui-avatars.com/api/?name=Kosrat+Mama&background=f97316&color=fff&size=256', 
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    buttonDesign: 'glass',
    isPro: true
  });

  useEffect(() => { 
    if (settings?.mockup) setMockup(settings.mockup); 
  }, [settings]);

  return (
    // 🌟 سکرۆڵی خێرا بۆ پەڕەکە + فۆنتی Noto Sans Arabic 🌟
    <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col font-sans overflow-y-auto overflow-x-hidden relative selection:bg-orange-200 scrollbar-hide pb-[120px]" dir="rtl" style={{ fontFamily: '"Noto Sans Arabic", sans-serif', WebkitOverflowScrolling: 'touch' }}>
      
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[50%] bg-gradient-to-b from-orange-300/30 to-transparent rounded-full blur-[120px]"></div>
         <div className="absolute top-[30%] -left-[10%] w-[50%] h-[60%] bg-gradient-to-t from-blue-400/20 to-transparent rounded-full blur-[120px]"></div>
      </div>

      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ${theme?.main || 'bg-orange-500'}`}>B</div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900 hidden sm:block">BioKurd</span>
        </div>
        <div className="flex gap-3">
          <Link to={user ? "/dashboard" : "/auth"} className={`px-6 py-2.5 rounded-full font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95 ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>
            {user ? 'داشبۆرد' : 'دەستپێکردن'}
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 gap-10 lg:gap-16 relative z-10 my-auto py-8">
        
        <div className="flex-1 text-center lg:text-right space-y-8 w-full">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-orange-200 text-orange-600 font-bold text-sm shadow-sm mx-auto lg:mx-0 hover:scale-105 transition-transform cursor-default">
            <Sparkles size={18} className="animate-pulse" /> <span>باشترین شێوازی پرۆفایلی دیجیتاڵی</span>
          </div>
          
          {/* 🌟 دیزاینی نووسینەکان ڕەنگاوڕەنگتر و سەرنجڕاکێشتر کران 🌟 */}
          <h1 className="text-[3rem] sm:text-[4rem] lg:text-[5rem] font-black text-neutral-900 leading-[1.1] tracking-tight">
            کۆتایی بە <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500 relative inline-block drop-shadow-sm pb-2">
              لینکە زۆرەکان
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-amber-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
            </span> بهێنە
          </h1>
          
          <p className="text-lg sm:text-xl text-neutral-500 font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
            هەموو تۆڕە کۆمەڵایەتییەکان، کارەکانت و زانیارییەکانت لە یەک شوێنی ناوازەدا کۆبکەرەوە و با هەمووان بە ئاسانی بتبینن.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/auth" className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-white rounded-2xl font-black text-lg hover:-translate-y-1 transition-all shadow-[0_8px_25px_rgba(249,115,22,0.4)] ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>
              هەژمارت دروست بکە <ArrowLeft size={22} strokeWidth={3} className="animate-bounce-x" />
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-neutral-400 font-bold text-sm">
            <div className="flex items-center gap-2"><Zap size={18} className="text-amber-500"/> خێرا</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500"/> پارێزراو</div>
            <div className="flex items-center gap-2"><Sparkles size={18} className="text-blue-500"/> ناوازە</div>
          </div>
        </div>

        {/* 🌟 سکرۆڵی ناو مۆکئەپ ڕاگیرا بە pointer-events-none و select-none 🌟 */}
        <div className="shrink-0 relative z-10 flex justify-center w-full lg:w-auto transform scale-[0.85] sm:scale-[0.95] lg:scale-[1] origin-top lg:origin-center mt-10 lg:mt-0 pointer-events-none select-none">
           <PhoneMockup mockup={mockup} mockupLinks={MOCKUP_DATA_SAMPLES} isPublic={false} />
        </div>
        
      </main>

      {/* 🌟 دوگمەکانی تەلەگرام و پلەی ستۆر خرانە خوار خوارەوەی شاشەکە 🌟 */}
      <div className="fixed bottom-0 left-0 w-full p-4 sm:p-6 z-40 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-transparent pointer-events-none flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 backdrop-blur-[2px]">
        <a href="https://play.google.com/store/apps/dev?id=6744749568381312149" target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3 overflow-hidden group border border-emerald-400/50">
           <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
           <Play size={20} fill="currentColor" className="drop-shadow-md" />
           <span className="text-sm tracking-wide drop-shadow-md">بەرنامەکانم لە پلەی ستۆر</span>
        </a>
        
        <a href="http://t.me/kosratdev" target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-2xl font-black shadow-[0_8px_20px_rgba(56,189,248,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-3 overflow-hidden group border border-blue-400/50">
           <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
           <Send size={20} className="drop-shadow-md" />
           <span className="text-sm tracking-wide drop-shadow-md">ئێمە لە تەلەگرام</span>
        </a>
      </div>

    </div>
  );
}