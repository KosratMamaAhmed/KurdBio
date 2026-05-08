import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, Compass, Chrome, Copy, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppManager() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // پشکنین کە ئایا بەرنامەکە پێشتر دابەزیوە (PWA)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    setIsStandalone(checkStandalone);

    if (checkStandalone) return; 

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /android/i.test(ua);
    
    // پشکنینی وێبگەڕە دەرەکییەکان
    const inAppBrowsers = ['FBAN', 'FBAV', 'Instagram', 'TikTok', 'ByteLocale', 'Snapchat', 'Line', 'Viber', 'Twitter'];
    const isSocialBrowser = inAppBrowsers.some(browser => ua.includes(browser));

    setDeviceType(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');

    if (isSocialBrowser) {
      setIsInAppBrowser(true);
      // تێبینی: لێرەدا چیتر بە ئۆتۆماتیکی نایگوازینەوە بۆ ئەوەی ئیرۆری Action cant be completed نەدات. دەبێت خۆی کلیک لە دوگمەکە بکات.
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const forceOpenExternalBrowser = (isIOS: boolean, isAndroid: boolean) => {
    const currentUrl = window.location.href;
    const hostPath = window.location.host + window.location.pathname + window.location.search;
    
    try {
      if (isAndroid) {
        // فڕێدانی ئەندرۆید بۆ ناو کرۆم پاش کلیک کردن
        window.top!.location.href = `intent://${hostPath}#Intent;scheme=https;package=com.android.chrome;end;`;
      } else if (isIOS) {
        window.top!.location.href = `x-web-search://?${currentUrl}`;
      }
    } catch (e) {
      window.location.href = currentUrl;
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsStandalone(true);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('لینکەکە کۆپیکرا! لە سەفاری یان کرۆم پەیسنی بکە.');
  };

  // 🌟 ئەم بەشە ڕێگری دەکات لە دەرکەوتنی بۆکسە سپییە بەتاڵەکە 🌟
  if (isStandalone || deviceType === 'desktop') return null;

  const showInAppWarning = isInAppBrowser;
  const showAndroidPWA = !isInAppBrowser && deviceType === 'android' && deferredPrompt;
  const showIosPWA = !isInAppBrowser && deviceType === 'ios';

  // ئەگەر هیچ کامیان نەبوو، ڕاستەوخۆ null دەکەین بۆ ئەوەی هیچ بۆکسێکی سپی دروست نەبێت
  if (!showInAppWarning && !showAndroidPWA && !showIosPWA) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="fixed top-0 left-0 right-0 z-[100] px-3 py-3 pointer-events-none"
        dir="rtl"
      >
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl shadow-2xl border border-neutral-200 rounded-2xl p-3 flex items-center justify-between gap-3 pointer-events-auto overflow-hidden relative">
          
          {/* ئەگەر لەناو تیکتۆک یان فەیسبووک بوو */}
          {showInAppWarning && (
            <>
              <div className="absolute inset-0 bg-rose-500/5 z-0"></div>
              <div className="flex flex-col relative z-10 w-full">
                <div className="flex items-center gap-2 mb-2 text-rose-600">
                  <Smartphone size={18} strokeWidth={2.5}/>
                  <span className="font-black text-xs">لە وێبگەڕی دەرەکییت! کێشە لە کردنەوەی لینکەکان دروست دەبێت.</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => forceOpenExternalBrowser(deviceType === 'ios', deviceType === 'android')} className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                    {deviceType === 'ios' ? <Compass size={16}/> : <Chrome size={16}/>}
                    لە {deviceType === 'ios' ? 'سەفاری' : 'کرۆم'} بیکەرەوە
                  </button>
                  <button onClick={handleCopy} className="py-2.5 px-4 bg-white text-rose-600 border border-rose-200 rounded-xl text-xs font-black shadow-sm flex items-center justify-center active:scale-95 transition-transform">
                    <Copy size={18}/>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ئەگەر لە ئەندرۆید (کرۆم) بوو وە هێشتا داینەگرتبوو */}
          {showAndroidPWA && (
            <>
              <div className="flex items-center gap-3 relative z-10 w-full">
                <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Download size={22} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-black text-neutral-900 leading-tight">ئەپەکە دابەزێنە</h4>
                  <p className="text-[10px] font-bold text-neutral-500 mt-0.5">بۆ خێراتر گەیشتن بە بەستەرەکان</p>
                </div>
                <button onClick={handleInstallPWA} className="px-5 py-2.5 bg-emerald-500 text-white font-black text-[13px] rounded-xl shadow-md hover:bg-emerald-600 active:scale-95 transition-all shrink-0">
                  داگرتن
                </button>
              </div>
            </>
          )}

          {/* ئەگەر لە ئایفۆن (سەفاری) بوو وە هێشتا داینەگرتبوو */}
          {showIosPWA && (
            <div className="flex items-center gap-2 relative z-10 w-full py-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <Share size={20} strokeWidth={2.5} />
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-neutral-600 leading-snug flex-1 pl-1">
                بۆ خستنە سەر شاشە: کرتە لە <span className="text-blue-500 font-black"><Share size={14} className="inline mb-0.5"/> Share</span> بکە، پاشان <span className="font-black text-neutral-900"><PlusSquare size={14} className="inline mb-0.5"/> Add to Home Screen</span> هەڵبژێرە.
              </p>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}