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
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !profile) return <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center"><AlertCircle className="text-red-500 mb-4" size={48} /><h2 className="text-2xl font-black text-white mb-2">پرۆفایل نەدۆزرایەوە</h2><p className="text-white/50 font-bold mb-8">{error || 'ئەم لینکە بوونی نییە یان سڕاوەتەوە.'}</p><Link to="/" className="px-8 py-4 bg-white text-black rounded-2xl font-black shadow-xl hover:scale-105 transition">گەڕانەوە بۆ سەرەتا</Link></div>;

  const activeAds = settings?.ads?.filter((ad: any) => ad.isActive !== false) || [];
  const globalBtns = settings?.globalButtons || [];

  const sponsoredLinks = [
    ...globalBtns.map((b:any) => ({ id: b.id, title: b.title, url: b.url, imageUrl: b.imageUrl, iconName: b.icon })),
    ...activeAds.map((a:any) => ({ id: a.id, title: a.title, url: a.url, imageUrl: a.imageUrl }))
  ];

  return (
    // 🌟 لێرەدا پادینگی دەرەوەم زۆر کەم کردەوە بۆ ئەوەی مۆکئەپەکە فول سکرین بێت 🌟
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-[#0a0a0a] to-black p-0 sm:p-4 overflow-hidden relative touch-manipulation" dir="rtl">
       
       <div className="relative z-10 w-full flex justify-center animate-[fadeIn_0.5s_ease-out]">
         <PhoneMockup 
           mockup={{ 
             name: profile.displayName, 
             bio: profile.bio, 
             avatar: profile.avatarUrl, 
             buttonDesign: profile.theme || 'mockup',
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