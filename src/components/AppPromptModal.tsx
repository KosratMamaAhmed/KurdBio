import React, { useEffect, useState } from 'react';
import { Share, PlusSquare, X, Download, Smartphone, Apple, Compass, Chrome, ExternalLink, AlertCircle } from 'lucide-react';

interface AppPromptModalProps {
  apkUrl?: string; 
}

export default function AppPromptModal({ apkUrl = '/biokurd.apk' }: AppPromptModalProps) {
  const [deviceType, setDeviceType] = useState<'IOS' | 'ANDROID' | 'DESKTOP' | null>(null);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ڕێگریکردن لە دەرکەوتنی ئەگەر بەکارهێنەر ڕاستەوخۆ ویستی فایل دابگرێت
    if (window.location.pathname.endsWith('.apk')) return;

    // پشکنین کە ئایا ئەپەکە پێشتر خراوەتە سەر شاشە (PWA Installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    if (isStandalone) return; // ئەگەر ئەپ بوو، هەرگیز پیشانی مەدە

    // بۆ ئەوەی تەنها یەکجار لە جەلسەیەکدا پیشانی بدات
    const hasSeenPrompt = sessionStorage.getItem('hasSeenAppPrompt');
    if (hasSeenPrompt) return;

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    const isIos = (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);

    // پشکنینی تۆڕە کۆمەڵایەتییەکان
    const inAppBrowsers = ['FBAN', 'FBAV', 'Instagram', 'TikTok', 'ByteLocale', 'Snapchat', 'Line', 'Viber', 'Twitter'];
    const isSocialBrowser = inAppBrowsers.some(browser => ua.includes(browser));
    
    if (isSocialBrowser) {
      setIsInAppBrowser(true);
      setDeviceType(isIos ? 'IOS' : isAndroid ? 'ANDROID' : 'DESKTOP');
      setTimeout(() => setIsVisible(true), 1500); 
      return;
    }

    if (isIos) {
      setDeviceType('IOS');
      setTimeout(() => setIsVisible(true), 2500);
    } else if (isAndroid) {
      setDeviceType('ANDROID');
      setTimeout(() => setIsVisible(true), 2000);
    } else {
      setDeviceType('DESKTOP');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenAppPrompt', 'true');
  };

  if (!isVisible || !deviceType || deviceType === 'DESKTOP') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 font-sans select-none" dir="rtl">
      <div 
        className={`absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      ></div>

      <div className={`relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 transform transition-all duration-500 overflow-hidden ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
        
        <button onClick={handleClose} className="absolute top-4 left-4 p-2.5 bg-slate-100/80 hover:bg-rose-100 rounded-full text-slate-400 hover:text-rose-500 transition-colors z-10">
            <X size={20} strokeWidth={3} />
        </button>

        <div className="text-center mt-2">
            
            {isInAppBrowser ? (
              <>
                <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-rose-500 to-orange-500 rounded-[1.8rem] flex items-center justify-center mb-5 shadow-lg shadow-rose-500/30 text-white relative">
                   <AlertCircle size={40} strokeWidth={2.5} />
                   <div className="absolute -bottom-2 -right-2 bg-white text-rose-500 p-1.5 rounded-full shadow-sm"><ExternalLink size={16} /></div>
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">لە وێبگەڕی دەرەکییت!</h2>
                <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6 px-2">
                   بۆ باشترین ئەزموون و داگرتنی BioKurd، تکایە ئەم لینکە لە وێبگەڕی سەرەکی مۆبایلەکەت بکەرەوە.
                </p>
                <div className="flex flex-col gap-3">
                   {deviceType === 'IOS' ? (
                     <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-2xl font-black border border-blue-100 shadow-inner">
                        <Compass size={24} /> کردنەوە لە سەفاری (Safari)
                     </div>
                   ) : (
                     <div className="flex items-center justify-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black border border-emerald-100 shadow-inner">
                        <Chrome size={24} /> کردنەوە لە کرۆم (Chrome)
                     </div>
                   )}
                   <p className="text-[11px] font-bold text-slate-400 mt-2">کرتە لە ٣ خاڵەکەی سەرەوە بکە و "Open in Browser" هەڵبژێرە.</p>
                </div>
              </>
            ) : 
            
            deviceType === 'IOS' ? (
              <>
                <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-slate-800 to-slate-900 rounded-[1.8rem] flex items-center justify-center mb-5 shadow-lg shadow-slate-900/30 text-white relative">
                    <Apple size={40} fill="currentColor" />
                    <div className="absolute -bottom-2 -right-2 bg-white text-blue-500 p-1.5 rounded-full shadow-sm"><PlusSquare size={16} /></div>
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">خستنە سەر شاشە</h2>
                <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6 px-2">
                    ئەپی <span className="text-amber-500 font-black">BioKurd</span> وەک بەرنامەیەکی فەرمی بخەرە سەر شاشەی ئایفۆنەکەت بۆ خێراتر گەیشتن.
                </p>
                <div className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                            <Share size={20} />
                        </div>
                        <p className="text-[13px] font-bold text-slate-600 text-right leading-tight">١. کرتە لە دوگمەی <span className="text-blue-500 font-black">Share</span> بکە لە خوارەوەی شاشەکە.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
                            <PlusSquare size={20} />
                        </div>
                        <p className="text-[13px] font-bold text-slate-600 text-right leading-tight">٢. بژاردەی <span className="font-black text-slate-800">Add to Home Screen</span> هەڵبژێرە.</p>
                    </div>
                </div>
              </>
            ) : 
            
            (
              <>
                <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-amber-400 to-orange-500 rounded-[1.8rem] flex items-center justify-center mb-5 shadow-lg shadow-orange-500/30 text-white relative">
                    <Smartphone size={40} />
                    <div className="absolute -bottom-2 -right-2 bg-white text-orange-500 p-1.5 rounded-full shadow-sm"><Download size={16} strokeWidth={3} /></div>
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">بەرنامەکەمان دابەزێنە</h2>
                <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6 px-2">
                   ئەپی <span className="text-amber-500 font-black">BioKurd</span> بەخۆڕایی دابەزێنە بۆ ئەوەی خێراتر و باشتر سودمەند بیت.
                </p>
                <div className="space-y-3">
                    <a href={apkUrl} onClick={handleClose} className="w-full flex items-center justify-center gap-3 p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-base">
                        <Download size={22} /> داگرتنی ڕاستەوخۆ (APK)
                    </a>
                </div>
              </>
            )}
            
            {!isInAppBrowser && (
              <button onClick={handleClose} className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors active:scale-95">
                  نەخێر سوپاس، دواتر دایدەبەزێنم
              </button>
            )}
        </div>
      </div>
    </div>
  );
}