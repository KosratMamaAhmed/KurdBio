import { useState, useEffect } from 'react';
import { Download, Share, Compass, Chrome, Copy, X, Zap, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppManager() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); 
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // ١. پشکنین بزانە ئەگەر ئەپەکە پێشتر دابەزێنراوە (لە هۆم سکرین کراوەتەوە)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    setIsStandalone(checkStandalone);

    if (checkStandalone) return; 

    // ٢. پشکنین بزانە بەکارهێنەر پێشتر نۆتیفیکەیشنەکەی داخستووە؟
    const dismissed = localStorage.getItem('biokurd_app_dismissed');

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    
    // ٣. پشکنین بزانە لەناو وێبگەڕی تۆڕە کۆمەڵایەتییەکانە؟
    const inAppBrowsers = ['FBAN', 'FBAV', 'Instagram', 'TikTok', 'ByteLocale', 'Snapchat', 'Line', 'Viber', 'Twitter', 'Threads'];
    const isSocialBrowser = inAppBrowsers.some(browser => ua.includes(browser));

    setDeviceType(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');
    setIsInAppBrowser(isSocialBrowser);

    // ٤. کەی نۆتیفیکەیشنەکە دەربکەوێت؟
    if (isSocialBrowser) {
        // گەر لەناو تیکتۆک/ئینستاگرام بوو ڕاستەوخۆ دەردەکەوێت بۆ ئەوەی ڕزگاری بێت
        setShowPrompt(true);
    } else if (!dismissed && isIOS) {
        // بۆ ئایفۆن کەمێک دوادەکەوێت پاشان دەردەکەوێت
        setTimeout(() => setShowPrompt(true), 2500);
    }

    // ٥. وەرگرتنی ڕێگەپێدانی داگرتن بۆ ئەندرۆید
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isSocialBrowser && !dismissed) {
          setShowPrompt(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => { window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt); };
  }, []);

  const openExternal = () => {
    const currentUrl = window.location.href;
    const hostPath = window.location.host + window.location.pathname;
    try {
      if (deviceType === 'android') {
        window.top!.location.href = `intent://${hostPath}#Intent;scheme=https;package=com.android.chrome;end;`;
      } else {
        // بۆ ئایفۆن باشترە فەرمانی کۆپیکردنی پێ بدرێت چونکە سەفاری زۆرجار بلۆکی دەکات
        handleCopy();
      }
    } catch (e) {
      handleCopy();
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
    alert('لینکەکە کۆپیکرا! ئێستا لە سەفاری یان کرۆم پەیسنی بکە بۆ ئەوەی بێ کێشە کار بکات.');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('biokurd_app_dismissed', 'true');
  };

  // ئەگەر پێشتر دایبەزاندبوو یان لە کۆمپیوتەرە یان دایخستووە، هیچ پیشان مەدە
  if (isStandalone || deviceType === 'desktop' || !showPrompt) return null;

  // دڵنیابوونەوە لەوەی کە بۆکسە سپییە بەتاڵەکە دەرناکەوێت گەر داتای نەبوو
  const hasContent = isInAppBrowser || (deviceType === 'android' && deferredPrompt) || (deviceType === 'ios' && !isInAppBrowser);
  if (!hasContent) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: -100, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex justify-center px-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }} // 🌟 پاراستن لە کامێرای مۆبایل 🌟
        dir="rtl"
      >
        {/* دیزاینە باریک و قەشەنگەکە کە ئایکۆنەکەی تێدایە */}
        <div className="w-full max-w-[380px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] border border-neutral-200/60 dark:border-slate-700/60 rounded-2xl p-2.5 flex items-center gap-3 pointer-events-auto relative">
          
          {/* ئایکۆنی ئەپەکە */}
          <div className="shrink-0 relative">
             <img src="/apple-touch-icon.png" className="w-11 h-11 rounded-[10px] shadow-sm border border-neutral-100 dark:border-slate-800 object-cover" alt="BioKurd" />
             {isInAppBrowser && (
               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
             )}
          </div>

          {isInAppBrowser ? (
            <>
              {/* شاشەی ئینستاگرام و تیکتۆک */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-neutral-900 dark:text-white leading-tight truncate">لەناو تۆڕە کۆمەڵایەتییەکانیت!</p>
                <p className="text-[10px] font-bold text-rose-500 leading-tight mt-0.5 truncate">بۆ کارکردنی باشتر لە وێبگەڕ بیکەرەوە</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={openExternal} className="px-3 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 font-black text-[11px] rounded-lg active:scale-95 transition-transform flex items-center gap-1">
                  {deviceType === 'ios' ? <Compass size={14}/> : <Chrome size={14}/>} وێبگەڕ
                </button>
                <button onClick={handleCopy} className="p-1.5 bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-300 rounded-lg active:scale-95 transition-transform">
                  <Copy size={16}/>
                </button>
              </div>
            </>
          ) : deviceType === 'android' && deferredPrompt ? (
            <>
              {/* شاشەی داگرتن بۆ ئەندرۆید */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-neutral-900 dark:text-white leading-tight truncate">ئەپی BioKurd</p>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-tight mt-0.5 truncate">خێرا و بێ ئینتەرنێت کار دەکات</p>
              </div>
              <button onClick={handleInstallPWA} className="px-4 py-1.5 bg-emerald-500 text-white text-[12px] font-black rounded-lg shadow-sm active:scale-95 transition-transform shrink-0 flex items-center gap-1.5">
                <Download size={14}/> داگرتن
              </button>
            </>
          ) : deviceType === 'ios' ? (
            <>
              {/* شاشەی داگرتن بۆ ئایفۆن */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-black text-neutral-900 dark:text-white leading-tight truncate">خستنە سەر شاشە (Install)</p>
                <p className="text-[9.5px] font-bold text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 whitespace-nowrap">
                  کرتە لە <Share size={10} className="inline text-blue-500 mx-0.5 mb-0.5"/> بکە، پاشان <span className="text-neutral-800 dark:text-neutral-200 font-black">Add to Home</span>
                </p>
              </div>
              <ArrowUpCircle size={24} className="text-blue-500 animate-bounce shrink-0 mx-1 opacity-80" strokeWidth={2} />
            </>
          ) : null}

          {/* هێڵی جیاکەرەوە و دوگمەی لادان (X) */}
          <div className="w-[1px] h-8 bg-neutral-200 dark:bg-slate-700 mx-1 shrink-0"></div>
          <button onClick={handleDismiss} className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg active:scale-95 transition-colors shrink-0 bg-neutral-50 dark:bg-slate-800/50">
            <X size={16} strokeWidth={2.5}/>
          </button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}