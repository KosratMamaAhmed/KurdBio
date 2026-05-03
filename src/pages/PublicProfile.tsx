import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';

export default function PublicProfile({ settings }: { settings?: any }) {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    // 🌟 چارەسەری کردنەوەی ڕاستەوخۆی ئەپەکان لەناو تیکتۆک و ئینستاگرام 🌟
    const ua = navigator.userAgent || navigator.vendor;
    const isAndroid = /android/i.test(ua);
    const isIOS = /ipad|iphone|ipod/i.test(ua);

    let finalUrl = url;
    let isAppIntent = false;

    if (url.includes('wa.me/') || url.includes('api.whatsapp.com/')) {
        const phone = url.match(/wa\.me\/(\+?\d+)/)?.[1] || url.match(/phone=(\+?\d+)/)?.[1];
        if (phone) {
            finalUrl = isAndroid ? `intent://send?phone=${phone}#Intent;scheme=whatsapp;package=com.whatsapp;end` : `whatsapp://send?phone=${phone}`;
            isAppIntent = true;
        }
    } else if (url.includes('instagram.com/')) {
        const username = url.split('instagram.com/')[1]?.split('/')[0]?.split('?')[0];
        if (username) {
            finalUrl = isAndroid ? `intent://user?username=${username}#Intent;scheme=instagram;package=com.instagram.android;end` : `instagram://user?username=${username}`;
            isAppIntent = true;
        }
    } else if (url.includes('snapchat.com/add/')) {
        const username = url.split('snapchat.com/add/')[1]?.split('?')[0];
        if (username) {
            finalUrl = isAndroid ? `intent://add/${username}#Intent;scheme=snapchat;package=com.snapchat.android;end` : `snapchat://add/${username}`;
            isAppIntent = true;
        }
    } else if (url.includes('t.me/') || url.includes('telegram.me/')) {
        const username = url.split('.me/')[1]?.split('?')[0];
        if (username) {
            finalUrl = isAndroid ? `intent://resolve?domain=${username}#Intent;scheme=tg;package=org.telegram.messenger;end` : `tg://resolve?domain=${username}`;
            isAppIntent = true;
        }
    }

    // گەر لینکی ئەپ بوو، یەکسەر مۆبایلەکە ناچار دەکەین بەرنامەکە بکاتەوە
    if (isAppIntent) {
        window.location.href = finalUrl;
        // گەر بەرنامەکە نەبوو، دوای ٢ چرکە دەچێتە براوزەرەکە
        setTimeout(() => {
            window.location.href = url;
        }, 2000);
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-100 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !profile) return <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-6 text-center"><AlertCircle className="text-red-500 mb-4" size={48} /><h2 className="text-2xl font-black text-neutral-900 mb-2">پرۆفایل نەدۆزرایەوە</h2><p className="text-neutral-500 font-bold mb-8">{error || 'ئەم لینکە بوونی نییە یان سڕاوەتەوە.'}</p><Link to="/" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition">گەڕانەوە بۆ سەرەتا</Link></div>;

  const activeAds = settings?.ads?.filter((ad: any) => ad.isActive !== false) || [];
  const globalBtns = settings?.globalButtons || [];
  const sponsoredLinks = [ ...globalBtns.map((b:any) => ({ id: b.id, title: b.title, url: b.url, imageUrl: b.imageUrl, iconName: b.icon })), ...activeAds.map((a:any) => ({ id: a.id, title: a.title, url: a.url, imageUrl: a.imageUrl })) ];

  return (
    // لێرەدا پادینگ و شتەکانم پاککردەوە بۆ ئەوەی ڕاستەوخۆ ببێتە باکگراوندی سایتەکە نەک مۆبایل
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden touch-manipulation" dir="rtl">
       <div className="w-full flex justify-center animate-[fadeIn_0.5s_ease-out]">
         <PhoneMockup 
           mockup={{ 
             name: profile.displayName, 
             bio: profile.bio, 
             avatar: profile.avatarUrl, 
             bgImage: profile.bgImage, // 🌟 زیادکردنی وێنەی کەڤەر
             buttonDesign: profile.theme || 'light',
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