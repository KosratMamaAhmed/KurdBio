import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, User, Share2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AppManager from '../components/AppManager'; // 🌟 زۆر گرنگە بۆ ئەوەی پەنجەرەی تیکتۆک لەم پەڕەیەش کار بکات

const OUTER_GLOW: Record<string, string> = {
  mockup: 'from-blue-600/10 via-transparent to-slate-900/30',
  light: 'from-slate-400/20 via-transparent to-gray-200/20',
  gold: 'from-amber-600/10 via-transparent to-yellow-700/10',
  neon: 'from-cyan-500/10 via-transparent to-blue-700/10',
  emerald: 'from-emerald-500/10 via-transparent to-teal-800/20',
  vintage: 'from-orange-700/10 via-transparent to-amber-900/20',
  crimson: 'from-red-600/10 via-transparent to-rose-900/20',
  navy: 'from-blue-700/10 via-transparent to-indigo-900/20',
  royal: 'from-fuchsia-600/10 via-transparent to-purple-900/20',
  minimal: 'from-gray-500/10 via-transparent to-slate-700/20',
  cyberpunk: 'from-pink-600/10 via-transparent to-yellow-600/10',
  glassmorphism: 'from-indigo-500/10 via-transparent to-purple-600/10',
  dracula: 'from-pink-500/10 via-transparent to-purple-800/20',
  aurora: 'from-green-500/10 via-transparent to-teal-600/10',
  sunset: 'from-orange-500/10 via-transparent to-rose-600/10',
  ocean: 'from-cyan-500/10 via-transparent to-blue-800/20',
  forest: 'from-emerald-600/10 via-transparent to-green-900/20',
  candy: 'from-pink-400/10 via-transparent to-sky-400/10',
  hacker: 'from-green-500/10 via-transparent to-lime-700/10',
  luxury: 'from-rose-400/10 via-transparent to-pink-700/10'
};

// 🌟 دیاریکردنی ڕەنگی دوگمەکان بەپێی جۆری لینکەکە 🌟
const getBrandStyle = (url: string) => {
  if (!url) return { bg: 'rgba(255, 255, 255, 0.1)', text: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)' };
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp')) return { bg: '#25D366', text: '#fff' };
  if (lowerUrl.includes('instagram')) return { bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', text: '#fff' };
  if (lowerUrl.includes('snapchat')) return { bg: '#FFFC00', text: '#000' };
  if (lowerUrl.includes('facebook') || lowerUrl.includes('fb.me')) return { bg: '#1877F2', text: '#fff' };
  if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram')) return { bg: '#0088cc', text: '#fff' };
  if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) return { bg: '#FF0000', text: '#fff' };
  if (lowerUrl.includes('tiktok')) return { bg: '#000000', text: '#fff', border: '1px solid #333' };
  if (lowerUrl.includes('x.com') || lowerUrl.includes('twitter')) return { bg: '#000000', text: '#fff', border: '1px solid #333' };
  
  return { bg: 'rgba(255, 255, 255, 0.1)', text: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)' };
};

export default function PublicProfile({ settings }: { settings?: any }) {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [copied, setCopied] = useState(false); // 🌟 ستەیتی کۆپیکردنی لینک

  useEffect(() => {
    if (!slug) return;
    
    const cacheKey = `biokurd_cache_${slug}`;
    const localData = localStorage.getItem(cacheKey);
    if (localData) { setProfile(JSON.parse(localData)); setLoading(false); }

    fetch(`/api/public/profile/${slug}`)
      .then(async res => { if (!res.ok) throw new Error((await res.json()).error || 'هەڵە'); return res.json(); })
      .then(data => { if (JSON.stringify(data) !== localData) { setProfile(data); localStorage.setItem(cacheKey, JSON.stringify(data)); } setLoading(false); })
      .catch((err) => { if (!localData) setError(err.message); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (profile?.id && slug) {
      const visitKey = `visited_profile_${slug}`;
      const lastVisit = localStorage.getItem(visitKey);
      if (!lastVisit || Date.now() - parseInt(lastVisit) > 24 * 60 * 60 * 1000) {
        fetch(`/api/public/visit/${slug}`, { method: 'POST' }).catch(() => {});
        localStorage.setItem(visitKey, Date.now().toString());
      }
    }
  }, [profile?.id, slug]);

  const handleLinkClick = (url: string, linkId: number) => {
    if(!url) return;
    
    const clickKey = `clicked_link_${slug}_${linkId}`;
    const lastClick = localStorage.getItem(clickKey);
    if (!lastClick || Date.now() - parseInt(lastClick) > 24 * 60 * 60 * 1000) {
      fetch(`/api/public/click/${slug}`, { method: 'POST' }).catch(() => {});
      localStorage.setItem(clickKey, Date.now().toString());
    }

    if(url.endsWith('.apk')) { 
      window.location.href = url; 
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isInAppBrowser = /tiktok|bytedance|instagram|fban|fbav|snapchat/.test(ua);

    let finalUrl = url;

    try {
      if (url.includes('wa.me/') || url.includes('api.whatsapp.com/')) {
        const phone = url.split('wa.me/')[1]?.split('?')[0]?.replace(/[^0-9+]/g, '') || url.split('phone=')[1]?.split('&')[0]?.replace(/[^0-9+]/g, '');
        if (phone) finalUrl = isAndroid ? `intent://send?phone=${phone}#Intent;scheme=whatsapp;package=com.whatsapp;end` : `whatsapp://send?phone=${phone}`;
      } 
      else if (url.includes('instagram.com/')) {
        const username = url.split('instagram.com/')[1]?.split('/')[0]?.split('?')[0];
        if (username) finalUrl = isAndroid ? `intent://user?username=${username}#Intent;scheme=instagram;package=com.instagram.android;end` : `instagram://user?username=${username}`;
      } 
      else if (url.includes('snapchat.com/add/')) {
        const username = url.split('snapchat.com/add/')[1]?.split('?')[0];
        if (username) finalUrl = isAndroid ? `intent://add/${username}#Intent;scheme=snapchat;package=com.snapchat.android;end` : `snapchat://add/${username}`;
      } 
      else if (url.includes('t.me/') || url.includes('telegram.me/')) {
        const username = url.split('.me/')[1]?.split('?')[0];
        if (username) finalUrl = isAndroid ? `intent://resolve?domain=${username}#Intent;scheme=tg;package=org.telegram.messenger;end` : `tg://resolve?domain=${username}`;
      } 
      else if (url.includes('facebook.com/')) {
        const pageId = url.split('facebook.com/')[1]?.split('/')[0]?.split('?')[0];
        if (pageId && pageId !== 'profile.php') {
            finalUrl = isAndroid ? `intent://page/${pageId}#Intent;scheme=fb;package=com.facebook.katana;end` : `fb://profile/${pageId}`;
        }
      }
    } catch (e) {
      console.error("Deep link error", e);
    }

    if (isInAppBrowser) {
        try { window.top!.location.href = finalUrl; } catch(e) { window.location.href = finalUrl; }
        if (finalUrl !== url) { setTimeout(() => { window.location.href = url; }, 2000); }
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // 🌟 فانکشنی کۆپیکردنی لینک 🌟
  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = async () => {
    if (downloadingCard) return;
    setDownloadingCard(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1050; canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      ctx.fillStyle = '#111111';
      ctx.fillRect(0,0,1050,600);

      const goldGrad = ctx.createLinearGradient(0,0, 600, 600);
      goldGrad.addColorStop(0, '#fbbf24');
      goldGrad.addColorStop(1, '#d97706');
      
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(450, 0); ctx.bezierCurveTo(600, 200, 350, 400, 500, 600); ctx.lineTo(0, 600); ctx.closePath();
      ctx.fillStyle = goldGrad; ctx.fill();

      const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve) => {
        const img = new window.Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = () => resolve(img); img.src = src;
      });

      const rightCenterX = 775; const avatarY = 200; const avatarR = 85;

      ctx.beginPath(); ctx.arc(rightCenterX, avatarY, avatarR + 6, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();

      if (profile?.avatarUrl) {
        try {
          const avatarImg = await loadImage(profile.avatarUrl);
          ctx.save(); ctx.beginPath(); ctx.arc(rightCenterX, avatarY, avatarR, 0, Math.PI * 2); ctx.clip();
          ctx.drawImage(avatarImg, rightCenterX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2); ctx.restore();
        } catch { ctx.beginPath(); ctx.arc(rightCenterX, avatarY, avatarR, 0, Math.PI*2); ctx.fillStyle = '#27272a'; ctx.fill(); }
      } else {
        ctx.beginPath(); ctx.arc(rightCenterX, avatarY, avatarR, 0, Math.PI*2); ctx.fillStyle = '#27272a'; ctx.fill();
      }

      ctx.fillStyle = '#fbbf24'; ctx.font = '900 48px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(profile?.displayName || 'کۆسرەت مامە', rightCenterX, 310, 450);

      ctx.fillStyle = '#ffffff'; ctx.font = '500 24px sans-serif';
      const wrapText = (context: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
          const words = text.split(' '); let line = '';
          for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (context.measureText(testLine).width > maxWidth && n > 0) { context.fillText(line.trim(), x, y); line = words[n] + ' '; y += lineHeight; } else { line = testLine; }
          }
          context.fillText(line.trim(), x, y);
      };
      wrapText(ctx, profile?.bio || 'باشترین بەستەرەکانم لێرە ببینە', rightCenterX, 380, 450, 36);

      const leftCenterX = 240; const profileUrl = `${window.location.origin}/${slug}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&margin=1&color=d97706`;
      const qrRes = await fetch(qrUrl); const qrBlob = await qrRes.blob();
      const qrImg = new Image(); qrImg.src = URL.createObjectURL(qrBlob);
      
      await new Promise(r => qrImg.onload = r);
      
      ctx.fillStyle = '#ffffff';
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(80, 100, 320, 320, 24); ctx.fill(); } else { ctx.fillRect(80, 100, 320, 320); }
      ctx.drawImage(qrImg, 90, 110, 300, 300);

      ctx.fillStyle = '#000000'; ctx.font = '900 22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('سکانم بکە بۆ بینینی سەرجەم بەستەرەکانم', leftCenterX, 450);

      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('https://biokurd.com', 1020, 560);

      const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = `BioKurd_Card_${slug}.png`; a.click();
    } catch (e) {
      alert("کێشەیەک هەیە لە داگرتنی کارتەکە.");
    } finally {
      setDownloadingCard(false);
    }
  };

  if (loading) return <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !profile) return <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-center"><AlertCircle className="text-red-500 mb-4" size={48} /><h2 className="text-2xl font-black text-white mb-2">پرۆفایل نەدۆزرایەوە</h2><p className="text-white/50 font-bold mb-8">{error || 'ئەم لینکە بوونی نییە یان سڕاوەتەوە.'}</p><Link to="/" className="px-8 py-4 bg-white text-black rounded-2xl font-black shadow-xl hover:scale-105 transition">گەڕانەوە بۆ سەرەتا</Link></div>;

  const activeAds = settings?.ads?.filter((ad: any) => ad.isActive !== false) || [];
  const globalBtns = settings?.globalButtons || [];
  const sponsoredLinks = [ ...globalBtns.map((b:any) => ({ id: b.id, title: b.title, url: b.url, imageUrl: b.imageUrl, iconName: b.icon })), ...activeAds.map((a:any) => ({ id: a.id, title: a.title, url: a.url, imageUrl: a.imageUrl })) ];

  const allLinks = [...(profile.links || []), ...sponsoredLinks];
  
  const themeId = profile.theme || 'mockup';
  const backgroundGlow = OUTER_GLOW[themeId] || OUTER_GLOW.mockup;

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-start bg-[#050505] pt-12 sm:pt-16 px-4 overflow-y-auto overflow-x-hidden relative touch-manipulation pb-36 font-sans`} dir="rtl">
       
       <AppManager />

       {/* 🌟 باکگراوندە تاریکە درەوشاوەکەی پێشوو 🌟 */}
       <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGlow} opacity-60 z-0 pointer-events-none fixed`}></div>
       <div className="absolute inset-0 z-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none fixed"></div>
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-gradient-to-r ${backgroundGlow} rounded-[100%] blur-[100px] opacity-40 pointer-events-none z-0 fixed`}></div>

       <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
         
         {/* 🌟 دوگمەی شەیر / کۆپیکردنی لینک 🌟 */}
         <button 
           onClick={handleCopyLink}
           className="absolute -top-4 right-0 p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white backdrop-blur-md transition-all z-20 flex items-center justify-center shadow-lg"
           title="کۆپیکردنی لینک"
         >
           {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
         </button>

         {/* وێنەی پرۆفایل */}
         {profile.avatarUrl ? (
           <img 
             src={profile.avatarUrl} 
             alt={profile.displayName} 
             className="w-24 h-24 rounded-full object-cover shadow-[0_0_20px_rgba(255,255,255,0.1)] border-2 border-white/10"
           />
         ) : (
           <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-white/50 border-2 border-white/10">
             بەتاڵ
           </div>
         )}

         {/* ناو و بایۆ (ڕەنگی سپی چونکە باکگراوند ڕەشە) */}
         <h1 className="text-xl font-bold text-white mt-4 text-center drop-shadow-md">
           {profile.displayName}
         </h1>
         {profile.bio && (
           <p className="text-white/70 mt-2 text-center text-sm px-2 leading-relaxed drop-shadow-sm">
             {profile.bio}
           </p>
         )}

         {/* 🌟 بەشی دوگمەکان (بە ڕەنگی براندەکان و ئایکۆنەکانەوە) 🌟 */}
         <div className="w-full mt-8 flex flex-col gap-3 mb-12">
           {allLinks.map((link: any, index: number) => {
             const brandStyle = getBrandStyle(link.url);
             
             return (
               <button
                 key={link.id || index}
                 onClick={() => handleLinkClick(link.url, link.id)}
                 style={{
                   background: brandStyle.bg,
                   color: brandStyle.text,
                   border: brandStyle.border || 'none'
                 }}
                 className="w-full py-3 px-4 rounded-xl shadow-lg font-medium text-sm hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-between overflow-hidden relative group"
               >
                 {/* ئایکۆن یان پیتی یەکەم */}
                 <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center bg-black/20 overflow-hidden shadow-inner p-1.5">
                   {link.imageUrl ? (
                     <img src={link.imageUrl} alt="icon" className="w-full h-full object-contain drop-shadow-md" />
                   ) : (
                     <span className="text-lg font-bold opacity-80">{link.title?.charAt(0) || '🔗'}</span>
                   )}
                 </div>
                 
                 {/* تایتڵی دوگمە */}
                 <span className="flex-grow text-center px-2 z-10 drop-shadow-md font-bold">{link.title}</span>
                 
                 {/* بۆشایی بۆ باڵانس ڕاگرتنی دەقەکە لە ناوەڕاست */}
                 <div className="w-9 h-9 flex-shrink-0"></div>
               </button>
             );
           })}
         </div>

         {/* 🌟 بەشی دیزاینی کارتی بزنس 🌟 */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="relative w-full max-w-[24rem] sm:max-w-[26rem] aspect-[1.75/1] mx-auto mb-6 rounded-[1.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] group cursor-pointer border border-neutral-800 bg-[#111111]"
            onClick={handleDownloadCard}
         >
            <div className="absolute inset-0 pointer-events-none">
               <svg viewBox="0 0 1050 600" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full">
                  <defs>
                     <linearGradient id="goldGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                     </linearGradient>
                  </defs>
                  <path d="M 0,0 L 450,0 C 600,200 350,400 500,600 L 0,600 Z" fill="url(#goldGradCard)" />
               </svg>
            </div>
            
            <div className="relative z-10 w-full h-full flex p-3 sm:p-4">
               <div className="w-[55%] flex flex-col items-center justify-center h-full relative order-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1 rounded-full shadow-lg mb-2 border-2 border-[#fbbf24] overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                     {profile?.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full" /> : <User className="w-full h-full p-2 text-neutral-300" />}
                  </div>
                  <h3 className="text-[14px] sm:text-[18px] font-black drop-shadow-md text-[#fbbf24] line-clamp-1 w-full text-center px-1">{profile?.displayName || 'کۆسرەت مامە'}</h3>
                  <p className="text-[8px] sm:text-[10px] font-bold text-white mt-1.5 line-clamp-2 leading-relaxed text-center px-2 w-full opacity-90">{profile?.bio || 'باشترین بەستەرەکانم لێرە ببینە'}</p>
                  <span className="absolute bottom-0 right-1 text-[7px] sm:text-[9px] font-bold text-white opacity-60">https://biokurd.com</span>
               </div>
               <div className="w-[45%] flex flex-col items-center justify-center h-full order-2 pt-2">
                  <div className="w-[70%] aspect-square bg-white p-1.5 rounded-2xl shadow-xl relative group-hover:scale-105 transition-transform duration-300">
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/' + slug)}&margin=1&color=d97706`} className="w-full h-full rounded-xl" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-black text-white/90 mt-3 sm:mt-4 text-center w-full px-1 leading-tight">سکانم بکە بۆ بینینی سەرجەم بەستەرەکانم</span>
               </div>
            </div>
            
            {downloadingCard && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
         </motion.div>

       </div>
    </div>
  );
}