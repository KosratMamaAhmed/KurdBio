import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, Compass, Chrome, Copy, Smartphone, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppManager() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); 
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    setIsStandalone(checkStandalone);

    if (checkStandalone) return; 

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    const isIOS = (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    
    const inAppBrowsers = ['FBAN', 'FBAV', 'Instagram', 'TikTok', 'ByteLocale', 'Snapchat', 'Line', 'Viber', 'Twitter'];
    const isSocialBrowser = inAppBrowsers.some(browser => ua.includes(browser));

    setDeviceType(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');

    if (isSocialBrowser) {
      setIsInAppBrowser(true);
      setShowPrompt(true);
      setTimeout(() => { forceOpenExternalBrowser(isIOS, isAndroid); }, 500);
    } else {
      const lastDismissed = localStorage.getItem('app_install_last_shown');
      const cooldown = 12 * 60 * 60 * 1000;

      if (!lastDismissed || Date.now() - parseInt(lastDismissed) > cooldown) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
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
      } else {
        handleDismiss();
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('لینکەکە کۆپیکرا! لە سەفاری یان کرۆم پەیسنی بکە.');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (!isInAppBrowser) {
      localStorage.setItem('app_install_last_shown', Date.now().toString());
    }
  };

  if (isStandalone || deviceType === 'desktop' || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: -100, opacity: 0 }}
        className="fixed left-0 right-0 z-[100] pointer-events-none flex justify-center"
        // 🌟 لێرەدا بەتەواوی Safe Area جێبەجێ کراوە بە بەکارهێنانی max بۆ ئەوەی ئەگەر شاشەکە نۆچی نەبوو، لایەنی کەم بۆشاییەک هەبێت
        style={{ 
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          paddingLeft: 'max(env(safe-area-inset-left), 16px)',
          paddingRight: 'max(env(safe-area-inset-right), 16px)'
        }}
        dir="rtl"
      >
        <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-neutral-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col pointer-events-auto relative overflow-hidden">
          
          <button 
            onClick={handleDismiss} 
            className="absolute top-2 left-2 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-slate-800 rounded-full transition-colors z-20"
          >
            <X size={14} />
          </button>

          <div className="flex items-center justify-between gap-3 w-full pr-1">
            {isInAppBrowser && (
              <>
                <div className="absolute inset-0 bg-rose-500/10 z-0"></div>
                <div className="flex flex-col relative z-10 w-full mt-1">
                  <div className="flex items-center gap-2 mb-3 text-rose-600">
                    <Smartphone size={18} strokeWidth={2.5}/>
                    <span className="font-black text-xs">لە وێبگەڕی دەرەکییت!</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => forceOpenExternalBrowser(deviceType === 'ios', deviceType === 'android')} className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-xs font-black shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                      {deviceType === 'ios' ? <Compass size={14}/> : <Chrome size={14}/>}
                      لە {deviceType === 'ios' ? 'سەفاری' : 'کرۆم'} بیکەرەوە
                    </button>
                    <button onClick={handleCopy} className="py-2 px-3 bg-white dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs font-black shadow-sm flex items-center justify-center active:scale-95 transition-transform">
                      <Copy size={16}/>
                    </button>
                  </div>
                </div>
              </>
            )}

            {!isInAppBrowser && deviceType === 'android' && deferredPrompt && (
              <div className="flex items-center gap-3 relative z-10 w-full">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <Download size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-neutral-900 dark:text-white leading-tight">ئەپەکە دابەزێنە</h4>
                  <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 mt-0.5">بەبێ ئینتەرنێتیش بەکاریبهێنە</p>
                </div>
                <button onClick={handleInstallPWA} className="px-3 py-1.5 bg-emerald-500 text-white font-black text-xs rounded-lg shadow-md hover:bg-emerald-600 active:scale-95 transition-all shrink-0 flex items-center gap-1 mr-2">
                  <Zap size={12} fill="currentColor"/> داگرتن
                </button>
              </div>
            )}

            {!isInAppBrowser && deviceType === 'ios' && (
              <div className="flex items-center gap-3 relative z-10 w-full py-1">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <Share size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 leading-snug">
                    بۆ دابەزاندن: کرتە لە <span className="text-blue-500 font-black"><Share size={12} className="inline mb-0.5"/> Share</span> بکە، پاشان <span className="font-black text-neutral-900 dark:text-white"><PlusSquare size={12} className="inline mb-0.5"/> Add to Home</span> هەڵبژێرە.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}