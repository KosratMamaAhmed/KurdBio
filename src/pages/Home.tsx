import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, ShieldCheck, Play, Send } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';

interface Props { user: any; settings: any; theme: any; }

// 🌟 بەکارهێنانی لیستە فەرمییەکە بۆ نیشاندان لە پەڕەی سەرەکی 🌟
const MOCKUP_DATA_SAMPLES = [
  { title: 'ئینستاگرام', icon: 'Instagram', url: 'instagram.com', color: '#E4405F', imageUrl: '/social/instagram.png' },
  { title: 'تیکتۆک', icon: 'Music', url: 'tiktok.com', color: '#000000', imageUrl: '/social/tiktok.png' },
  { title: 'سناپچات', icon: 'Ghost', url: 'snapchat.com', color: '#FFFC00', imageUrl: '/social/snapchat.png' },
  { title: 'واتسئاپ', icon: 'MessageCircle', url: 'wa.me', color: '#25D366', imageUrl: '/social/whatsapp.png' },
  { title: 'تێلیگرام', icon: 'Send', url: 't.me', color: '#26A5E4', imageUrl: '/social/telegram.png' },
  { title: 'یوتیوب', icon: 'Youtube', url: 'youtube.com', color: '#FF0000', imageUrl: '/social/youtube.png' },
  { title: 'پلەی ستۆر', icon: 'Play', url: 'play.google.com', color: '#00D859', imageUrl: '/social/playstore.png' },
  { title: 'ڤایبەر', icon: 'Phone', url: 'viber://', color: '#7360F2', imageUrl: '/social/viber.png' }
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
    <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col font-sans overflow-hidden relative selection:bg-orange-200" dir="rtl">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[50%] bg-gradient-to-b from-orange-300/30 to-transparent rounded-full blur-[120px]"></div>
         <div className="absolute top-[30%] -left-[10%] w-[50%] h-[60%] bg-gradient-to-t from-blue-400/20 to-transparent rounded-full blur-[120px]"></div>
      </div>

      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ${theme?.main || 'bg-orange-500'}`}>B</div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900 hidden sm:block">BioKurd</span>
        </div>
        <div className="flex gap-3">
          <Link to={user ? "/dashboard" : "/auth"} className={`px-6 py-2.5 rounded-full font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95 ${theme?.main || 'bg-orange-500'}`}>
            {user ? 'داشبۆرد' : 'دەستپێکردن'}
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 gap-10 lg:gap-16 relative z-10">
        
        <div className="flex-1 text-center lg:text-right space-y-8 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-orange-200/60 text-orange-600 font-bold text-sm shadow-sm mx-auto lg:mx-0">
            <Sparkles size={16} /> <span>نوێترین شێوازی پرۆفایلی دیجیتاڵی</span>
          </div>
          
          <h1 className="text-[2.75rem] sm:text-6xl lg:text-[75px] font-black text-neutral-900 leading-[1.1] tracking-tight">
            کۆتایی بە <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-600 to-amber-500 relative inline-block">لینکە زۆرەکان</span> بهێنە
          </h1>
          
          <p className="text-lg text-neutral-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            هەموو تۆڕە کۆمەڵایەتییەکان، کارەکانت و زانیارییەکانت لە یەک شوێنی ناوازەدا کۆبکەرەوە.
          </p>
          
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/auth" className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-white rounded-full font-black text-lg hover:-translate-y-1 transition-all shadow-lg ${theme?.main || 'bg-orange-500'}`}>
              هەژمارت دروست بکە <ArrowLeft size={22} strokeWidth={3} />
            </Link>
          </div>

          {/* دوگمە جێگیرەکانی خوارەوە */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 border-t border-neutral-200/60 mt-4">
            <a href="https://play.google.com/store/apps/dev?id=6744749568381312149" target="_blank" className="relative w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black shadow-md hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden group">
               <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
               <Play size={22} fill="currentColor" />
               <span className="text-sm">بەرنامەکانم لە پلەی ستۆر</span>
            </a>
            <a href="http://t.me/kosratdev" target="_blank" className="relative w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-2xl font-black shadow-md hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden group">
               <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
               <Send size={22} />
               <span className="text-sm">ئێمە لە تەلەگرام</span>
            </a>
          </div>
        </div>

        {/* 🌟 مۆکئەپ بە دوورخستنەوە (Scale Down) و بەکارهێنانی داتای نوێ 🌟 */}
        <div className="shrink-0 relative z-10 flex justify-center w-full lg:w-auto transform scale-[0.82] sm:scale-90 lg:scale-[0.88] origin-top lg:origin-center">
           <PhoneMockup mockup={mockup} mockupLinks={MOCKUP_DATA_SAMPLES} />
        </div>
        
      </main>
    </div>
  );
}