import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';
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

export default function PublicProfile({ settings }: { settings?: any }) {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !profile) return <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-center"><AlertCircle className="text-red-500 mb-4" size={48} /><h2 className="text-2xl font-black text-white mb-2">پرۆفایل نەدۆزرایەوە</h2><p className="text-white/50 font-bold mb-8">{error || 'ئەم لینکە بوونی نییە یان سڕاوەتەوە.'}</p><Link to="/" className="px-8 py-4 bg-white text-black rounded-2xl font-black shadow-xl hover:scale-105 transition">گەڕانەوە بۆ سەرەتا</Link></div>;

  const activeAds = settings?.ads?.filter((ad: any) => ad.isActive !== false) || [];
  const globalBtns = settings?.globalButtons || [];
  const sponsoredLinks = [ ...globalBtns.map((b:any) => ({ id: b.id, title: b.title, url: b.url, imageUrl: b.imageUrl, iconName: b.icon })), ...activeAds.map((a:any) => ({ id: a.id, title: a.title, url: a.url, imageUrl: a.imageUrl })) ];

  const themeId = profile.theme || 'mockup';
  const backgroundGlow = OUTER_GLOW[themeId] || OUTER_GLOW.mockup;

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-start bg-[#050505] pt-8 sm:pt-12 px-2 sm:px-6 overflow-y-auto overflow-x-hidden relative touch-manipulation pb-36`} dir="rtl">
       
       {/* 🌟 بانگکردنی ئەپ مانیجەر بۆ پەنجەرەی تیکتۆک 🌟 */}
       <AppManager />

       <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGlow} opacity-60 z-0 pointer-events-none fixed`}></div>
       <div className="absolute inset-0 z-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none fixed"></div>
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-gradient-to-r ${backgroundGlow} rounded-[100%] blur-[100px] opacity-40 pointer-events-none z-0 fixed`}></div>

       <div className="relative z-10 w-full flex justify-center animate-[fadeIn_0.5s_ease-out]">
         <PhoneMockup 
           mockup={{ 
             name: profile.displayName, 
             bio: profile.bio, 
             avatar: profile.avatarUrl, 
             avatarPos: profile.avatarPos,
             bgImage: profile.bgImage,
             bgPos: profile.bgPos,
             buttonDesign: themeId,
             nameColor: profile.nameColor, 
             bioColor: profile.bioColor,
             btnTextColor: profile.btnTextColor,
             isPro: profile.isPro 
           }} 
           mockupLinks={profile.links || []} 
           sponsoredLinks={sponsoredLinks}
           isPublic={true} 
           handleLinkClick={handleLinkClick} 
         />
       </div>
    </div>
  );
}