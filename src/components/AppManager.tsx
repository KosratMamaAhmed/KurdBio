import { useState, useEffect } from 'react';
import { Download, Share, Compass, Chrome, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppManager() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); 
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // پشکنین بزانە ئەگەر ئەپەکە پێشتر دابەزێنراوە (Standalone)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    setIsStandalone(checkStandalone);

    if (checkStandalone) return; 

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // پشکنینی جۆری ئامێر
    const isIOS = (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    
    // پشکنین بزانە لەناو وێبگەڕی تۆڕە کۆمەڵایەتییەکانە (Instagram, TikTok, FB, etc.)
    const inAppBrowsers = ['FBAN', 'FBAV', 'Instagram', 'TikTok', 'ByteLocale', 'Snapchat', 'Line', 'Viber', 'Twitter', 'Threads'];
    const isSocialBrowser = inAppBrowsers.some(browser => ua.includes(browser));

    setDeviceType(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');

    // لۆجیکی نیشاندانی ئاگادارکەرەوە
    if (isSocialBrowser) {
      setIsInAppBrowser(true);
      setShowPrompt(true);
      // هەوڵدان بۆ کردنەوەی ڕاستەوخۆ بە زۆرەملێ، گەر سەرینەگرت ئاگادارکەرەوەکە دەمێنێتەوە
      setTimeout(() => { forceOpenExternalBrowser(isIOS, isAndroid); }, 500);
    } else {
      // ئەگەر پێشتر دایخستبێت، هەرگیز پیشانی مەدەرەوە
      const dismissed = localStorage.getItem('biokurd_app_dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 2500);
      }
    }

    // گرتنی ئیڤێنتی داگرتنی PWA بۆ ئەندرۆید
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
    const hostPath = window.location.host + window.location.pathname;
    try {
      if (isAndroid) {
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
        setShowPrompt(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('لینکەکە کۆپیکرا! ئێستا دەتوانیت لە سەفاری یان کرۆم بیکەیتەوە.');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 🌟 ئەگەر دایخست، بۆ هەمیشە بیشارەوە 🌟
    localStorage.setItem('biokurd_app_dismissed', 'true');
  };

  // ئەگەر پێشتر دایبەزاندبوو یان کۆمپیوتەر بوو، هیچ پیشان مەدە
  if (isStandalone || deviceType === 'desktop' || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: -100, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex justify-center px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }} // 🌟 پاراستن لە کامێرای مۆبایل 🌟
        dir="rtl"
      >
        {/* دیزاینە باریک و خڕەکە (Pill Shape) */}
        <div className="w-full max-w-[360px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-neutral-200/50 dark:border-slate-700/50 rounded-full p-1.5 pl-2.5 flex items-center gap-3 pointer-events-auto relative">
          
          {/* ئایکۆنی ئەپەکە */}
          <img src="/apple-touch-icon.png" className="w-11 h-11 rounded-full shadow-sm shrink-0 border border-neutral-100 dark:border-slate-800" alt="BioKurd" />

          {isInAppBrowser ? (
            <>
              {/* بۆ وێبگەڕی ئینستاگرام و تیکتۆک */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-[12px] font-black text-neutral-800 dark:text-white leading-tight truncate">لێرە کێشەی هەیە!</p>
                <p className="text-[10px] font-bold text-rose-500 leading-tight mt-0.5 truncate">لە سەفاری یان کرۆم بیکەرەوە</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => forceOpenExternalBrowser(deviceType === 'ios', deviceType === 'android')} className="w-9 h-9 flex items-center justify-center bg-rose-500 text-white rounded-full shadow-sm active:scale-95 transition-transform" title="کردنەوە لە وێبگەڕ">
                  {deviceType === 'ios' ? <Compass size={18}/> : <Chrome size={18}/>}
                </button>
                <button onClick={handleCopy} className="w-9 h-9 flex items-center justify-center bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-300 rounded-full shadow-sm active:scale-95 transition-transform" title="کۆپیکردنی لینک">
                  <Copy size={16}/>
                </button>
              </div>
            </>
          ) : deviceType === 'android' && deferredPrompt ? (
            <>
              {/* بۆ داگرتن لە ئەندرۆید */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-[13px] font-black text-neutral-800 dark:text-white leading-tight truncate">BioKurd</p>
                <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 truncate">بەبێ ئینتەرنێتیش خێرایە</p>
              </div>
              <button onClick={handleInstallPWA} className="px-5 py-2 bg-emerald-500 text-white text-[12px] font-black rounded-full shadow-sm active:scale-95 transition-transform shrink-0 flex items-center gap-1.5">
                <Download size={14}/> داگرتن
              </button>
            </>
          ) : deviceType === 'ios' ? (
            <>
              {/* بۆ داگرتن لە ئایفۆن */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-[11px] font-black text-neutral-800 dark:text-white leading-tight truncate">بیخەرە سەر شاشەکەت</p>
                <p className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  لە خوارەوە <Share size={10} className="inline text-blue-500 mx-0.5"/> بگرە، پاشان <span className="text-neutral-700 dark:text-neutral-300 font-black">Add to Home</span>
                </p>
              </div>
            </>
          ) : null}

          {/* هێڵی جیاکەرەوە و دوگمەی لادان (X) */}
          <div className="w-[1px] h-6 bg-neutral-200 dark:bg-slate-700 mx-0.5 shrink-0"></div>
          <button onClick={handleDismiss} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full active:scale-95 transition-colors shrink-0">
            <X size={18} strokeWidth={2.5}/>
          </button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}