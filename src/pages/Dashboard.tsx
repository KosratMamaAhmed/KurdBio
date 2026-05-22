import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Plus, Link as LinkIcon, Save, Share2, Eye, User, Image as ImageIcon, CheckCircle, 
  X, AlertCircle, Copy, Menu, Globe, Star
} from 'lucide-react';
import * as icons from 'lucide-react';
import DraggableLinkList from '../components/DraggableLinkList';
import ProfileSettings from '../components/ProfileSettings';
import Card from '../components/Card';
import AppManager from '../components/AppManager';

interface Props { user: any; onLogout: () => void; settings?: any; theme?: any; }

const DEFAULT_SOCIALS = [
  { id: 'facebook', name: 'فەیسبووک', iconName: 'Facebook', imageUrl: '/social/facebook.png', baseUrl: 'https://www.facebook.com/', color: '#1877F2' },
  { id: 'instagram', name: 'ئینستاگرام', iconName: 'Instagram', imageUrl: '/social/instagram.png', baseUrl: 'https://www.instagram.com/', color: '#E4405F' },
  { id: 'x', name: 'ئێکس (توییتەر)', iconName: 'Twitter', imageUrl: '/social/x.png', baseUrl: 'https://x.com/', color: '#000000' },
  { id: 'youtube', name: 'یوتیوب', iconName: 'Youtube', imageUrl: '/social/youtube.png', baseUrl: 'https://www.youtube.com/@', color: '#FF0000' },
  { id: 'tiktok', name: 'تیکتۆک', iconName: 'Music', imageUrl: '/social/tiktok.png', baseUrl: 'https://www.tiktok.com/@', color: '#000000' },
  { id: 'snapchat', name: 'سناپچات', iconName: 'Ghost', imageUrl: '/social/snapchat.png', baseUrl: 'https://www.snapchat.com/add/', color: '#FFFC00' },
  { id: 'linkedin', name: 'لینکدین', iconName: 'Linkedin', imageUrl: '/social/linkedin.png', baseUrl: 'https://www.linkedin.com/in/', color: '#0A66C2' },
  { id: 'telegram', name: 'تێلیگرام', iconName: 'Send', imageUrl: '/social/telegram.png', baseUrl: 'https://t.me/', color: '#26A5E4' },
  { id: 'whatsapp', name: 'واتسئاپ', iconName: 'MessageCircle', imageUrl: '/social/whatsapp.png', baseUrl: 'https://wa.me/', color: '#25D366' },
  { id: 'playstore', name: 'پلەی ستۆر', iconName: 'Play', imageUrl: '/social/playstore.png', baseUrl: 'https://play.google.com/store/apps/details?id=', color: '#00D859' },
  { id: 'appstore', name: 'ئەپ ستۆر', iconName: 'Apple', imageUrl: '/social/appstore.png', baseUrl: 'https://apps.apple.com/app/', color: '#0070F5' },
  { id: 'discord', name: 'دیسکۆرد', iconName: 'Gamepad', imageUrl: '/social/discord.png', baseUrl: 'https://discord.gg/', color: '#5865F2' },
  { id: 'github', name: 'گیتھەب', iconName: 'Github', imageUrl: '/social/github.png', baseUrl: 'https://github.com/', color: '#181717' },
  { id: 'viber', name: 'ڤایبەر', iconName: 'Phone', imageUrl: '/social/viber.png', baseUrl: 'viber://chat?number=', color: '#7360F2' },
  { id: 'messenger', name: 'مێسنجەر', iconName: 'MessageSquare', imageUrl: '/social/messenger.png', baseUrl: 'https://m.me/', color: '#00B2FF' },
  { id: 'call', name: 'پەیوەندیکردن (Call)', iconName: 'Phone', imageUrl: '/social/call.png', baseUrl: 'tel:', color: '#10B981' },
  { id: 'asia', name: 'ئاسیا سێڵ', iconName: 'Phone', imageUrl: '/social/asia.png', baseUrl: 'tel:', color: '#ED1C24' },
  { id: 'korek', name: 'کۆڕەک تلیکۆم', iconName: 'Phone', imageUrl: '/social/korek.png', baseUrl: 'tel:', color: '#0054A6' },
  { id: 'fastpay', name: 'FastPay - فاستپەی', iconName: 'Copy', imageUrl: '/social/fastpay.png', baseUrl: 'copy:', color: '#E1137B' },
  { id: 'fib', name: 'FIB - بانکی یەکەمی عێراق', iconName: 'Copy', imageUrl: '/social/fib.png', baseUrl: 'copy:', color: '#8DC63F' },
  { id: 'qicard', name: 'Qi Card', iconName: 'Copy', imageUrl: '/social/qicard.png', baseUrl: 'copy:', color: '#231F20' },
  { id: 'custom', name: 'لینکێکی تایبەت (Custom)', iconName: 'Globe', imageUrl: '', baseUrl: '', color: '#333333' }
];

export default function Dashboard({ user, onLogout, settings, theme }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('links');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'Facebook', platformId: 'facebook', imageUrl: '', color: '#1877F2' });
  const [editLink, setEditLink] = useState<any>(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) { onLogout(); return; }
    
    const cached = localStorage.getItem('dashboard_profile_cache');
    if (cached) { setProfile(JSON.parse(cached)); setLoading(false); }

    try {
      const res = await fetch(`/api/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProfile(data); localStorage.setItem('dashboard_profile_cache', JSON.stringify(data));
      } else if (res.status === 401) onLogout();
    } catch (err) { if(!profile) showNotif('کێشەی هێڵ هەیە', 'error'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const showNotif = (msg: string, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleUpdateProfile = async (updates: any) => {
    const token = localStorage.getItem('biokurd_token') || user?.token; if (!token) return;
    setSaving(true);
    const updatedProfile = { ...profile, ...updates }; setProfile(updatedProfile);
    try {
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(updates) });
      if (!res.ok) throw new Error((await res.json()).error || 'هەڵە');
      showNotif('زانیارییەکان بە سەرکەوتوویی پاشەکەوت کران');
    } catch (err: any) { showNotif(err.message, 'error'); fetchProfile(); } 
    finally { setSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'icon') => {
    const file = e.target.files?.[0]; if (!file) return;
    
    if (type === 'avatar') setIsUploadingAvatar(true); else setIsUploadingIcon(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas'); 
        const MAX = type === 'avatar' ? 400 : 150; 
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        
        if (type === 'avatar') {
          setProfile((prev: any) => ({ ...prev, avatarUrl: base64String }));
          setIsUploadingAvatar(false);
        } else {
          if (editLink) setEditLink({ ...editLink, imageUrl: base64String }); else setNewLink({ ...newLink, imageUrl: base64String });
          setIsUploadingIcon(false);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const saveLinksOrder = async (newLinks: any[]) => {
    const token = localStorage.getItem('biokurd_token') || user?.token; if (!token) return;
    const updatedProfile = { ...profile, links: newLinks }; setProfile(updatedProfile);
    try { await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ links: newLinks }) }); } catch (err) { showNotif('کێشە هەیە', 'error'); }
  };

  const handleAddLinkClick = () => {
     if (!profile?.isPro && profile?.links?.length >= 3) {
         showNotif('بۆ دانانی لینکی زیاتر، پێویستە VIP بیت!', 'error');
         setTimeout(() => navigate('/payment'), 2000);
         return;
     }
     setShowAddForm(!showAddForm); setEditLink(null);
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return showNotif('ناو و لینک پێویستە', 'error');
    if (!profile?.isPro && profile?.links?.length >= 3) { navigate('/payment'); return; }
    
    const token = localStorage.getItem('biokurd_token') || user?.token; if (!token) return;
    setSaving(true);
    try {
      const res = await fetch('/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newLink) });
      if (res.ok) { showNotif('بەستەری نوێ زیادکرا'); setNewLink({ title: '', url: '', icon: 'Facebook', platformId: 'facebook', imageUrl: '', color: '#1877F2' }); setShowAddForm(false); fetchProfile(); } else throw new Error();
    } catch (err) { showNotif('کێشە لە زیادکردن', 'error'); } finally { setSaving(false); }
  };

  const handleEditLink = async () => {
    if (!editLink.title || !editLink.url) return showNotif('ناو و لینک پێویستە', 'error');
    const token = localStorage.getItem('biokurd_token') || user?.token; if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/links/${editLink.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(editLink) });
      if (res.ok) { showNotif('بەستەرەکە نوێکرایەوە'); setEditLink(null); fetchProfile(); } else throw new Error();
    } catch (err) { showNotif('کێشە لە نوێکردنەوە', 'error'); } finally { setSaving(false); }
  };

  const handleDeleteLink = async (id: number) => {
    if(!confirm('دڵنیایت لە سڕینەوەی ئەم بەستەرە؟')) return;
    const token = localStorage.getItem('biokurd_token') || user?.token; if (!token) return;
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { showNotif('بەستەر سڕایەوە'); fetchProfile(); } else throw new Error();
    } catch (err) { showNotif('کێشە لە سڕینەوە', 'error'); }
  };

  const handlePlatformChange = (isEdit: boolean, platformId: string) => {
      const selected = DEFAULT_SOCIALS.find(s => s.id === platformId); if (!selected) return;
      if (isEdit && editLink) { 
          setEditLink({ ...editLink, platformId, title: selected.name, icon: selected.iconName, imageUrl: selected.imageUrl, color: selected.color, url: selected.baseUrl }); 
      } else { 
          setNewLink({ ...newLink, platformId, title: selected.name, icon: selected.iconName, imageUrl: selected.imageUrl, color: selected.color, url: selected.baseUrl }); 
      }
  };

  const getUrlInputDetails = (linkObj: any) => {
      const platform = DEFAULT_SOCIALS.find(s => s.id === linkObj.platformId) || DEFAULT_SOCIALS.find(s => s.id === 'facebook');
      const baseUrl = platform?.baseUrl || '';
      const isCustom = platform?.id === 'custom';
      
      let userTypedValue = linkObj.url;
      if (baseUrl && userTypedValue.startsWith(baseUrl)) {
          userTypedValue = userTypedValue.substring(baseUrl.length);
      }
      return { baseUrl, userTypedValue, isCustom };
  };

  const handleUrlInputChange = (isEdit: boolean, e: any) => {
      let val = e.target.value;
      const targetObj = isEdit ? editLink : newLink;
      const platform = DEFAULT_SOCIALS.find(s => s.id === targetObj.platformId) || DEFAULT_SOCIALS.find(s => s.id === 'facebook');
      const baseUrl = platform?.baseUrl || '';

      if (baseUrl && val.startsWith(baseUrl)) val = val.substring(baseUrl.length);
      
      const finalUrl = baseUrl + val;
      if (isEdit) setEditLink({ ...editLink, url: finalUrl });
      else setNewLink({ ...newLink, url: finalUrl });
  };

  if (loading) return <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-[100dvh] w-full flex bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 font-sans selection:bg-orange-200 overflow-hidden" dir="rtl">
      
      <AppManager />

      <AnimatePresence>
        {notification.show && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} style={{ top: 'max(env(safe-area-inset-top), 1.5rem)' }} className={`fixed left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${notification.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-white/80 text-emerald-600 border-emerald-100'}`}>
            {notification.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>} {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 right-0 w-[280px] bg-white/60 backdrop-blur-3xl border-l border-white/50 z-40 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:block shadow-2xl lg:shadow-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[16px] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30">B</div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800">BioKurd</h1>
             </div>
             <button className="lg:hidden p-2 bg-slate-100/50 rounded-full text-slate-500 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
          </div>

          <div className="flex-1 space-y-2">
            {[ { id: 'links', icon: LinkIcon, label: 'بەستەرەکان' }, { id: 'profile', icon: User, label: 'پرۆفایل' } ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-orange-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white' : 'text-slate-500 hover:bg-white/40 hover:text-slate-900'}`}>
                <tab.icon size={22} className={activeTab === tab.id ? 'text-orange-500' : ''} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            {!profile?.isPro && (
               <button onClick={() => navigate('/payment')} className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:opacity-90 rounded-2xl font-black shadow-lg shadow-orange-500/20 transition-transform active:scale-95 mb-4">
                 <Star size={20} className="fill-white" /> ببە بە VIP
               </button>
            )}
            <button onClick={() => setShowCard(true)} className="w-full flex items-center gap-3 p-4 bg-slate-900 text-white hover:bg-black rounded-2xl font-black shadow-xl transition-transform active:scale-95">
              <Eye size={22} /> بینینی کارت
            </button>
            <button onClick={() => { localStorage.removeItem('biokurd_token'); localStorage.removeItem('dashboard_profile_cache'); onLogout(); }} className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50/50 rounded-2xl font-bold transition-colors">
              <LogOut size={22} /> چوونەدەرەوە
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>}

      <div className="flex-1 flex flex-col h-[100dvh] overflow-y-auto relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <header className="bg-white/40 backdrop-blur-2xl border-b border-white/50 z-20 shrink-0 sticky top-0">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button className="lg:hidden p-2.5 bg-white/50 border border-white rounded-xl shadow-sm text-slate-600 active:scale-95" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
               <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{activeTab === 'links' ? 'بەستەرەکان' : 'پرۆفایل'}</h2>
               </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
               <button onClick={() => { navigator.clipboard.writeText(`https://biokurd.com/${profile?.slug}`); showNotif('لینکەکە کۆپی کرا'); }} className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-white/80 border border-white rounded-xl font-black text-slate-700 hover:bg-white shadow-sm transition-all active:scale-95 text-xs sm:text-sm">
                 <Copy size={18} className="text-slate-400" /> <span className="hidden sm:block">کۆپی لینک</span>
               </button>
               <button onClick={() => setShowCard(true)} className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-gradient-to-br from-orange-400 to-orange-500 hover:to-orange-600 text-white rounded-xl font-black shadow-lg shadow-orange-500/20 transition-all active:scale-95 text-xs sm:text-sm">
                 <Share2 size={18} /> <span className="hidden sm:block">بڵاوکردنەوە</span>
               </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 scrollbar-hide pb-20">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-out]">
            
            {activeTab === 'profile' && (
              <ProfileSettings profile={profile} setProfile={setProfile} saving={saving} handleUpdateProfile={handleUpdateProfile} handleImageUpload={handleImageUpload} isUploadingAvatar={isUploadingAvatar} avatarInputRef={avatarInputRef} />
            )}

            {activeTab === 'links' && (
              <>
                <div className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-6 sm:mb-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-3"><LinkIcon className="text-orange-500" size={24}/> بەستەرەکانت</h2>
                    <button onClick={handleAddLinkClick} className={`p-3 rounded-2xl transition-all active:scale-95 shadow-lg ${showAddForm ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 rotate-45 shadow-none' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20 hover:-translate-y-0.5'}`}>
                      <Plus size={24} strokeWidth={3}/>
                    </button>
                  </div>

                  {settings?.globalButtons?.length > 0 && (
                     <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100/50 rounded-3xl">
                       <h3 className="text-[13px] font-black text-blue-800 mb-4 flex items-center gap-1.5"><Globe size={16}/> بەستەرە گشتییەکان</h3>
                       <div className="space-y-3 pointer-events-none opacity-90">
                          {settings.globalButtons.map((btn: any, idx: number) => {
                             const Icon = (icons as any)[btn.icon || 'Globe'] || Globe;
                             return (
                               <div key={`global-${idx}`} className="flex items-center gap-3 p-3.5 bg-white/80 border border-white rounded-2xl shadow-sm">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                     {btn.imageUrl ? <img src={btn.imageUrl} className="w-6 h-6 object-contain" /> : <Icon size={20} className="text-blue-500" />}
                                  </div>
                                  <div>
                                     <h4 className="font-black text-sm text-slate-800">{btn.title}</h4>
                                     <p className="text-[10px] font-bold text-slate-400 mt-0.5 max-w-[150px] truncate" dir="ltr">{btn.url}</p>
                                  </div>
                                  <span className="mr-auto px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-[10px] font-black">گشتی</span>
                               </div>
                             );
                          })}
                       </div>
                     </div>
                  )}

                  <AnimatePresence>
                    {(showAddForm || editLink) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                        <div className="bg-white/80 p-5 sm:p-6 rounded-[1.5rem] border border-white shadow-sm space-y-4">
                          <h3 className="font-black text-slate-800 border-b border-slate-100 pb-3 mb-4">{editLink ? 'دەستکاریکردنی بەستەر' : 'بەستەری نوێ'}</h3>
                          
                          <div className="mb-4">
                            <label className="text-xs font-bold text-slate-500 block mb-2">جۆری بەستەرەکە هەڵبژێرە</label>
                            <select value={editLink ? editLink.platformId || 'facebook' : newLink.platformId || 'facebook'} onChange={(e) => handlePlatformChange(!!editLink, e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-bold text-sm shadow-sm cursor-pointer transition-colors">
                                {DEFAULT_SOCIALS.map(social => (<option key={social.id} value={social.id}>{social.name}</option>))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                              <label className="text-xs font-bold text-slate-500 block mb-2">ناوی بەستەر</label>
                              <input type="text" placeholder="بۆ نمونە: ئینستاگرامەکەم" value={editLink ? editLink.title : newLink.title} onChange={e => editLink ? setEditLink({...editLink, title: e.target.value}) : setNewLink({...newLink, title: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white font-bold text-sm transition-all" />
                            </div>
                            
                            <div>
                              <label className="text-xs font-bold text-slate-500 block mb-2">
                                {getUrlInputDetails(editLink || newLink).isCustom ? 'بەستەر (URL)' : 'یوزەرنەیم یان ژمارە مۆبایل'}
                              </label>
                              <div className="flex items-center" dir="ltr">
                                 {!getUrlInputDetails(editLink || newLink).isCustom && getUrlInputDetails(editLink || newLink).baseUrl && (
                                    <span className="bg-slate-100 px-3 py-3.5 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-mono text-xs md:text-sm font-bold opacity-80 whitespace-nowrap overflow-hidden max-w-[120px] md:max-w-none text-ellipsis">
                                       {getUrlInputDetails(editLink || newLink).baseUrl}
                                    </span>
                                 )}
                                 <input 
                                    type="text" 
                                    placeholder={getUrlInputDetails(editLink || newLink).isCustom ? "https://..." : "بینووسە لێرە..."} 
                                    value={getUrlInputDetails(editLink || newLink).userTypedValue} 
                                    onChange={(e) => handleUrlInputChange(!!editLink, e)} 
                                    className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:bg-white font-bold text-sm transition-all text-left ${!getUrlInputDetails(editLink || newLink).isCustom && getUrlInputDetails(editLink || newLink).baseUrl ? 'rounded-r-xl' : 'rounded-xl'}`} 
                                 />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-500 block mb-2">ئایکۆن یان لۆگۆ</label>
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-sm shrink-0" style={{ backgroundColor: (editLink ? editLink.color : newLink.color) + '15' }}>
                                  {isUploadingIcon ? <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div> : (editLink?.imageUrl || newLink.imageUrl) ? <img src={editLink ? editLink.imageUrl : newLink.imageUrl} className="w-10 h-10 object-contain" /> : <ImageIcon size={24} className="text-slate-300" />}
                                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm">
                                    <input type="file" accept="image/*" className="hidden" ref={iconInputRef} onChange={(e) => handleImageUpload(e, 'icon')} />
                                    <ImageIcon size={18} className="text-white"/>
                                  </label>
                                </div>
                                <button onClick={() => iconInputRef.current?.click()} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 hover:text-orange-500 transition-colors shadow-sm">
                                  وێنەیەک هەڵبژێرە
                                </button>
                              </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-2">ڕەنگی دوگمە</label>
                                <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                  <input type="color" value={editLink ? editLink.color || '#333333' : newLink.color} onChange={e => editLink ? setEditLink({...editLink, color: e.target.value}) : setNewLink({...newLink, color: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0" />
                                  <span className="text-xs font-mono font-bold text-slate-400" dir="ltr">{editLink ? editLink.color || '#333333' : newLink.color}</span>
                                </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-6 mt-2">
                            <button onClick={() => { setShowAddForm(false); setEditLink(null); }} className="px-5 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl text-sm transition-colors">پاشگەزبوونەوە</button>
                            <button disabled={saving} onClick={editLink ? handleEditLink : handleAddLink} className="px-8 py-3 bg-gradient-to-br from-orange-400 to-orange-500 hover:to-orange-600 text-white rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70">
                              {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={18} /> پاشەکەوتکردن</>}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    {!profile?.links?.length ? (
                      <div className="text-center py-16 bg-white/40 rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><LinkIcon size={32} className="text-slate-300" /></div>
                        <p className="text-slate-400 font-bold text-sm">هیچ بەستەرێکت نییە. یەکەم بەستەرت زیاد بکە!</p>
                      </div>
                    ) : (
                      <DraggableLinkList links={profile.links} setLinks={saveLinksOrder} onEdit={(l: any) => { setEditLink(l); setShowAddForm(true); }} onDelete={handleDeleteLink} />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {showCard && profile && <Card profile={profile} onClose={() => setShowCard(false)} />}
    </div>
  );
}