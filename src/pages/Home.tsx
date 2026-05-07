import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, ShieldCheck, Play, Send } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';

interface Props { user: any; settings: any; theme: any; }

export default function Home({ user, settings, theme }: Props) {
  const [mockup, setMockup] = useState(settings?.mockup || { 
    name: 'کۆسرەت مامە', 
    bio: 'گەشەپێدەری بەرنامەکانی ئەندرۆید و وێب', 
    avatar: 'https://ui-avatars.com/api/?name=Kosrat+Mama&background=f97316&color=fff&size=256', 
    bgImage: '', // 🌟 باکگراوندەکە سادە کرایەوە
    buttonDesign: 'light', // 🌟 دیزاینی ڕووناک هەڵبژێردرا بۆ ئەوەی ئایکۆنەکان دەربکەون
    isPro: true
  });

  useEffect(() => { 
    if (settings?.mockup) setMockup(settings.mockup); 
  }, [settings]);

  // 🌟 بەستەرەکان گۆڕدران بەپێی داواکارییەکەت 🌟
  const mockupLinks = [
    { name: 'تیکتۆک', iconName: 'Music', color: '#000000' },
    { name: 'سناپچات', iconName: 'Ghost', color: '#eab308' },
    { name: 'تێلیگرام', iconName: 'Send', color: '#26A5E4' },
    { name: 'ئینستاگرام', iconName: 'Instagram', color: '#E4405F' },
    { name: 'پەیوەندی', iconName: 'Phone', color: '#10B981' },
  ];

  return (
    <div className="h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#f8fafc] flex flex-col font-sans relative selection:bg-orange-200" dir="rtl">
      
      {/* 🌟 ئەم ستایلە فۆرس دەکرێت تەنها بۆ ناو مۆکئەپەکە بۆ ئەوەی دوگمەکان باریک بن و ئایکۆنەکانیان ڕەنگاوڕەنگ بێت 🌟 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mockup-wrapper button {
            padding-top: 10px !important;
            padding-bottom: 10px !important;
            background: #ffffff !important;
            color: #1f2937 !important;
            border: 1px solid #e5e7eb !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02) !important;
            border-radius: 12px !important;
        }
        .mockup-wrapper button:nth-child(1) svg { color: #000000 !important; }
        .mockup-wrapper button:nth-child(2) svg { color: #eab308 !important; }
        .mockup-wrapper button:nth-child(3) svg { color: #26A5E4 !important; }
        .mockup-wrapper button:nth-child(4) svg { color: #10B981 !important; }
        .mockup-wrapper button:nth-child(5) svg { color: #E4405F !important; }
      `}} />

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none transform-gpu z-0">
         <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[50%] bg-gradient-to-b from-orange-300/40 to-transparent rounded-full blur-[120px]"></div>
         <div className="absolute top-[30%] -left-[10%] w-[50%] h-[60%] bg-gradient-to-t from-blue-400/30 to-transparent rounded-full blur-[120px]"></div>
         <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] bg-gradient-to-t from-emerald-300/30 to-transparent rounded-full blur-[120px]"></div>
      </div>

      <nav className="max-w-7xl mx-auto w-full px-6 sm:px-8 py-6 flex items-center justify-between relative z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ${theme?.main || 'bg-orange-500'}`}>B</div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900 hidden sm:block">BioKurd</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? 
            <Link to="/dashboard" className="font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 transition-colors">داشبۆرد</Link> : 
            <Link to="/auth" className="font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 transition-colors hidden sm:block">چوونەژوورەوە</Link>
          }
          <Link to={user ? "/dashboard" : "/auth"} className={`px-6 py-2.5 rounded-full font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all transform-gpu ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>
            دەستپێکردن
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 py-10 lg:py-0 gap-16 relative z-10 pb-8">
        
        <div className="flex-1 text-center lg:text-right space-y-8 relative z-10 w-full mt-4 lg:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-orange-200/60 text-orange-600 font-bold text-sm shadow-sm mx-auto lg:mx-0">
            <Sparkles size={16} /> <span>نوێترین شێوازی پرۆفایلی دیجیتاڵی</span>
          </div>
          
          <h1 className="text-[2.75rem] sm:text-6xl lg:text-[75px] font-black text-neutral-900 leading-[1.1] tracking-tight">
            کۆتایی بە <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-600 to-amber-500 relative inline-block">لینکە زۆرەکان <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg></span> بهێنە
          </h1>
          
          <p className="text-lg sm:text-xl text-neutral-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            هەموو تۆڕە کۆمەڵایەتییەکان، کارەکانت و زانیارییەکانت لە یەک شوێنی ناوازەدا کۆبکەرەوە و با هەمووان بە ئاسانی بتبینن.
          </p>
          
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/auth" className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-5 text-white rounded-full font-black text-lg hover:-translate-y-1 active:scale-95 transition-all shadow-[0_8px_25px_rgba(249,115,22,0.3)] transform-gpu ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>
              هەژمارت دروست بکە <ArrowLeft size={22} strokeWidth={3} />
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-neutral-500 font-bold text-sm">
            <div className="flex items-center gap-2"><Zap size={18} className="text-amber-500"/> خێرا</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500"/> پارێزراو</div>
            <div className="flex items-center gap-2"><Sparkles size={18} className="text-blue-500"/> ناوازە</div>
          </div>
        </div>

        <div className="shrink-0 relative z-10 flex justify-center w-full lg:w-auto mt-10 lg:mt-0">
           <div className="pointer-events-none select-none touch-none overflow-hidden mockup-wrapper" style={{ pointerEvents: 'none' }}>
              <PhoneMockup mockup={mockup} mockupLinks={mockupLinks} />
           </div>
        </div>
        
      </main>

      {/* 🌟 ئەم دوو دوگمەیە هێنرانە خوار خوارەوەی شاشەکە 🌟 */}
      <footer className="w-full mt-auto relative z-20 shrink-0 pb-6 pt-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://play.google.com/store/apps/dev?id=6744749568381312149&hl=en" target="_blank" rel="noopener noreferrer" 
             className="relative w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden group">
             <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out z-0"></div>
             <Play size={22} fill="currentColor" className="relative z-10" />
             <span className="relative z-10 text-sm sm:text-base tracking-wide">بەرنامەکانم لە پلەی ستۆر</span>
          </a>
          
          <a href="http://t.me/kosratdev" target="_blank" rel="noopener noreferrer" 
             className="relative w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-2xl font-black shadow-[0_8px_20px_rgba(56,189,248,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden group">
             <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out z-0"></div>
             <Send size={22} className="relative z-10" />
             <span className="relative z-10 text-sm sm:text-base tracking-wide">ئێمە لە تەلەگرام</span>
          </a>
      </footer>

    </div>
  );
}