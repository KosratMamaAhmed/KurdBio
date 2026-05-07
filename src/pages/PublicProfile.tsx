import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import AppManager from '../components/AppManager'; // 🌟 زۆر گرنگە بۆ ئەوەی پەنجەرەی تیکتۆک لەم پەڕەیەش کار بکات

export default function PublicProfile({ settings }: { settings?: any }) {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingCard, setDownloadingCard] = useState(false); // 🌟 ستەیتی داگرتنی کارتەکە

  useEffect(() => {
    if (!slug) return;
    
    // 🌟 ئەم بەشە زۆر نایابە و (KV Read) کەم دەکاتەوە 🌟
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

    // گۆڕینی لینکەکان بۆ ئەوەی ڕاستەوخۆ بەرنامەکە بکاتەوە (Deep Linking)
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
        // ئەمە دیوارەکانی تیکتۆک دەشکێنێت و ڕاستەوخۆ دەچێتە بەرنامەکە
        try {
            window.top!.location.href = finalUrl;
        } catch(e) {
            window.location.href = finalUrl;
        }
        
        if (finalUrl !== url) {
            setTimeout(() => {
                window.location.href = url;
            }, 2000);
        }
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // 🌟 فانکشنی داگرتنی کارتی بزنس 🌟
  const handleDownloadCard = async () => {
    if (downloadingCard) return;
    setDownloadingCard(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1050; canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      // ١. باکگراوندی ڕەش
      ctx.fillStyle = '#111111';
      ctx.fillRect(0,0,1050,600);

      // ٢. دیزاینی گۆڵدی ناڕێک
      const goldGrad = ctx.createLinearGradient(0,0, 600, 600);
      goldGrad.addColorStop(0, '#fbbf24');
      goldGrad.addColorStop(1, '#d97706');
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(450, 0);
      ctx.bezierCurveTo(600, 200, 350, 400, 500, 600); 
      ctx.lineTo(0, 600);
      ctx.closePath();
      ctx.fillStyle = goldGrad;
      ctx.fill();

      const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve) => {
        const img = new window.Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = () => resolve(img); img.src = src;
      });

      // ٣. وێنەی پرۆفایل و ناو (ڕەش)
      const rightCenterX = 775;
      const avatarY = 200;
      const avatarR = 85;

      ctx.beginPath();
      ctx.arc(rightCenterX, avatarY, avatarR + 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24'; 
      ctx.fill();

      if (profile?.avatarUrl) {
        try {
          const avatarImg = await loadImage(profile.avatarUrl);
          ctx.save();
          ctx.beginPath(); ctx.arc(rightCenterX, avatarY, avatarR, 0, Math.PI * 2); ctx.clip();
          ctx.drawImage(avatarImg, rightCenterX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
          ctx.restore();
        } catch { ctx.beginPath(); ctx.arc(rightCenterX, avatarY, avatarR, 0, Math.PI*2); ctx.fillStyle = '#27272a'; ctx.fill(); }
      } else {
        ctx.beginPath(); ctx.arc(rightCenterX, avatarY, avatarR, 0, Math.PI*2); ctx.fillStyle = '#27272a'; ctx.fill();
      }

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(profile?.displayName || 'کۆسرەت مامە', rightCenterX, 310, 450);

      ctx.fillStyle = '#ffffff';
      ctx.font = '500 24px sans-serif';
      const wrapText = (context: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
          const words = text.split(' '); let line = '';
          for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (context.measureText(testLine).width > maxWidth && n > 0) {
              context.fillText(line.trim(), x, y); line = words[n] + ' '; y += lineHeight;
            } else { line = testLine; }
          }
          context.fillText(line.trim(), x, y);
      };
      wrapText(ctx, profile?.bio || 'باشترین بەستەرەکانم لێرە ببینە', rightCenterX, 380, 450, 36);

      // ٤. بارکۆد (گۆڵد)
      const leftCenterX = 240;
      const profileUrl = `${window.location.origin}/${slug}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&margin=1&color=d97706`;
      const qrRes = await fetch(qrUrl);
      const qrBlob = await qrRes.blob();
      const qrImg = new Image();
      qrImg.src = URL.createObjectURL(qrBlob);
      
      await new Promise(r => qrImg.onload = r);
      
      ctx.fillStyle = '#ffffff';
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(80, 100, 320, 320, 24); ctx.fill(); } 
      else { ctx.fillRect(80, 100, 320, 320); }
      ctx.drawImage(qrImg, 90, 110, 300, 300);

      ctx.fillStyle = '#000000';
      ctx.font = '900 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('سکانم بکە بۆ بینینی سەرجەم بەستەرەکانم', leftCenterX, 450);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('https://biokurd.com', 1020, 560);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `BioKurd_Card_${slug}.png`;
      a.click();
    } catch (e) {
      alert("کێشەیەک هەیە لە داگرتنی کارتەکە.");
    } finally {
      setDownloadingCard(false);
    }
  };

  if (loading) return (
    <div className="min-h-[100dvh] bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">پرۆفایل نەدۆزرایەوە</h2>
      <p className="text-gray-500 mb-8">{error || 'ئەم لینکە بوونی نییە یان سڕاوەتەوە.'}</p>
      <Link to="/" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium shadow-md hover:bg-gray-800 transition">گەڕانەوە بۆ سەرەتا</Link>
    </div>
  );

  const activeAds = settings?.ads?.filter((ad: any) => ad.isActive !== false) || [];
  const globalBtns = settings?.globalButtons || [];
  const sponsoredLinks = [ ...globalBtns.map((b:any) => ({ id: b.id, title: b.title, url: b.url, imageUrl: b.imageUrl, iconName: b.icon })), ...activeAds.map((a:any) => ({ id: a.id, title: a.title, url: a.url, imageUrl: a.imageUrl })) ];

  const allLinks = [...(profile.links || []), ...sponsoredLinks];

  return (
    <div className="min-h-[100dvh] w-full bg-white flex flex-col items-center pt-10 sm:pt-16 px-4 pb-20 font-sans" dir="rtl">
       
       <AppManager />

       <div className="w-full max-w-md mx-auto flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
         
         {/* وێنەی پرۆفایل */}
         {profile.avatarUrl ? (
           <img 
             src={profile.avatarUrl} 
             alt={profile.displayName} 
             className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-100"
           />
         ) : (
           <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
             بەتاڵ
           </div>
         )}

         {/* ناو و بایۆ */}
         <h1 className="text-xl font-bold text-gray-900 mt-4 text-center">
           {profile.displayName}
         </h1>
         {profile.bio && (
           <p className="text-gray-600 mt-2 text-center text-sm px-2 leading-relaxed">
             {profile.bio}
           </p>
         )}

         {/* بەشی دوگمەکان و بەستەرەکان */}
         <div className="w-full mt-8 flex flex-col gap-3 mb-10">
           {allLinks.map((link: any, index: number) => (
             <button
               key={link.id || index}
               onClick={() => handleLinkClick(link.url, link.id)}
               className="w-full py-3.5 px-4 bg-white border border-gray-200 text-gray-800 rounded-xl shadow-sm font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] flex items-center justify-center"
             >
               {link.title}
             </button>
           ))}
         </div>

         {/* 🌟 بەشی دیزاینی کارتی بزنس 🌟 */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="relative w-full max-w-[24rem] sm:max-w-[26rem] aspect-[1.75/1] mx-auto mb-6 rounded-[1.5rem] overflow-hidden shadow-2xl group cursor-pointer border border-neutral-800 bg-[#111111]"
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
                  <span className="text-[8px] sm:text-[10px] font-black text-black mt-3 sm:mt-4 text-center w-full px-1 leading-tight">سکانم بکە بۆ بینینی سەرجەم بەستەرەکانم</span>
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