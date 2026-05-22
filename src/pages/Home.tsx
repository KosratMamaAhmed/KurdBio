import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';

interface Props { user: any; settings: any; theme: any; }

const MOCKUP_DATA_SAMPLES = [
  { title: 'ئینستاگرام', imageUrl: '/social/instagram.png', url: 'instagram.com', color: '#E4405F', textColor: '#FFFFFF' },
  { title: 'تیکتۆک', imageUrl: '/social/tiktok.png', url: 'tiktok.com', color: '#000000', textColor: '#FFFFFF' },
  { title: 'سناپچات', imageUrl: '/social/snapchat.png', url: 'snapchat.com', color: '#FFFC00', textColor: '#FFFFFF' },
  { title: 'واتسئاپ', imageUrl: '/social/whatsapp.png', url: 'wa.me', color: '#25D366', textColor: '#FFFFFF' },
  { title: 'تێلیگرام', imageUrl: '/social/telegram.png', url: 't.me', color: '#26A5E4', textColor: '#FFFFFF' },
  { title: 'فەیسبووک', imageUrl: '/social/facebook.png', url: 'facebook.com', color: '#1877F2', textColor: '#FFFFFF' },
  { title: 'پلەی ستۆر', imageUrl: '/social/playstore.png', url: 'play.google.com', color: '#00D859', textColor: '#FFFFFF' },
  { title: 'دەرمانزانی', imageUrl: '/social/darman.png', url: 'play.google.com', color: '#ef4444', textColor: '#FFFFFF' }
];

// 🌟 زیادکردنی فۆنتی تایبەتی خۆت و ئەنیمەیشنی جوانی دوگمەکان 🌟
const FontStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @font-face {
      font-family: 'Kosrat';
      src: url('/font/kosrat.ttf') format('truetype');
      font-display: swap;
    }
    .font-kosrat { 
      font-family: 'Kosrat', 'Noto Sans Arabic', sans-serif !important; 
    }
    @keyframes gradient-x {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-x {
      animation: gradient-x 3s ease infinite;
      background-size: 200% 200%;
    }
  `}} />
);

export default function Home({ user, settings, theme }: Props) {
  const [mockup, setMockup] = useState(settings?.mockup || { 
    name: 'کۆسرەت مامە', 
    bio: 'گەشەپێدەری بەرنامەکانی ئەندرۆید و وێب', 
    avatar: '/social/kosrat.png', 
    bgImage: '/social/kosratmama.png',
    buttonDesign: 'glass',
    isPro: true
  });

  useEffect(() => { 
    if (settings?.mockup) setMockup(settings.mockup); 
  }, [settings]);

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col overflow-y-auto overflow-x-hidden relative selection:bg-orange-200 scrollbar-hide font-kosrat" dir="rtl" style={{ WebkitOverflowScrolling: 'touch' }}>
      
      <FontStyle />

      {/* باکگراوندی ڕەنگاوڕەنگ و جوان */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[50%] bg-gradient-to-b from-orange-300/30 to-transparent rounded-full blur-[120px]"></div>
         <div className="absolute top-[30%] -left-[10%] w-[50%] h-[60%] bg-gradient-to-t from-blue-400/20 to-transparent rounded-full blur-[120px]"></div>
      </div>

      <nav className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between relative z-20 shrink-0" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)', paddingBottom: '1.5rem' }}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white font-black text-2xl shadow-lg ${theme?.main || 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>B</div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900 hidden sm:block">BioKurd</span>
        </div>
        
        {/* 🌟 دوگمەی چوونە ژوورەوە یان داشبۆرد بە دیزاینێکی قەشەنگ 🌟 */}
        <div className="flex gap-3">
          <Link to={user ? "/dashboard" : "/auth"} className={`relative overflow-hidden px-7 py-3 rounded-full font-black text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center group ${theme?.main || 'bg-gradient-to-r from-orange-500 to-amber-500'}`}>
            <span className="relative z-10 text-sm sm:text-base">{user ? 'داشبۆرد' : 'چوونە ژوورەوە'}</span>
            <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out z-0"></div>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 gap-12 lg:gap-24 relative z-10 my-auto py-8 lg:py-16 mb-8 lg:mb-16">
        
        <div className="flex-1 text-center lg:text-right space-y-6 sm:space-y-8 w-full mt-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-orange-200 text-orange-600 font-bold text-sm shadow-sm mx-auto lg:mx-0 hover:scale-105 transition-transform cursor-default">
            <Sparkles size={18} className="animate-pulse" /> <span>باشترین شێوازی پرۆفایلی دیجیتاڵی</span>
          </div>
          
          <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-black text-neutral-900 leading-[1.2] lg:leading-[1.1] tracking-tight">
            کۆتایی بە <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500 relative inline-block drop-shadow-sm pb-2">
              لینکە زۆرەکان
              <svg className="absolute w-full h-3 sm:h-4 -bottom-1 left-0 text-amber-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
            </span> بهێنە
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-neutral-500 font-bold leading-relaxed max-w-lg lg:max-w-xl mx-auto lg:mx-0">
            هەموو تۆڕە کۆمەڵایەتییەکان، کارەکانت و زانیارییەکانت لە یەک شوێنی ناوازەدا کۆبکەرەوە و با هەمووان بە ئاسانی بتبینن.
          </p>
          
          {/* 🌟 دوگمەی خۆتۆمارکردن بە ئیفێکتی ئەنیمەیشنی جوڵاو 🌟 */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/auth" className={`relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-white rounded-[2rem] font-black text-lg hover:-translate-y-1 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.4)] group ${theme?.main || 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-x'}`}>
              <span className="relative z-10 flex items-center gap-3">
                هەژمارت دروست بکە <ArrowLeft size={24} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out z-0"></div>
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-6 text-neutral-400 font-bold text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2"><Zap size={18} className="text-amber-500"/> خێرا</div>
            <div className="flex items-center gap-1.5 sm:gap-2"><ShieldCheck size={18} className="text-emerald-500"/> پارێزراو</div>
            <div className="flex items-center gap-1.5 sm:gap-2"><Sparkles size={18} className="text-blue-500"/> ناوازە</div>
          </div>
        </div>

        {/* مۆکئەپی مۆبایل */}
        <div className="shrink-0 relative z-10 flex justify-center w-full lg:w-auto transform scale-[1.05] sm:scale-[1.15] xl:scale-[1.30] origin-top lg:origin-center mt-12 sm:mt-16 lg:mt-0 pointer-events-none select-none">
           <PhoneMockup mockup={mockup} mockupLinks={MOCKUP_DATA_SAMPLES} isPublic={false} />
        </div>
        
      </main>

      {/* 🌟 ئایکۆنەکانی خوارەوە بەبێ لێواری سپی (Floating Icons) 🌟 */}
      <footer className="w-full pb-8 pt-16 flex flex-row flex-wrap items-center justify-center gap-5 sm:gap-8 z-10 relative mt-auto px-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}>
        
        {/* Play Store */}
        <a href="https://play.google.com/store/apps/dev?id=6744749568381312149" target="_blank" rel="noopener noreferrer" className="w-14 h-14 sm:w-16 sm:h-16 hover:-translate-y-1.5 hover:scale-110 transition-all flex items-center justify-center group" title="پلەی ستۆر">
            <img src="/social/playstore.png" alt="Play Store" className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all" loading="lazy" decoding="async" />
        </a>
        
        {/* Telegram */}
        <a href="http://t.me/kosratdev" target="_blank" rel="noopener noreferrer" className="w-14 h-14 sm:w-16 sm:h-16 hover:-translate-y-1.5 hover:scale-110 transition-all flex items-center justify-center group" title="تێلیگرام">
            <img src="/social/telegram.png" alt="Telegram" className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all" loading="lazy" decoding="async" />
        </a>

        {/* Darmanzany */}
        <a href="https://play.google.com/store/apps/details?id=com.nmadev.darmanzany&hl=en" target="_blank" rel="noopener noreferrer" className="w-14 h-14 sm:w-16 sm:h-16 hover:-translate-y-1.5 hover:scale-110 transition-all flex items-center justify-center group" title="دەرمانزانی">
            <img src="/social/darman.png" alt="Darmanzany" className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all" loading="lazy" decoding="async" />
        </a>

        {/* Kosrat Drug */}
        <a href="https://play.google.com/store/apps/details?id=com.NmaDev.Kdrugs&hl=en" target="_blank" rel="noopener noreferrer" className="w-14 h-14 sm:w-16 sm:h-16 hover:-translate-y-1.5 hover:scale-110 transition-all flex items-center justify-center group" title="Kosrat Drugs">
            <img src="/social/kosratdrug.png" alt="Kdrugs" className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all" loading="lazy" decoding="async" />
        </a>

      </footer>

    </div>
  );
}