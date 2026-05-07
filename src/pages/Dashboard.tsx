import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Plus, Link as LinkIcon, Edit3, Save, Share2, Eye, User, Image as ImageIcon, CheckCircle, 
  Trash2, X, AlertCircle, Copy, Menu, Layout, TrendingUp, MousePointerClick 
} from 'lucide-react';
import DraggableLinkList from '../components/DraggableLinkList';
import ProfileSettings from '../components/ProfileSettings';
import ThemeSettings from '../components/ThemeSettings';
import Card from '../components/Card';
import AppManager from '../components/AppManager';

interface Props {
  user: any;
  onLogout: () => void;
}

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
  { id: 'custom', name: 'لینکێکی تایبەت (Custom)', iconName: 'Globe', imageUrl: '', baseUrl: '', color: '#333333' }
];

export default function Dashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState('links');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'Globe', platformId: 'custom', imageUrl: '', color: '#333333' });
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
    if (!token) {
        onLogout();
        return;
    }

    const cachedProfile = localStorage.getItem('dashboard_profile_cache');
    if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
        setLoading(false);
    }

    try {
      const res = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        localStorage.setItem('dashboard_profile_cache', JSON.stringify(data));
      } else {
        if (res.status === 401) onLogout();
        if (!cachedProfile) showNotif('هەڵە لە هێنانی زانیارییەکان', 'error');
      }
    } catch (err) {
      if (!cachedProfile) showNotif('کێشەی هێڵ هەیە', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const showNotif = (msg: string, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleUpdateProfile = async (updates: any) => {
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) return;
    setSaving(true);
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('dashboard_profile_cache', JSON.stringify(updatedProfile));

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'هەڵە');
      showNotif('زانیارییەکان نوێکرانەوە');
    } catch (err: any) {
      showNotif(err.message, 'error');
      fetchProfile();
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'icon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotif('قەبارەی وێنە دەبێت لە 2MB کەمتر بێت', 'error');
      return;
    }

    if (type === 'avatar') setIsUploadingAvatar(true);
    else setIsUploadingIcon(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = type === 'avatar' ? 400 : 150;
        const MAX_HEIGHT = type === 'avatar' ? 400 : 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const base64String = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.8);
        
        if (type === 'avatar') {
          handleUpdateProfile({ avatarUrl: base64String, avatarPos: { x: 50, y: 50 } });
          setIsUploadingAvatar(false);
        } else {
          if (editLink) setEditLink({ ...editLink, imageUrl: base64String });
          else setNewLink({ ...newLink, imageUrl: base64String });
          setIsUploadingIcon(false);
        }
      };
    };
  };

  const saveLinksOrder = async (newLinks: any[]) => {
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) return;
    
    const updatedProfile = { ...profile, links: newLinks };
    setProfile(updatedProfile);
    localStorage.setItem('dashboard_profile_cache', JSON.stringify(updatedProfile));

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ links: newLinks })
      });
    } catch (err) {
      showNotif('کێشە لە پاشەکەوتکردنی ڕیزبەندی', 'error');
    }
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return showNotif('ناو و لینک پێویستە', 'error');
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLink)
      });
      if (res.ok) {
        showNotif('بەستەری نوێ زیادکرا');
        setNewLink({ title: '', url: '', icon: 'Globe', platformId: 'custom', imageUrl: '', color: '#333333' });
        setShowAddForm(false);
        fetchProfile();
      } else throw new Error();
    } catch (err) {
      showNotif('کێشە لە زیادکردن', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditLink = async () => {
    if (!editLink.title || !editLink.url) return showNotif('ناو و لینک پێویستە', 'error');
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/links/${editLink.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editLink)
      });
      if (res.ok) {
        showNotif('بەستەرەکە نوێکرایەوە');
        setEditLink(null);
        fetchProfile();
      } else throw new Error();
    } catch (err) {
      showNotif('کێشە لە نوێکردنەوە', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if(!confirm('دڵنیایت لە سڕینەوەی ئەم بەستەرە؟')) return;
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) return;
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showNotif('بەستەر سڕایەوە');
        fetchProfile();
      } else throw new Error();
    } catch (err) {
      showNotif('کێشە لە سڕینەوە', 'error');
    }
  };

  const handlePlatformChange = (isEdit: boolean, platformId: string) => {
      const selected = DEFAULT_SOCIALS.find(s => s.id === platformId);
      if (!selected) return;

      if (isEdit && editLink) {
          setEditLink({
              ...editLink,
              platformId,
              title: selected.name,
              icon: selected.iconName,
              imageUrl: selected.imageUrl,
              color: selected.color,
              url: selected.baseUrl !== '' ? selected.baseUrl : editLink.url
          });
      } else {
          setNewLink({
              ...newLink,
              platformId,
              title: selected.name,
              icon: selected.iconName,
              imageUrl: selected.imageUrl,
              color: selected.color,
              url: selected.baseUrl
          });
      }
  };

  if (loading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-[100dvh] w-full flex bg-[#f8fafc] text-neutral-900 font-sans selection:bg-orange-200 overflow-hidden" dir="rtl">
      
      <AppManager />

      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }} 
            style={{ top: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
            className={`fixed left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-black text-sm shadow-xl flex items-center gap-3 backdrop-blur-md border ${notification.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-green-500/90 text-white border-green-400'}`}
          >
            {notification.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>} {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 لێرەدا Padding بۆ نۆچ و لایەکانی خوارەوە کراوە بۆ مێنیو 🌟 */}
      <div className={`fixed inset-y-0 right-0 w-[280px] bg-white border-l border-neutral-200 z-40 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:block shadow-2xl lg:shadow-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-[14px] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30">B</div>
                <h1 className="text-2xl font-black tracking-tight text-neutral-800">BioKurd</h1>
             </div>
             <button className="lg:hidden p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
          </div>

          <div className="flex-1 space-y-2">
            {[
              { id: 'links', icon: LinkIcon, label: 'بەستەرەکان' },
              { id: 'profile', icon: User, label: 'پرۆفایل' },
              { id: 'theme', icon: Layout, label: 'ڕووکار' } 
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}>
                <tab.icon size={22} className={activeTab === tab.id ? 'text-orange-500' : ''} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            <button onClick={() => setShowCard(true)} className="w-full flex items-center gap-3 p-4 bg-neutral-900 text-white hover:bg-black rounded-2xl font-black shadow-lg transition-transform active:scale-95">
              <Eye size={22} /> بینینی کارت
            </button>
            <button onClick={() => { localStorage.removeItem('biokurd_token'); localStorage.removeItem('dashboard_profile_cache'); onLogout(); }} className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-colors">
              <LogOut size={22} /> چوونەدەرەوە
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative">
        {/* 🌟 لێرەدا paddingTop کراوە بە جۆرێک بچێتە ژێر نۆچەکەی ئایفۆن 🌟 */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-200 z-20 shrink-0 sticky top-0 pt-[env(safe-area-inset-top)]">
          <div className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button className="lg:hidden p-2.5 bg-white border border-neutral-200 rounded-xl shadow-sm text-neutral-600 active:scale-95" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
               <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">{activeTab === 'links' ? 'بەستەرەکان' : activeTab === 'profile' ? 'پرۆفایل' : 'ڕووکار'}</h2>
                  <p className="text-xs sm:text-sm font-bold text-neutral-400 mt-0.5">بەخێربێیتەوە بۆ داشبۆرد</p>
               </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
               <button onClick={() => { navigator.clipboard.writeText(`https://biokurd.com/${profile?.slug}`); showNotif('لینکەکە کۆپی کرا'); }} className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-white border border-neutral-200 rounded-xl font-black text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all active:scale-95 text-xs sm:text-sm">
                 <Copy size={18} className="text-neutral-400" /> <span className="hidden sm:block">کۆپی لینک</span>
               </button>
               <button onClick={() => setShowCard(true)} className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all active:scale-95 text-xs sm:text-sm">
                 <Share2 size={18} /> <span className="hidden sm:block">بڵاوکردنەوە</span>
               </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f8fafc] scrollbar-hide pb-[calc(env(safe-area-inset-bottom)+2rem)]">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-out]">
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3 px-1">
                 <h3 className="text-lg font-black text-neutral-800">ئامارەکان</h3>
                 <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] sm:text-xs font-bold border border-blue-100">
                   <AlertCircle size={14} /> ئەم ئامارانە ٢٤ کاتژمێر جارێک نوێ دەکرێنەوە
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-neutral-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-neutral-900">{profile?.visits || 0}</h4>
                    <p className="text-xs font-bold text-neutral-500">سەردانی پرۆفایل</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-neutral-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <MousePointerClick size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-neutral-900">{profile?.clicks || 0}</h4>
                    <p className="text-xs font-bold text-neutral-500">کلیک و داگرتن</p>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'profile' && (
              <ProfileSettings profile={profile} setProfile={setProfile} theme={null} saving={saving} handleUpdateProfile={handleUpdateProfile} handleImageUpload={handleImageUpload} isUploadingAvatar={isUploadingAvatar} avatarInputRef={avatarInputRef} />
            )}

            {activeTab === 'theme' && (
              <ThemeSettings profile={profile} setProfile={setProfile} handleUpdateProfile={handleUpdateProfile} />
            )}

            {activeTab === 'links' && (
              <>
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-neutral-200 mb-6 sm:mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-neutral-900 flex items-center gap-3"><LinkIcon className="text-orange-500" size={24}/> بەستەرەکانت</h2>
                    <button onClick={() => { setShowAddForm(!showAddForm); setEditLink(null); }} className={`p-3 rounded-full transition-transform active:scale-95 shadow-md ${showAddForm ? 'bg-red-50 text-red-500 hover:bg-red-100 rotate-45' : 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-0.5'}`}>
                      <Plus size={24} strokeWidth={3}/>
                    </button>
                  </div>

                  <AnimatePresence>
                    {(showAddForm || editLink) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                        <div className="bg-neutral-50 p-5 sm:p-6 rounded-[1.5rem] border border-neutral-100 space-y-4 shadow-inner">
                          <h3 className="font-black text-neutral-800 border-b border-neutral-200 pb-3 mb-4">{editLink ? 'دەستکاریکردنی بەستەر' : 'بەستەری نوێ'}</h3>
                          
                          <div className="mb-4">
                            <label className="text-xs font-bold text-neutral-500 block mb-2">جۆری بەستەرەکە هەڵبژێرە</label>
                            <select 
                                value={editLink ? editLink.platformId || 'custom' : newLink.platformId || 'custom'} 
                                onChange={(e) => handlePlatformChange(!!editLink, e.target.value)}
                                className="w-full p-3.5 bg-white border border-neutral-200 rounded-xl outline-none focus:border-orange-500 font-bold text-sm shadow-sm cursor-pointer"
                            >
                                {DEFAULT_SOCIALS.map(social => (
                                    <option key={social.id} value={social.id}>{social.name}</option>
                                ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-neutral-500 block mb-2">ناوی بەستەر</label>
                              <input type="text" placeholder="بۆ نمونە: ئینستاگرامەکەم" value={editLink ? editLink.title : newLink.title} onChange={e => editLink ? setEditLink({...editLink, title: e.target.value}) : setNewLink({...newLink, title: e.target.value})} className="w-full p-3.5 bg-white border border-neutral-200 rounded-xl outline-none focus:border-orange-500 focus:shadow-sm font-bold text-sm transition-all" />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-neutral-500 block mb-2">لینک (URL)</label>
                              <input type="url" placeholder="https://..." value={editLink ? editLink.url : newLink.url} onChange={e => editLink ? setEditLink({...editLink, url: e.target.value}) : setNewLink({...newLink, url: e.target.value})} className="w-full p-3.5 bg-white border border-neutral-200 rounded-xl outline-none focus:border-orange-500 focus:shadow-sm font-bold text-sm transition-all text-left" dir="ltr" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-neutral-500 block mb-2">ئایکۆن یان لۆگۆ</label>
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white border border-neutral-200 rounded-xl flex items-center justify-center relative overflow-hidden group shadow-sm shrink-0" style={{ backgroundColor: (editLink ? editLink.color : newLink.color) + '15' }}>
                                  {isUploadingIcon ? <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div> : (editLink?.imageUrl || newLink.imageUrl) ? <img src={editLink ? editLink.imageUrl : newLink.imageUrl} className="w-10 h-10 object-contain" /> : <ImageIcon size={24} className="text-neutral-400" />}
                                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                    <input type="file" accept="image/*" className="hidden" ref={iconInputRef} onChange={(e) => handleImageUpload(e, 'icon')} />
                                    <ImageIcon size={18} className="text-white"/>
                                  </label>
                                </div>
                                <button onClick={() => iconInputRef.current?.click()} className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-xl font-bold text-xs hover:bg-neutral-50 hover:text-orange-500 transition-colors shadow-sm">
                                  وێنەیەک هەڵبژێرە
                                </button>
                              </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-neutral-500 block mb-2">ڕەنگی دوگمە</label>
                                <div className="flex items-center gap-3 p-2 bg-white border border-neutral-200 rounded-xl">
                                  <input type="color" value={editLink ? editLink.color || '#333333' : newLink.color} onChange={e => editLink ? setEditLink({...editLink, color: e.target.value}) : setNewLink({...newLink, color: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0" />
                                  <span className="text-xs font-mono font-bold text-neutral-400" dir="ltr">{editLink ? editLink.color || '#333333' : newLink.color}</span>
                                </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 mt-2">
                            <button onClick={() => { setShowAddForm(false); setEditLink(null); }} className="px-5 py-3 text-neutral-500 font-bold hover:bg-neutral-200 rounded-xl text-sm transition-colors">
                              پاشگەزبوونەوە
                            </button>
                            <button disabled={saving} onClick={editLink ? handleEditLink : handleAddLink} className="px-8 py-3 bg-neutral-900 hover:bg-black text-white rounded-xl font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-70">
                              {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={18} /> پاشەکەوتکردن</>}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    {!profile?.links?.length ? (
                      <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><LinkIcon size={32} className="text-neutral-300" /></div>
                        <p className="text-neutral-500 font-bold text-sm">هیچ بەستەرێکت نییە. یەکەم بەستەرت زیاد بکە!</p>
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