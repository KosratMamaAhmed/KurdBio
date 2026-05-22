import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, Share2, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// لیستی تۆڕەکان بۆ هێنانەوەی وێنە و ڕەنگی بنەڕەتی لە کاتی پێویستدا
const DEFAULT_SOCIALS = [
  { id: 'facebook', name: 'فەیسبووک', iconName: 'Facebook', imageUrl: '/social/facebook.png', color: '#1877F2' },
  { id: 'instagram', name: 'ئینستاگرام', iconName: 'Instagram', imageUrl: '/social/instagram.png', color: '#E4405F' },
  { id: 'x', name: 'ئێکس (توییتەر)', iconName: 'Twitter', imageUrl: '/social/x.png', color: '#000000' },
  { id: 'youtube', name: 'یوتیوب', iconName: 'Youtube', imageUrl: '/social/youtube.png', color: '#FF0000' },
  { id: 'tiktok', name: 'تیکتۆک', iconName: 'Music', imageUrl: '/social/tiktok.png', color: '#000000' },
  { id: 'snapchat', name: 'سناپچات', iconName: 'Ghost', imageUrl: '/social/snapchat.png', color: '#FFFC00' },
  { id: 'linkedin', name: 'لینکدین', iconName: 'Linkedin', imageUrl: '/social/linkedin.png', color: '#0A66C2' },
  { id: 'telegram', name: 'تێلیگرام', iconName: 'Send', imageUrl: '/social/telegram.png', color: '#26A5E4' },
  { id: 'whatsapp', name: 'واتسئاپ', iconName: 'MessageCircle', imageUrl: '/social/whatsapp.png', color: '#25D366' },
  { id: 'asia', name: 'ئاسیا سێڵ', iconName: 'Phone', imageUrl: '/social/asia.png', color: '#ED1C24' },
  { id: 'korek', name: 'کۆڕەک تلیکۆم', iconName: 'Phone', imageUrl: '/social/korek.png', color: '#0054A6' },
  { id: 'fastpay', name: 'FastPay - فاستپەی', iconName: 'Copy', imageUrl: '/social/fastpay.png', color: '#E1137B' },
  { id: 'fib', name: 'FIB - بانکی یەکەمی عێراق', iconName: 'Copy', imageUrl: '/social/fib.png', color: '#8DC63F' },
  { id: 'qicard', name: 'Qi Card', iconName: 'Copy', imageUrl: '/social/qicard.png', color: '#231F20' },
  { id: 'custom', name: 'لینکێکی تایبەت (Custom)', iconName: 'Globe', imageUrl: '', color: '#333333' }
];

// 🌟 فەنکشنی دۆزینەوەی جۆری مۆبایل بۆ ڕیکلامی زیرەک 🌟
const getOS = () => {
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return 'ios';
  return 'other';
};

export default function PublicProfile() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showNotif, setShowNotif] = useState({ show: false, message: '' });

  const currentOS = getOS();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, settingsRes] = await Promise.all([
          fetch(`/api/public/profile/${slug}`),
          fetch(`/api/public/settings`)
        ]);

        if (!profileRes.ok) throw new Error('ئەم پرۆفایلە نەدۆزرایەوە یان ڕاگیراوە');
        
        const profileData = await profileRes.json();
        const settingsData = await settingsRes.json();

        if (profileData.error) throw new Error(profileData.error);

        setProfile(profileData);
        setSettings(settingsData);
        
        // 🚀 ڕیکوێستەکانی هەژمارکردنی ڤیووم لادا بۆ ئەوەی خەرجی سێرڤەر (KV) ببێتە سفر
        // fetch(`/api/public/visit/${slug}`, { method: 'POST' }).catch(() => {});

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfileData();
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: profile?.displayName || 'BioKurd', url }); } 
      catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerNotification = (msg: string) => {
    setShowNotif({ show: true, message: msg });
    setTimeout(() => setShowNotif({ show: false, message: '' }), 3000);
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    // 🚀 ڕیکوێستەکانی کلیکم لادا بۆ سفرکردنەوەی خەرجی (KV)
    // fetch(`/api/public/click/${slug}`, { method: 'POST' }).catch(() => {});
    
    // 🌟 سیستەمی کۆپیکردنی ڕاستەوخۆ 🌟
    if (url.startsWith('copy:')) {
      e.preventDefault();
      const textToCopy = url.replace('copy:', '');
      navigator.clipboard.writeText(textToCopy);
      triggerNotification(`بە سەرکەوتوویی کۆپیکرا: ${textToCopy}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50 p-4" dir="rtl">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center max-w-sm w-full border border-slate-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">ببوورە!</h2>
          <p className="text-slate-500 font-bold text-sm">{error || 'پرۆفایلەکە نەدۆزرایەوە'}</p>
          <a href="/" className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-colors w-full">
            گەڕانەوە بۆ سەرەتا
          </a>
        </div>
      </div>
    );
  }

  // 🌟 فلتەرکردنی ڕیکلامەکان بەپێی ئامێر (Smart Ads) 🌟
  const visibleAds = settings?.ads?.filter((ad: any) => 
    ad.isActive && (ad.targetOS === 'all' || ad.targetOS === currentOS)
  ) || [];

  const isCustomColors = profile.nameColor || profile.bioColor;

  return (
    <div className="min-h-[100dvh] relative overflow-hidden font-sans" dir="rtl">
      
      {/* Toast Notification بۆ کۆپیکردن */}
      <AnimatePresence>
         {showNotif.show && (
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-full bg-slate-900 text-white font-black text-sm shadow-2xl backdrop-blur-xl flex items-center gap-3 border border-white/20 whitespace-nowrap">
               <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check size={14} className="text-white" strokeWidth={3} />
               </div>
               {showNotif.message}
            </motion.div>
         )}
      </AnimatePresence>

      {/* باکگراوند */}
      <div className="fixed inset-0 z-0">
        <img src={profile.bgImage} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10 min-h-[100dvh] flex flex-col pt-12 sm:pt-16 pb-24 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[400px] w-full mx-auto flex flex-col items-center">
          
          <button onClick={handleShare} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg border border-white/10 z-20">
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>

          {/* وێنەی پرۆفایل */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-slate-100 mb-4 sm:mb-5 relative">
            <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            {profile.isPro && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-3 py-0.5 rounded-t-lg flex items-center gap-1 shadow-lg">
                <Star size={10} className="fill-white" /> VIP
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mb-2 text-center drop-shadow-lg" style={{ color: isCustomColors ? profile.nameColor : '#ffffff' }}>
            {profile.displayName}
          </h1>
          
          {profile.bio && (
            <p className="text-sm sm:text-base font-bold text-center px-4 mb-8 drop-shadow-md leading-relaxed whitespace-pre-wrap max-w-sm" style={{ color: isCustomColors ? profile.bioColor : 'rgba(255,255,255,0.9)' }}>
              {profile.bio}
            </p>
          )}

          {/* بەستەرەکان */}
          <div className="w-full space-y-3 sm:space-y-4 mb-10">
            {profile.links?.map((link: any, index: number) => {
               const platform = DEFAULT_SOCIALS.find(s => s.id === link.platformId) || DEFAULT_SOCIALS.find(s => s.id === 'facebook');
               const linkColor = link.color || platform?.color || '#333333';
               
               return (
                  <motion.a 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    key={link.id} href={link.url.startsWith('copy:') ? '#' : link.url} target={link.url.startsWith('copy:') ? '_self' : '_blank'} rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url)}
                    className="group relative w-full flex items-center p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[1.25rem] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg overflow-hidden"
                  >
                     <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-white flex items-center justify-center p-2.5 shadow-sm z-10 relative overflow-hidden">
                        {link.imageUrl ? (
                           <img src={link.imageUrl} alt={link.title} className="w-full h-full object-contain" />
                        ) : platform?.imageUrl ? (
                           <img src={platform.imageUrl} alt={link.title} className="w-full h-full object-contain" />
                        ) : null}
                     </div>
                     <div className="flex-1 text-center pr-2 pl-14 sm:pl-16 z-10">
                        <span className="font-black text-sm sm:text-base text-white drop-shadow-md truncate block px-2">
                           {link.title}
                        </span>
                     </div>
                     {/* ڕەنگی سێبەری لینکەکە بەپێی جۆری تۆڕەکە دەگۆڕێت */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${linkColor}, transparent)` }}></div>
                  </motion.a>
               );
            })}
          </div>

          {/* 🌟 ڕیکلامی زیرەک (Smart Ads) 🌟 */}
          {visibleAds.length > 0 && (
            <div className="w-full mt-2 space-y-4">
               {visibleAds.map((ad: any, index: number) => (
                  <motion.a 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: profile.links?.length * 0.05 + index * 0.1 }}
                    key={ad.id} href={ad.url} target="_blank" rel="noopener noreferrer"
                    className="block w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 relative group hover:scale-[1.02] transition-transform bg-black/20"
                  >
                     <div className="absolute top-3 right-3 bg-black/60 text-white/90 px-2 py-1 rounded-lg text-[10px] font-black backdrop-blur-md border border-white/20 z-10">
                        ڕیکلام
                     </div>
                     <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                     {ad.title && (
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                            <span className="text-white font-black text-sm">{ad.title}</span>
                         </div>
                     )}
                  </motion.a>
               ))}
            </div>
          )}

        </motion.div>
      </div>

      {/* دوگمەی دروستکردنی پرۆفایل لە خوارەوە */}
      <div className="fixed bottom-6 left-0 w-full flex justify-center z-30 pointer-events-none px-4">
        <a href="https://biokurd.com" className="pointer-events-auto bg-black/40 hover:bg-black/60 backdrop-blur-2xl border border-white/20 px-5 py-3 rounded-full flex items-center gap-3 text-white/90 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
          <span className="font-black text-sm tracking-tight">BioKurd</span>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:animate-ping"></div>
          <span className="text-[11px] font-bold opacity-80">پرۆفایلی خۆت دروست بکە</span>
        </a>
      </div>

    </div>
  );
}