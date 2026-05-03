import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, Share, MoreVertical, Compass, AlertCircle, Plus } from 'lucide-react';

export default function AppManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'in-app' | 'desktop'>('desktop');

  useEffect(() => {
    try {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      
      let isDismissed = 'false';
      try {
        isDismissed = localStorage.getItem('hideBiokurdInstall') || 'false';
      } catch (err) {
        console.warn("Safari blocked localStorage");
      }
      
      if (isStandalone || isDismissed === 'true') return;

      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const isAndroid = /android/i.test(ua);
      const isInApp = /FBAN|FBAV|Instagram|Snapchat|TikTok|Bytedance|Twitter|LinkedIn/i.test(ua);

      if (isInApp) {
        setDeviceType('in-app');
        // لەناو ئەپەکان هەرگیز PWA یان داواکاری مەدە چونکە تەنها کێشە دروست دەکات
        return; 
      } else if (isIOS) {
        setDeviceType('ios');
        setShowInstall(true);
      } else if (isAndroid) {
        setDeviceType('android');
      } else {
        setDeviceType('desktop');
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        if (!isInApp && !isIOS) setShowInstall(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      const timer = setTimeout(() => {
        if (isIOS && !isStandalone && isDismissed !== 'true') setShowInstall(true);
      }, 3000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    } catch (mainError) {
      console.error("AppManager Guard:", mainError);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstall(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
    try {
      localStorage.setItem('hideBiokurdInstall', 'true');
      setTimeout(() => localStorage.removeItem('hideBiokurdInstall'), 7 * 24 * 60 * 60 * 1000);
    } catch (err) {}
  };

  const renderContent = () => {
    if (deviceType === 'ios') {
      return (
        <>
          <div className="flex items-center gap-4 pr-1">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 p-3.5 rounded-2xl shrink-0 shadow-inner">
              <Smartphone size={28} strokeWidth={2.5} />
            </div>
            <div className="pl-6">
              <h4 className="font-black text-neutral-900 text-lg mb-1 tracking-tight">ئەپی BioKurd</h4>
              <p className="text-sm font-bold text-neutral-500 leading-relaxed">بۆ دابەزاندن تکایە ئەم هەنگاوانە جێبەجێ بکە:</p>
            </div>
          </div>
          <div className="bg-neutral-100 rounded-xl p-4 mt-2 border border-neutral-200">
            <p className="text-sm font-bold text-neutral-700 flex items-center gap-2">
              <span className="bg-white text-blue-500 p-1 rounded-md shadow-sm border border-neutral-200"><Share size={16}/></span>
              ١. کلیک لە (Share) بکە لە خوارەوەی شاشەکە.
            </p>
            <p className="text-sm font-bold text-neutral-700 flex items-center gap-2 mt-3">
              <span className="bg-white p-1 rounded-md shadow-sm border border-neutral-200"><Plus size={16}/></span>
              ٢. پاشان (Add to Home Screen) هەڵبژێرە.
            </p>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center gap-4 pr-1">
          <div className="bg-gradient-to-br from-orange-100 to-amber-200 text-orange-600 p-3.5 rounded-2xl shrink-0 shadow-inner">
            <Smartphone size={28} strokeWidth={2.5} />
          </div>
          <div className="pl-6">
            <h4 className="font-black text-neutral-900 text-lg mb-1 tracking-tight">ئەپی BioKurd</h4>
            <p className="text-sm font-bold text-neutral-500 leading-relaxed">ڕاستەوخۆ ئەپەکە دابەزێنە سەر مۆبایلەکەت.</p>
          </div>
        </div>
        <button onClick={handleInstallClick} className="w-full py-3.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_4px_15px_rgba(249,115,22,0.3)] text-base mt-2 border border-orange-400">
          <Download size={20} strokeWidth={3} /> دابەزاندن (Install)
        </button>
      </>
    );
  };

  return (
    <AnimatePresence>
      {showInstall && (
        <motion.div initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 120, opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[380px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-neutral-200 p-5 z-[100] flex flex-col gap-3" dir="rtl">
          <button onClick={handleDismiss} className="absolute top-4 left-4 p-2 bg-neutral-100/80 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 rounded-full transition-all shadow-sm" title="داخستن"><X size={16} strokeWidth={3} /></button>
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}