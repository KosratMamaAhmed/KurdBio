import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, User, Share2, Check, Star, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppManager from '../components/AppManager';

const FontStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @font-face {
      font-family: 'Kosrat';
      src: url('/font/kosrat.ttf') format('truetype');
      font-display: swap;
    }
    .font-kosrat { 
      font-family: 'Kosrat', 'Noto Sans Arabic', sans-serif !important; 
    }
  `}} />
);

const getBrandStyle = (url: string, dbColor?: string) => {
  const lowerUrl = (url || '').toLowerCase();
  
  if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp')) return { bg: '#25D366', text: '#fff' };
  if (lowerUrl.includes('instagram')) return { bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', text: '#fff' };
  if (lowerUrl.includes('snapchat')) return { bg: '#FFFC00', text: '#000' };
  if (lowerUrl.includes('facebook') || lowerUrl.includes('fb.me')) return { bg: '#1877F2', text: '#fff' };
  if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram')) return { bg: '#26A5E4', text: '#fff' };
  if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) return { bg: '#FF0000', text: '#fff' };
  if (lowerUrl.includes('tiktok')) return { bg: '#000000', text: '#fff' };
  if (lowerUrl.includes('x.com') || lowerUrl.includes('twitter')) return { bg: '#000000', text: '#fff' };
  if (lowerUrl.includes('linkedin')) return { bg: '#0A66C2', text: '#fff' };
  if (lowerUrl.includes('viber')) return { bg: '#7360F2', text: '#fff' };
  if (lowerUrl.includes('discord')) return { bg: '#5865F2', text: '#fff' };
  if (lowerUrl.includes('tel:')) return { bg: '#10B981', text: '#fff' };
  
  if (dbColor && dbColor !== '#333333' && dbColor !== '') {
     return { bg: dbColor, text: '#fff', border: 'none' };
  }
  
  return { bg: '#ffffff', text: '#1f2937', border: '1px solid #e5e7eb' };
};

const VerifiedBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92898C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92898 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92898L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92898 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#1d9bf0"/>
    <path d="M10.3333 14.3333L7.16667 11.1667L8.10833 10.225L10.3333 12.45L15.8917 6.89167L16.8333 7.83333L10.3333 14.3333Z" fill="white"/>
  </svg>
);

export default function PublicProfile({ settings }: { settings?: any }) {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const profileUrl = `${window.location.origin}/${slug}`;

  useEffect(() => {
    if (!slug) return;
    
    const cacheKey = `biokurd_cache_${slug}`;
    const localData = localStorage.getItem(cacheKey);
    if (localData) { setProfile(JSON.parse(localData)); setLoading(false); }

    fetch(`/api/public/profile/${slug}?_t=${Date.now()}`)
      .then(async res => { if (!res.ok) throw new Error((await res.json()).error || 'هەڵە'); return res.json(); })
      .then(data => { if (JSON.stringify(data) !== localData) { setProfile(data); localStorage.setItem(cacheKey, JSON.stringify(data)); } setLoading(false); })
      .catch((err) => { if (!localData) setError(err.message); setLoading(false); });
  }, [slug]);

  // 🌟 بەهێزترین سیستەمی ناردنی سەردان بۆ باکێند (کاتی چاوەڕوانی کرا بە ٥٠٠ میللی چرکە بۆ تێست) 🌟
  useEffect(() => {
    if (profile?.id && slug) {
      const visitKey = `visited_v3_${slug}`;
      const lastVisit = sessionStorage.getItem(visitKey);
      if (!lastVisit || Date.now() - parseInt(lastVisit) > 500) { 
        fetch(`/api/public/v/${slug}?_t=${Date.now()}`, { method: 'POST', headers: {'Content-Type': 'application/json'} }).catch(() => {});
        sessionStorage.setItem(visitKey, Date.now().toString());
      }
    }
  }, [profile?.id, slug]);

  const handleLinkClick = (url: string, linkId: number) => {
    if(!url) return;
    
    // 🌟 ناردنی کلیک ڕاستەوخۆ 🌟
    const clickKey = `clicked_v3_${slug}_${linkId}`;
    const lastClick = sessionStorage.getItem(clickKey);
    if (!lastClick || Date.now() - parseInt(lastClick) > 500) {
      fetch(`/api/public/c/${slug}?_t=${Date.now()}`, { method: 'POST', headers: {'Content-Type': 'application/json'} }).catch(() => {});
      sessionStorage.setItem(clickKey, Date.now().toString());
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadCard = async () => {
    if (downloadingCard) return;
    setDownloadingCard(true);
    try {
      try { await document.fonts.load('48px "Kosrat"'); } catch (e) {}

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

      ctx.fillStyle = '#fbbf24'; 
      ctx.font = '900 48px "Kosrat", sans-serif'; 
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(profile?.displayName || 'کۆسرەت مامە', rightCenterX, 310, 450);

      ctx.fillStyle = '#ffffff'; 
      ctx.font = '500 24px "Kosrat", sans-serif';
      const wrapText = (context: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
          const words = text.split(' '); let line = '';
          for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (context.measureText(testLine).width > maxWidth && n > 0) { context.fillText(line.trim(), x, y); line = words[n] + ' '; y += lineHeight; } else { line = testLine; }
          }
          context.fillText(line.trim(), x, y);
      };
      wrapText(ctx, profile?.bio || 'باشترین بەستەرەکانم لێرە ببینە', rightCenterX, 380, 450, 36);

      const leftCenterX = 240;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&margin=1&color=d97706`;
      const qrRes = await fetch(qrUrl); const qrBlob = await qrRes.blob();
      const qrImg = new window.Image(); qrImg.src = URL.createObjectURL(qrBlob);
      
      await new Promise(r => qrImg.onload = r);
      
      ctx.fillStyle = '#ffffff';
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(80, 100, 320, 320, 24); ctx.fill(); } else { ctx.fillRect(80, 100, 320, 320); }
      ctx.drawImage(qrImg, 90, 110, 300, 300);

      ctx.fillStyle = '#000000'; 
      ctx.font = '900 22px "Kosrat", sans-serif'; 
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('سکانم بکە بۆ بینینی سەرجەم بەستەرەکانم', leftCenterX, 450);

      ctx.fillStyle = '#ffffff'; 
      ctx.font = 'bold 18px "Kosrat", sans-serif'; 
      ctx.textAlign = 'right';
      ctx.fillText('https://biokurd.com', 1020, 560);

      const dataUrl = canvas.toDataURL('image/png');
      const filename = `BioKurd_Card_${slug}.png`;

      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;

      if (isIOS) {
        try {
           const blob = await (await fetch(dataUrl)).blob();
           const file = new File([blob], filename, { type: 'image/png' });
           if (navigator.canShare && navigator.canShare({ files: [file] })) {
               await navigator.share({
                   files: [file],
                   title: 'کارتەکەم لە BioKurd',
               });
               return; 
           }
        } catch (err) { console.error("Share failed", err); }
        
        const newWindow = window.open();
        if (newWindow) {
           newWindow.document.write(`
             <html>
             <body style="margin:0; background:#111; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:white; font-family:sans-serif;">
                <img src="${dataUrl}" style="max-width:90%; border-radius:12px; box-shadow:0 10px 20px rgba(0,0,0,0.5);" />
                <p style="margin-top:20px; font-weight:bold;">پەنجە بنێ بە وێنەکەدا بۆ داگرتن (Save Image)</p>
             </body>
             </html>
           `);
           newWindow.document.title = "کارتەکەم";
        } else {
           const a = document.createElement('a'); a.href = dataUrl; a.download = filename; a.click();
        }
      } else {
        const a = document.createElement('a'); a.href = dataUrl; a.download = filename; a.click();
      }

    } catch (e) {
      alert("کێشەیەک هەیە لە داگرتنی کارتەکە.");
    } finally {
      setDownloadingCard(false);
    }
  };

  if (loading) return <div className="min-h-[100dvh] bg-white flex items-center justify-center font-kosrat"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !profile) return <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center p-6 text-center font-kosrat"><AlertCircle className="text-red-500 mb-4" size={48} /><h2 className="text-2xl font-black text-gray-900 mb-2">پرۆفایل نەدۆزرایەوە</h2><p className="text-gray-500 font-bold mb-8">{error || 'ئەم لینکە بوونی نییە یان سڕاوەتەوە.'}</p><Link to="/" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition">گەڕانەوە بۆ سەرەتا</Link></div>;

  const activeAds = settings?.ads?.filter((ad: any) => ad.isActive !== false) || [];
  const globalBtns = settings?.globalButtons || [];
  const normalLinks = [...(profile.links || []), ...globalBtns.map((b:any) => ({ id: b.id, title: b.title, url: b.url, imageUrl: b.imageUrl, iconName: b.icon, color: b.color }))];

  const bgPosStyle = profile?.bgPos ? `${profile.bgPos.x}% ${profile.bgPos.y}%` : '50% 50%';
  const avatarPosStyle = profile?.avatarPos ? `${profile.avatarPos.x}% ${profile.avatarPos.y}%` : '50% 50%';

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-start bg-slate-50 overflow-x-hidden relative touch-manipulation pb-[calc(env(safe-area-inset-bottom)+8rem)] font-kosrat" dir="rtl">
       
       <FontStyle />
       <AppManager />

       {/* 🌟 باکگراوندی گەورەتر بە لێواری کەوانەیی (Rounded) 🌟 */}
       <div className="w-full h-[45vh] sm:h-[50vh] min-h-[320px] relative bg-gradient-to-r from-gray-200 to-gray-300 shrink-0 z-0 rounded-b-[2.5rem] sm:rounded-b-[3.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden border-b border-neutral-200/50">
          {profile?.bgImage && (
             <img 
                src={profile.bgImage} 
                className="w-full h-full object-cover" 
                style={{ objectPosition: bgPosStyle }} 
                alt="Cover" 
             />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/5 to-transparent"></div>
          
          <div className="absolute right-4 sm:right-6 flex flex-col items-end z-30" style={{ top: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
            <button 
               onClick={handleCopyLink}
               className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white transition-all shadow-sm flex items-center justify-center"
               title="کۆپیکردنی لینک"
            >
               {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
            </button>
            <AnimatePresence>
               {copied && (
                 <motion.div 
                   initial={{ opacity: 0, y: 5, scale: 0.9 }} 
                   animate={{ opacity: 1, y: 0, scale: 1 }} 
                   exit={{ opacity: 0, scale: 0.9 }} 
                   className="mt-2 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-white text-[10px] sm:text-xs font-bold shadow-lg whitespace-nowrap" 
                   dir="ltr"
                 >
                    {profileUrl} کۆپیکرا
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
       </div>

       <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center animate-[fadeIn_0.5s_ease-out] px-4 -mt-20 sm:-mt-24">
         
         {/* 🌟 وێنەی پرۆفایلی جیاکراوە لەگەڵ درۆپ شادۆ 🌟 */}
         <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-[3px] bg-white/40 backdrop-blur-xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] mb-4">
            <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white bg-white">
               {profile?.avatarUrl ? (
                 <img 
                   src={profile.avatarUrl} 
                   alt={profile.displayName} 
                   className="w-full h-full object-cover scale-105"
                   style={{ objectPosition: avatarPosStyle }}
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                   بەتاڵ
                 </div>
               )}
            </div>
            {profile?.isPro && (
               <div className="absolute bottom-1.5 right-1.5 z-30 bg-white rounded-full p-[2px] shadow-md">
                  <VerifiedBadge className="w-8 h-8 text-blue-500 drop-shadow-sm" />
               </div>
            )}
         </div>

         {/* 🌟 ناوی پرۆفایل و بایۆ کە ڕەنگەکانیان بە دڵی بەکارهێنەر دەگۆڕێت 🌟 */}
         <h1 className="text-2xl font-black mt-2 text-center drop-shadow-sm" style={{ color: profile?.nameColor || '#1f2937' }}>
           {profile.displayName}
         </h1>
         {profile.bio && (
           <p className="mt-2 text-center text-sm px-2 leading-relaxed font-bold drop-shadow-sm" style={{ color: profile?.bioColor || '#4b5563' }}>
             {profile.bio}
           </p>
         )}

         <div className="w-full mt-8 flex flex-col gap-3">
           {normalLinks.map((link: any, index: number) => {
             const brandStyle = getBrandStyle(link.url, link.color);
             return (
               <button
                 key={link.id || index}
                 onClick={() => handleLinkClick(link.url, link.id)}
                 style={{ background: brandStyle.bg, color: brandStyle.text, border: brandStyle.border || 'none' }}
                 className="w-full py-3.5 px-4 rounded-xl shadow-sm font-bold text-sm hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-between overflow-hidden relative group"
               >
                 <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner p-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                   {link.imageUrl ? <img src={link.imageUrl} alt="icon" className="w-full h-full object-contain drop-shadow-sm" /> : <span className="text-lg opacity-80">{link.title?.charAt(0) || '🔗'}</span>}
                 </div>
                 <span className="flex-grow text-center px-2 z-10">{link.title}</span>
                 <div className="w-9 h-9 flex-shrink-0"></div>
               </button>
             );
           })}
         </div>

         {activeAds.length > 0 && (
           <div className="w-full mt-8 mb-6 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-3 mb-2 opacity-60">
                <div className="h-[1px] flex-1 bg-gray-300"></div>
                <span className="text-[10px] font-black px-2 py-1 rounded-md border border-gray-200 text-gray-500 tracking-widest bg-gray-100/50">سپۆنسەرکراو</span>
                <div className="h-[1px] flex-1 bg-gray-300"></div>
              </div>

              {activeAds.map((ad: any, idx: number) => (
                 <a key={idx} href={ad.url} target="_blank" rel="noopener noreferrer" className="relative w-full group transition-transform hover:scale-[1.02] active:scale-95 shadow-sm block">
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md shadow-lg z-20 rotate-[-10deg] border border-orange-200/50">VIP</div>
                    
                    <div className="relative z-10 w-full bg-white rounded-2xl p-3 sm:p-4 flex items-center justify-between border-2 border-orange-100 shadow-[0_4px_20px_rgba(249,115,22,0.1)] overflow-hidden">
                       <div className="flex items-center gap-3 sm:gap-4 w-full pr-1 relative z-10">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 p-1 flex items-center justify-center shrink-0 border border-gray-100">
                             {ad.imageUrl ? <img src={ad.imageUrl} className="w-full h-full object-cover rounded-lg" /> : <Star size={24} className="text-orange-500" />}
                          </div>
                          <div className="flex-1 text-right min-w-0">
                             <h4 className="font-black text-sm sm:text-base text-gray-900 line-clamp-1">{ad.title}</h4>
                             <p className="text-[10px] sm:text-xs font-bold text-gray-500 truncate mt-0.5">{(ad.url && ad.url.includes('.apk')) ? 'داگرتنی بەرنامە' : 'بینینی بەستەر'}</p>
                          </div>
                       </div>
                       <ArrowUpRight size={22} className="text-orange-500 shrink-0 ml-1 relative z-10" />
                    </div>
                 </a>
              ))}
           </div>
         )}

         <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className={`relative w-full max-w-[24rem] sm:max-w-[26rem] aspect-[1.75/1] mx-auto mb-6 rounded-[1.5rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] group cursor-pointer border border-neutral-800 bg-[#111111] ${activeAds.length === 0 ? 'mt-8' : ''}`}
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
                     {profile?.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full" style={{ objectPosition: avatarPosStyle }} /> : <User className="w-full h-full p-2 text-neutral-300" />}
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

       <div className="fixed left-0 w-full flex justify-center z-40 pointer-events-none px-4" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
          <a href="https://biokurd.com" className="pointer-events-auto relative group w-full max-w-[280px]">
             <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
             <div className="relative px-6 py-3.5 bg-gray-900 rounded-full flex items-center justify-center gap-2 text-white shadow-2xl border border-gray-700 hover:scale-[1.02] active:scale-95 transition-transform">
                <Sparkles size={18} className="text-amber-400 animate-pulse" />
                <span className="font-black text-sm tracking-wide">لینکێکی ئاوا دروست بکە</span>
             </div>
          </a>
       </div>

    </div>
  );
}