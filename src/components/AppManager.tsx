import { useState, useEffect } from 'react';
import { Download, Share, Compass, Chrome, Copy, ArrowUpCircle, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppManager() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  const [isStandalone, setIsStandalone] = useState(true); 
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // ١. پشکنین بزانە ئەگەر ئەپەکە پێشتر دابەزێنراوە (واتە بووەتە ئەپ)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    setIsStandalone(checkStandalone);

    if (checkStandalone) return; 

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    
    // ٢. ناسینەوەی وێبگەڕی تۆڕە کۆمەڵایەتییەکان (بەتایبەت تیکتۆک)
    const socialBrowsers = [
        { name: 'TikTok', regex: /TikTok/i },
        { name: 'Instagram', regex: /Instagram/i },
        { name: 'Facebook', regex: /FBAN|FBAV/i },
        { name: 'Snapchat', regex: /Snapchat/i },
        { name: 'Viber', regex: /Viber/i }
    ];

    let detectedSocial = false;
    let socialName = '';
    
    for (const browser of socialBrowsers) {
        if (browser.regex.test(ua)) {
            detectedSocial = true;
            socialName = browser.name;
            break;
        }
    }

    setDeviceType(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');
    setIsInAppBrowser(detectedSocial);
    setInAppBrowserName(socialName);

    // ٣. هەوڵدان بۆ کردنەوەی زۆرەملێی وێبگەڕ (خۆپاراستن لە کێشەی تیکتۆک)
    if (detectedSocial) {
        setTimeout(() => {
            const hostPath = window.location.host + window.location.pathname;
            const currentUrl = window.location.href;
            
            if (isAndroid) {
                // ئەندرۆید بێ کێشە کرۆم دەکاتەوە
                window.location.href = `intent://${hostPath}#Intent;scheme=https;package=com.android.chrome;end;`;
            } else if (isIOS && socialName !== 'TikTok') {
                // ئایفۆن ئەگەر تیکتۆک نەبوو، هەوڵی کردنەوە دەدات
                window.location.href = `x-web-search://?${currentUrl}`;
            }
            // ئەگەر تیکتۆکی ئایفۆن بوو، هیچ ناکەین بۆ ئەوەی هەڵەی (Action can't be completed) نەدات،
            // بەڵکو لە ڕێگەی دیزاینەکەوە ڕێنمایی دەدەین بەکارهێنەر خۆی بیکاتەوە.
        }, 800);
    }

    // ٤. وەرگرتنی ڕێگەپێدانی داگرتن بۆ ئەندرۆید
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => { window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt); };
  }, []);

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
    alert('لینکەکە کۆپیکرا! ئێستا لە سەفاری (Safari) یان کرۆم (Chrome) پەیسنی بکە.');
  };

  // ئەگەر بووەتە ئەپ یان کۆمپیوتەرە هیچ پیشان مەدە
  if (isStandalone || deviceType === 'desktop') return null;

  const hasContent = isInAppBrowser || (deviceType === 'android' && deferredPrompt) || (deviceType === 'ios' && !isInAppBrowser);
  if (!hasContent) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex justify-center px-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        dir="rtl"
      >
        <div className="w-full max-w-[380px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] border border-neutral-200/60 dark:border-slate-700/60 rounded-2xl p-2.5 flex items-center gap-3 pointer-events-auto relative">
          
          <div className="shrink-0 relative">
             <img src="/apple-touch-icon.png" className="w-11 h-11 rounded-[10px] shadow-sm border border-neutral-100 dark:border-slate-800 object-cover" alt="BioKurd" />
             {isInAppBrowser && (
               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
             )}
          </div>

          {isInAppBrowser ? (
            <>
              <div className="flex-1 min-w-0">
                {inAppBrowserName === 'TikTok' && deviceType === 'ios' ? (
                   <>
                      {/* چارەسەری تیکتۆکی ئایفۆن */}
                      <p className="text-[12px] font-black text-rose-600 dark:text-rose-400 leading-tight truncate">لێرە بەباشی کارناکات!</p>
                      <p className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 leading-tight mt-0.5">
                        لە سەرەوە کلیک لە <MoreHorizontal size={12} className="inline text-neutral-800 dark:text-neutral-200"/> بکە و <span className="font-black">Open in Browser</span> هەڵبژێرە.
                      </p>
                   </>
                ) : (
                   <>
                      {/* بۆ ئەوانی تر */}
                      <p className="text-[13px] font-black text-neutral-900 dark:text-white leading-tight truncate">وێبگەڕی تۆڕە کۆمەڵایەتییەکان!</p>
                      <p className="text-[10px] font-bold text-rose-500 leading-tight mt-0.5 truncate">بۆ کارکردنی باشتر، لینکەکە کۆپی بکە</p>
                   </>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={handleCopy} className="p-2 bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-neutral-200 rounded-lg active:scale-95 transition-transform shadow-sm border border-neutral-200 dark:border-slate-700 flex items-center gap-1.5">
                  <Copy size={16}/> <span className="text-[11px] font-black">کۆپی</span>
                </button>
              </div>
            </>
          ) : deviceType === 'android' ? (
            <>
              {/* شاشەی داگرتن بۆ ئەندرۆید */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-neutral-900 dark:text-white leading-tight truncate">ئەپی BioKurd</p>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-tight mt-0.5 truncate">بێ ئینتەرنێتیش خێرایە</p>
              </div>
              <button onClick={handleInstallPWA} className="px-4 py-1.5 bg-emerald-500 text-white text-[12px] font-black rounded-lg shadow-sm hover:bg-emerald-600 active:scale-95 transition-all shrink-0 flex items-center gap-1.5">
                <Download size={14}/> داگرتن
              </button>
            </>
          ) : deviceType === 'ios' ? (
            <>
              {/* شاشەی داگرتن بۆ ئایفۆن */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-black text-neutral-900 dark:text-white leading-tight truncate">بیخەرە سەر شاشەکەت (Install)</p>
                <p className="text-[9.5px] font-bold text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 whitespace-nowrap">
                  کرتە لە <Share size={10} className="inline text-blue-500 mx-0.5 mb-0.5"/> بکە، پاشان <span className="text-neutral-800 dark:text-neutral-200 font-black">Add to Home</span>
                </p>
              </div>
              <ArrowUpCircle size={24} className="text-blue-500 animate-bounce shrink-0 mx-1 opacity-80" strokeWidth={2} />
            </>
          ) : null}

          {/* تێبینی: دوگمەی X (داخستن) بەتەواوی لابردراوە بۆ ئەوەی هەرگیز لانەچێت تا دەیکاتە ئەپ! */}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}