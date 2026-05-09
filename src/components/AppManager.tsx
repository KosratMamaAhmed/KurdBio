import { useState, useEffect } from 'react';
import { Download, Share, Compass, Chrome, Copy, X, ArrowUpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppManager() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); 
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [closedThisSession, setClosedThisSession] = useState(false); // 🌟 تەنها بۆ ئەم جارە دایدەخات

  useEffect(() => {
    // ١. پشکنین بزانە ئەگەر ئەپەکە پێشتر دابەزێنراوە (لە هۆم سکرین کراوەتەوە)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    setIsStandalone(checkStandalone);

    // ئەگەر پێشتر دابەزیبێت، هەرگیز پیشانی مەدە
    if (checkStandalone) return; 

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    
    // ٢. پشکنین بزانە لەناو وێبگەڕی تۆڕە کۆمەڵایەتییەکانە؟
    const inAppBrowsers = ['FBAN', 'FBAV', 'Instagram', 'TikTok', 'ByteLocale', 'Snapchat', 'Line', 'Viber', 'Twitter', 'Threads'];
    const isSocialBrowser = inAppBrowsers.some(browser => ua.includes(browser));

    setDeviceType(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');
    setIsInAppBrowser(isSocialBrowser);

    // ٣. هەمیشە نۆتیفیکەیشنەکە دەربکەوێت تا ئەوکاتەی دایدەبەزێنێت!
    if (isSocialBrowser) {
        setShowPrompt(true);
    } else if (isIOS || isAndroid) {
        // کەمێک چاوەڕێ دەکات پاشان زۆر بە جوانی دێتە خوارەوە
        setTimeout(() => setShowPrompt(true), 1500);
    }

    // ٤. وەرگرتنی ڕێگەپێدانی داگرتن بۆ ئەندرۆید
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
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
    } else {
        // ئەگەر سامسۆنگ بوو یان پەنجەرەکە ئامادە نەبوو، ڕێنمایی دەدات
        alert('بۆ داگرتن، تکایە لە ڕێکخستنی وێبگەڕەکەت کرتە لە (Install App) یان (Add to Home Screen) بکە.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('لینکەکە کۆپیکرا! ئێستا لە سەفاری (Safari) یان کرۆم (Chrome) پەیسنی بکە بۆ ئەوەی بێ کێشە کار بکات.');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setClosedThisSession(true); // لێرەدا قفڵە هەمیشەییەکەم لابرد! تەنها بۆ ئەمجارە دایدەخات.
  };

  if (isStandalone || deviceType === 'desktop' || !showPrompt || closedThisSession) return null;

  const hasContent = isInAppBrowser || deviceType === 'android' || deviceType === 'ios';
  if (!hasContent) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: -100, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex justify-center px-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        dir="rtl"
      >
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
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-neutral-900 dark:text-white leading-tight truncate">لەناو تۆڕە کۆمەڵایەتییەکانیت!</p>
                <p className="text-[10px] font-bold text-rose-500 leading-tight mt-0.5 truncate">بۆ کارکردنی باشتر لە وێبگەڕ بیکەرەوە</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={openExternal} className="px-3 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 font-black text-[11px] rounded-lg active:scale-95 transition-transform flex items-center gap-1 shadow-sm border border-rose-100 dark:border-rose-900/30">
                  {deviceType === 'ios' ? <Compass size={14}/> : <Chrome size={14}/>} وێبگەڕ
                </button>
                <button onClick={handleCopy} className="p-1.5 bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-300 rounded-lg active:scale-95 transition-transform shadow-sm border border-neutral-200 dark:border-slate-700">
                  <Copy size={16}/>
                </button>
              </div>
            </>
          ) : deviceType === 'android' ? (
            <>
              {/* شاشەی داگرتن بۆ ئەندرۆید بە چارەسەری Unsafe */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-neutral-900 dark:text-white leading-tight truncate flex items-center gap-1">
                   ئەپی BioKurd <ShieldCheck size={14} className="text-emerald-500" />
                </p>
                <p className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 whitespace-nowrap">
                  لە سامسۆنگ گەر گوتی (Unsafe) پشتگوێی بخە.
                </p>
              </div>
              <button onClick={handleInstallPWA} className="px-4 py-1.5 bg-emerald-500 text-white text-[12px] font-black rounded-lg shadow-sm hover:bg-emerald-600 active:scale-95 transition-all shrink-0 flex items-center gap-1.5">
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
          <button onClick={handleDismiss} className="p-1.5 text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg active:scale-95 transition-colors shrink-0 bg-neutral-50 dark:bg-slate-800/50">
            <X size={16} strokeWidth={2.5}/>
          </button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}