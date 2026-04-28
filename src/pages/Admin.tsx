import { useState, useEffect, useRef } from 'react';
import { Users, LogOut, Trash2, Edit, Settings, Save, Key, UserCheck, UserX, Star, Link as LinkIcon, Smartphone, Camera, Lock, Share2, Globe, Eye, EyeOff, Image as ImageIcon, Palette, Search } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';

interface Props { 
  user: any; 
  onLogout: () => void; 
  theme: any; 
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
  { id: 'call', name: 'پەیوەندیکردن (Call)', iconName: 'Phone', imageUrl: '/social/call.png', baseUrl: 'tel:', color: '#10B981' }
];

export default function Admin({ user, onLogout, theme }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ 
    pages: { about: { text: '', links: [] }, terms: { text: '', links: [] }, works: { text: '', links: [] } },
    siteTheme: 'orange', 
    mockup: { name: 'کۆسرەت مامە', bio: 'شارەزا لە تەکنەلۆژیا', avatar: '', buttonDesign: 'mockup', nameColor: '#ffffff', bioColor: '#a3a3a3', btnTextColor: '#ffffff' }, 
    globalButtons: [], 
    ads: [], 
    socialPlatforms: []
  });
  
  const [activeTab, setActiveTab] = useState('theme'); 
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [uRes, sRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${user.token}` } }),
        fetch('/api/public/settings')
      ]);
      const uData = await uRes.json();
      const sData = await sRes.json();
      if (uData && !uData.error && Array.isArray(uData)) setUsers(uData); else setUsers([]);
      if (sData && !sData.error) setSettings((prev: any) => ({ ...prev, ...sData }));
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const saveSettings = async () => {
    await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    alert('ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوت کران!');
  };

  const handleToggleUser = async (userId: string, currentStatus: boolean) => {
    if (!confirm(currentStatus ? 'دڵنیایت لە ڕاگرتنی ئەم هەژمارە؟' : 'دڵنیایت لە چالاککردنەوەی ئەم هەژمارە؟')) return;
    await fetch('/api/admin/toggle-user', { method: 'POST', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, isActive: !currentStatus }) });
    fetchData();
  };

  const handleTogglePro = async (userId: string, currentStatus: boolean) => {
    if (!confirm(currentStatus ? 'دڵنیایت لە لابردنی VIP لەم هەژمارە؟' : 'دڵنیایت لە پێدانی VIP بەم هەژمارە؟')) return;
    await fetch('/api/admin/toggle-pro', { method: 'POST', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, isPro: !currentStatus }) });
    fetchData();
  };

  const forcePasswordChange = async (targetId: number) => {
    const newPass = prompt("پاسوۆردێکی نوێ بنووسە بۆ ئەم بەکارهێنەرە:");
    if (!newPass) return;
    await fetch('/api/admin/force-password', { method: 'POST', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId, newPassword: newPass }) });
    alert("پاسوۆردەکە بە سەرکەوتوویی گۆڕدرا!");
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('دڵنیایت لە سڕینەوەی ئەم بەکارهێنەرە بە یەکجاری؟ ئەم کارە هەڵناوەشێتەوە!')) return;
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` } });
    fetchData();
  };

  const saveUserEdit = async () => {
    await fetch('/api/admin/edit-user', { method: 'PUT', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(editingUser) });
    setEditingUser(null); fetchData();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, listType: 'ads' | 'globalButtons' | 'mockup', index?: number) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; const MAX_HEIGHT = 800;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        if (listType === 'ads' && index !== undefined) {
          const newAds = [...(settings.ads || [])]; newAds[index].imageUrl = base64; setSettings({...settings, ads: newAds});
        } else if (listType === 'globalButtons' && index !== undefined) {
          const newBtns = [...(settings.globalButtons || [])]; newBtns[index].imageUrl = base64; setSettings({...settings, globalButtons: newBtns});
        } else if (listType === 'mockup') {
          setSettings({...settings, mockup: {...settings.mockup, avatar: base64}});
        }
      };
    };
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const TABS = [
    { id: 'theme', label: 'ڕووکار و مۆکئەپ', icon: <Palette size={18}/> },
    { id: 'socials', label: 'تۆڕە کۆمەڵایەتییەکان', icon: <Share2 size={18}/> },
    { id: 'users', label: 'بەکارهێنەران', icon: <Users size={18}/> },
    { id: 'buttons', label: 'بەستەرە گشتییەکان', icon: <LinkIcon size={18}/> },
    { id: 'ads', label: 'ڕیکلامەکان', icon: <Star size={18}/> },
    { id: 'pages', label: 'پەڕەکان', icon: <Settings size={18}/> }
  ];

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><div className={`w-8 h-8 border-4 ${theme?.border || 'border-orange-200'} border-t-transparent rounded-full animate-spin`}></div></div>;

  return (
    <div className="min-h-[100dvh] bg-neutral-50 font-sans pb-20" dir="rtl">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className={`font-black text-xl flex items-center gap-2 ${theme?.text || 'text-orange-500'} `}><Lock size={20} /> بەڕێوەبەر</div>
          <button onClick={onLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === t.id ? `${theme?.main || 'bg-orange-500'} text-white shadow-lg` : 'bg-white text-neutral-500 hover:bg-neutral-100'}`}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={saveSettings} className={`mt-auto hidden lg:flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}><Save size={18}/> پاشەکەوتکردن</button>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-neutral-100 overflow-hidden">

          {/* TAB: Theme & Mockup */}
          {activeTab === 'theme' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-black mb-4">ڕەنگی سەرەکی سایت</h2>
                <div className="flex gap-4">
                  {['orange', 'indigo', 'emerald', 'dark'].map(c => (
                    <button key={c} onClick={() => setSettings({...settings, siteTheme: c})} className={`w-16 h-16 rounded-2xl border-4 ${settings.siteTheme === c ? 'border-neutral-900 scale-110 shadow-xl' : 'border-transparent'} ${c === 'orange' ? 'bg-orange-500' : c === 'indigo' ? 'bg-indigo-600' : c === 'emerald' ? 'bg-emerald-500' : 'bg-neutral-900'} transition-all`}></button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 rounded-[2.5rem] border border-neutral-200 p-6 sm:p-8 flex flex-col lg:flex-row gap-10 items-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200/40 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex-1 w-full space-y-5 relative z-10">
                   <h3 className="text-2xl font-black text-neutral-900 flex items-center gap-2 mb-2"><Smartphone size={28} className={theme?.text || 'text-orange-500'}/> مۆکئەپی سەرەکی شاشە</h3>
                   
                   <div>
                     <label className="text-xs font-bold text-neutral-500 mb-1 block pl-2">ناوی ناو مۆکئەپ</label>
                     <input type="text" placeholder="کۆسرەت مامە" value={settings.mockup?.name || ''} onChange={e => setSettings({...settings, mockup: {...settings.mockup, name: e.target.value}})} className="w-full p-4 rounded-xl bg-white border border-neutral-200 outline-none font-black shadow-sm focus:border-orange-400 transition" />
                   </div>

                   <div>
                     <label className="text-xs font-bold text-neutral-500 mb-1 block pl-2">کورتەیەک (بایۆ)</label>
                     <input type="text" placeholder="بایۆگرافی لێرە بنووسە" value={settings.mockup?.bio || ''} onChange={e => setSettings({...settings, mockup: {...settings.mockup, bio: e.target.value}})} className="w-full p-4 rounded-xl bg-white border border-neutral-200 outline-none font-bold text-sm shadow-sm focus:border-orange-400 transition" />
                   </div>

                   <div>
                     <label className="text-xs font-bold text-neutral-500 mb-2 block pl-2">ڕەنگی نووسینەکان (نموونەی سەر شاشە)</label>
                     <div className="mb-3 bg-white p-2.5 rounded-xl border border-neutral-200 shadow-sm">
                       <span className="text-[10px] font-bold text-neutral-400 mb-2 block">تێکەڵە ئامادەکراوەکان:</span>
                       <div className="flex flex-wrap gap-1.5">
                         {[
                           { name: 'ئاڵتوونی', col: { nameColor: '#fbbf24', bioColor: '#fcd34d', btnTextColor: '#ffffff' } },
                           { name: 'زەریایی', col: { nameColor: '#38bdf8', bioColor: '#bae6fd', btnTextColor: '#ffffff' } },
                           { name: 'زەمردی', col: { nameColor: '#10b981', bioColor: '#a7f3d0', btnTextColor: '#ffffff' } },
                           { name: 'پریمیم', col: { nameColor: '#d8b4fe', bioColor: '#e9d5ff', btnTextColor: '#ffffff' } }
                         ].map(p => (
                           <button type="button" key={p.name} onClick={() => setSettings({...settings, mockup: {...settings.mockup, ...p.col}})} className="px-2 py-1 text-[10px] font-bold rounded-md border" style={{ backgroundColor: p.col.nameColor + '15', color: p.col.nameColor, borderColor: p.col.nameColor }}>{p.name}</button>
                         ))}
                       </div>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-neutral-400 pr-1">ڕەنگی ناو</span>
                          <input type="color" value={settings.mockup?.nameColor || '#ffffff'} onChange={e => setSettings({...settings, mockup: {...settings.mockup, nameColor: e.target.value}})} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-neutral-400 pr-1">ڕەنگی بایۆ</span>
                          <input type="color" value={settings.mockup?.bioColor || '#a3a3a3'} onChange={e => setSettings({...settings, mockup: {...settings.mockup, bioColor: e.target.value}})} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-neutral-400 pr-1">ڕەنگی دوگمە</span>
                          <input type="color" value={settings.mockup?.btnTextColor || '#ffffff'} onChange={e => setSettings({...settings, mockup: {...settings.mockup, btnTextColor: e.target.value}})} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" />
                        </div>
                     </div>
                   </div>

                   <div>
                     <label className="text-xs font-bold text-neutral-500 mb-1 block pl-2">جۆری دیزاین</label>
                     <select value={settings.mockup?.buttonDesign || 'mockup'} onChange={e => setSettings({...settings, mockup: {...settings.mockup, buttonDesign: e.target.value}})} className="w-full p-4 rounded-xl bg-white border border-neutral-200 outline-none font-bold text-sm shadow-sm focus:border-orange-400 transition cursor-pointer">
                        <option value="mockup">تاریکی شاهانە (Executive)</option>
                        <option value="light">سپی پلاتینی (Pearl)</option>
                        <option value="gold">ئاڵتوونی و ڕەش (Luxury)</option>
                        <option value="neon">شوشەیی نیۆن (Cyber)</option>
                        <option value="emerald">زەمردی متمانە (Emerald)</option>
                        <option value="vintage">قاوەیی کلاسیک (Vintage)</option>
                        <option value="crimson">خوێناوی تاریک (Crimson)</option>
                        <option value="navy">سرمەیی مۆدێرن (Navy)</option>
                        <option value="royal">مۆر و ڕۆزگۆڵد (Royal)</option>
                        <option value="minimal">مینیماڵی خاوێن (Minimal)</option>
                     </select>
                   </div>

                   <div className="pt-2">
                     <label className="text-xs font-bold text-neutral-500 mb-2 block pl-2">وێنەی پرۆفایلی مۆکئەپ</label>
                     <input type="file" id="mockupImage" accept="image/*" onChange={(e:any) => handleImageUpload(e, 'mockup')} className="hidden" />
                     <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-[14px] bg-white border border-neutral-200 p-1 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                         {settings.mockup?.avatar ? <img src={settings.mockup.avatar} className="w-full h-full object-cover rounded-[10px]" /> : <ImageIcon className="text-neutral-300"/>}
                       </div>
                       <button onClick={() => document.getElementById('mockupImage')?.click()} className="px-5 py-3.5 bg-neutral-800 hover:bg-black text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 text-sm"><Camera size={16}/> گۆڕینی وێنە</button>
                     </div>
                   </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto flex justify-center lg:justify-end relative z-10 pointer-events-none scale-90 sm:scale-100 origin-center lg:origin-left">
                   <PhoneMockup 
                     mockup={{...settings.mockup, isPro: true}} 
                     mockupLinks={[
                       { name: 'فەیسبووک', icon: '/social/facebook.png', color: '#1877F2' },
                       { name: 'ئینستاگرام', icon: '/social/instagram.png', color: '#E4405F' }
                     ]} 
                     sponsoredLinks={settings.globalButtons || []}
                   />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Global Buttons */}
          {activeTab === 'buttons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                 <div>
                   <h2 className="text-xl font-black text-neutral-900">بەستەرە گشتییەکان (Global Links)</h2>
                   <p className="text-sm font-bold text-neutral-500 mt-1">ئەم بەستەرانە لای هەموو بەکارهێنەران لە بەشی سپۆنسەر دەردەکەون.</p>
                 </div>
                 <button onClick={() => setSettings({...settings, globalButtons: [...(settings.globalButtons||[]), { id: Date.now(), title: '', url: '', icon: 'Globe', imageUrl: '' }]})} className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-md ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>+ بەستەری نوێ</button>
              </div>
              
              <div className="space-y-4">
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                {(settings.globalButtons||[]).map((btn: any, idx: number) => (
                  <div key={btn.id} className="flex flex-col xl:flex-row gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 items-center shadow-sm relative overflow-hidden">
                    <div className="w-14 h-14 shrink-0 rounded-[14px] overflow-hidden bg-white border border-neutral-200 p-2 flex items-center justify-center shadow-inner">
                      {btn.imageUrl ? <img src={btn.imageUrl} className="w-full h-full object-contain" alt="Icon" /> : <LinkIcon size={28} className="text-neutral-400" />}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 w-full">
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">ناوی دوگمە</label><input type="text" value={btn.title} onChange={e => { const n = [...settings.globalButtons]; n[idx].title = e.target.value; setSettings({...settings, globalButtons: n}); }} className="w-full p-3 rounded-xl border outline-none font-bold" /></div>
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">بەستەر (URL)</label><input type="url" value={btn.url} onChange={e => { const n = [...settings.globalButtons]; n[idx].url = e.target.value; setSettings({...settings, globalButtons: n}); }} className="w-full p-3 rounded-xl border outline-none font-bold text-xs" dir="ltr" /></div>
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">ناوی ئایکۆن (ئەگەر وێنە نەبوو)</label><input type="text" value={btn.icon || ''} onChange={e => { const n = [...settings.globalButtons]; n[idx].icon = e.target.value; setSettings({...settings, globalButtons: n}); }} className="w-full p-3 rounded-xl border outline-none font-bold text-indigo-600" dir="ltr" /></div>
                      <div className="flex gap-2 items-end">
                        <button onClick={() => { fileInputRef.current!.onchange = (e:any) => handleImageUpload(e, 'globalButtons', idx); fileInputRef.current!.click(); }} className="flex-1 p-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold rounded-xl transition h-[46px] flex items-center justify-center"><Camera size={18}/></button>
                        <button onClick={() => { const n = settings.globalButtons.filter((_:any, i:number) => i !== idx); setSettings({...settings, globalButtons: n}); }} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition h-[46px]"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Social Platforms */}
          {activeTab === 'socials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-black">ڕێکخستنی تۆڕە کۆمەڵایەتییەکان</h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => { if(confirm('دڵنیایت لەم کارە؟')) setSettings({...settings, socialPlatforms: DEFAULT_SOCIALS}); }} className="px-4 py-2.5 rounded-xl font-bold bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition">گەڕاندنەوەی بنەڕەتییەکان</button>
                  <button onClick={() => { const newSocials = [...(settings.socialPlatforms || [])]; newSocials.push({ id: `platform_${Date.now()}`, name: '', iconName: 'Globe', imageUrl: '', baseUrl: '', color: '#000000' }); setSettings({...settings, socialPlatforms: newSocials}); }} className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-md ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>+ زیادکردنی تۆڕ</button>
                </div>
              </div>
              <div className="space-y-4">
                {(settings.socialPlatforms || []).map((social: any, idx: number) => (
                  <div key={social.id} className="flex flex-col xl:flex-row gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 items-center shadow-sm">
                    <div className="w-14 h-14 shrink-0 rounded-[14px] bg-white border border-neutral-200 p-2 flex items-center justify-center" style={{ backgroundColor: social.color + '15' }}>
                      {social.imageUrl ? <img src={social.imageUrl} className="w-full h-full object-contain" /> : <Globe color={social.color} size={28} />}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 w-full">
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">ناوی تۆڕ</label><input type="text" value={social.name} onChange={e => { const n = [...settings.socialPlatforms]; n[idx].name = e.target.value; setSettings({...settings, socialPlatforms: n}); }} className="w-full p-3 rounded-xl border outline-none font-bold text-sm" /></div>
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">بەستەری بنەڕەت (Base URL)</label><input type="text" value={social.baseUrl} onChange={e => { const n = [...settings.socialPlatforms]; n[idx].baseUrl = e.target.value; setSettings({...settings, socialPlatforms: n}); }} className="w-full p-3 rounded-xl border outline-none font-bold text-sm" dir="ltr" /></div>
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">وێنەی ئایکۆن</label><input type="text" value={social.imageUrl} onChange={e => { const n = [...settings.socialPlatforms]; n[idx].imageUrl = e.target.value; setSettings({...settings, socialPlatforms: n}); }} className="w-full p-3 rounded-xl border outline-none font-bold text-indigo-600 text-sm" dir="ltr" /></div>
                      <div className="flex gap-3 items-end">
                        <div className="flex-1 border bg-white rounded-xl p-1.5 h-[46px] flex items-center gap-2">
                          <input type="color" value={social.color} onChange={e => { const n = [...settings.socialPlatforms]; n[idx].color = e.target.value; setSettings({...settings, socialPlatforms: n}); }} className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" />
                          <input type="text" value={social.color} onChange={e => { const n = [...settings.socialPlatforms]; n[idx].color = e.target.value; setSettings({...settings, socialPlatforms: n}); }} className="w-full text-xs font-bold outline-none" dir="ltr" />
                        </div>
                        <button onClick={() => { const n = settings.socialPlatforms.filter((_:any, i:number) => i !== idx); setSettings({...settings, socialPlatforms: n}); }} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition h-[46px]"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Users */}
          {activeTab === 'users' && (
             <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                 <div>
                   <h2 className="text-xl font-black text-neutral-900">سەرجەم بەکارهێنەران</h2>
                   <p className="text-sm font-bold text-neutral-500 mt-1">کۆی گشتی: {users.length} هەژمار</p>
                 </div>
                 <div className="relative w-full sm:w-72">
                   <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-400"><Search size={18} /></div>
                   <input type="text" placeholder="گەڕان بەدوای ناو یان ئیمێڵ..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-amber-400 outline-none font-bold text-sm transition-all shadow-sm" />
                 </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-right">
                  <thead className="bg-neutral-50 text-neutral-500">
                    <tr>
                      <th className="px-6 py-4 rounded-r-xl">بەکارهێنەر</th>
                      <th className="px-6 py-4">پەیوەندی</th>
                      <th className="px-6 py-4">جۆری هەژمار</th>
                      <th className="px-6 py-4 text-center rounded-l-xl">دەسەڵاتەکان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold flex items-center gap-2 text-base">
                            {u.displayName || u.username} {u.isPro && <Star size={14} className="text-amber-500 fill-amber-500"/>}
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">@{u.username}</div>
                        </td>
                        <td className="px-6 py-4 text-neutral-500 font-bold text-xs leading-relaxed" dir="ltr">
                          {u.email}<br/>{u.phone}
                        </td>
                        <td className="px-6 py-4 flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black w-fit ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'چالاک' : 'ڕاگیراو'}</span>
                          <button onClick={() => handleTogglePro(u.id, u.isPro)} className={`px-3 py-1 rounded-full text-xs font-black w-fit transition shadow-sm ${u.isPro ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>{u.isPro ? 'VIP Pro' : 'Free User'}</button>
                        </td>
                        <td className="px-6 py-4 flex flex-wrap items-center justify-center gap-2">
                          <button onClick={() => forcePasswordChange(u.id)} className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100" title="گۆڕینی پاسوۆرد"><Key size={18} /></button>
                          <button onClick={() => setEditingUser(u)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100" title="دەستکاریکردن"><Edit size={18} /></button>
                          <button onClick={() => handleToggleUser(u.id, u.isActive)} className={`p-2 rounded-xl ${u.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`} title="چالاککردن / ڕاگرتن">{u.isActive ? <UserX size={18} /> : <UserCheck size={18} />}</button>
                          {u.id !== 0 && <button onClick={() => deleteUser(u.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100" title="سڕینەوە"><Trash2 size={18} /></button>}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-neutral-400 font-black">هیچ بەکارهێنەرێک نەدۆزرایەوە!</td></tr>}
                  </tbody>
                </table>
               </div>
             </div>
          )}

          {/* TAB: Pages Content */}
          {activeTab === 'pages' && (
            <div className="space-y-12">
              <h2 className="text-xl font-black">دەستکاریکردنی پەڕە گشتییەکان</h2>
              {['about', 'terms', 'works'].map((pageType) => (
                <div key={pageType} className="p-6 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
                  <h3 className="text-lg font-bold text-neutral-800">{pageType === 'about' ? 'دەربارەی ئێمە' : pageType === 'terms' ? 'یاساکان' : 'کارەکانم'}</h3>
                  <textarea value={settings.pages?.[pageType]?.text || ''} onChange={e => { const newPages = {...(settings.pages || {})}; if(!newPages[pageType]) newPages[pageType] = {text: '', links: []}; newPages[pageType].text = e.target.value; setSettings({...settings, pages: newPages}); }} className="w-full p-4 bg-white border border-neutral-300 rounded-2xl h-32 outline-none focus:border-neutral-500 font-medium" placeholder="نوسینەکان لێرە بنووسە..." />
                  <div className="pt-4">
                    <button onClick={() => { const newPages = {...(settings.pages || {})}; if(!newPages[pageType]) newPages[pageType] = {text: '', links: []}; newPages[pageType].links.push({ title: '', url: '' }); setSettings({...settings, pages: newPages}); }} className="px-4 py-2 bg-neutral-200 text-neutral-700 font-bold rounded-xl mb-4 hover:bg-neutral-300 transition">+ زیادکردنی دوگمە</button>
                    <div className="space-y-2">
                      {(settings.pages?.[pageType]?.links || []).map((link: any, idx: number) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2">
                          <input type="text" placeholder="ناوی دوگمە" value={link.title} onChange={e => { const newPages = {...settings.pages}; newPages[pageType].links[idx].title = e.target.value; setSettings({...settings, pages: newPages}); }} className="flex-1 p-3 rounded-xl border" />
                          <input type="url" placeholder="لینکی دوگمە" value={link.url} onChange={e => { const newPages = {...settings.pages}; newPages[pageType].links[idx].url = e.target.value; setSettings({...settings, pages: newPages}); }} className="flex-1 p-3 rounded-xl border" dir="ltr" />
                          <button onClick={() => { const newPages = {...settings.pages}; newPages[pageType].links = newPages[pageType].links.filter((_:any, i:number) => i !== idx); setSettings({...settings, pages: newPages}); }} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"><Trash2 size={18}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: Ads */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black mb-4">ڕیکلامی ئاڵتوونی لای بەکارهێنەران</h2>
              <button onClick={() => setSettings({...settings, ads: [...(settings.ads||[]), { id: Date.now(), title: '', url: '', imageUrl: '', targetOS: 'all', isActive: true }]})} className={`px-6 py-3 rounded-xl font-bold text-white shadow-md ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>+ ڕیکلامی نوێ</button>
              <div className="space-y-6 mt-6">
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                {(settings.ads||[]).map((ad: any, idx: number) => (
                  <div key={ad.id} className="flex flex-col gap-4 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input type="text" placeholder="سەردێڕی ڕیکلام" value={ad.title} onChange={e => { const n = [...settings.ads]; n[idx].title = e.target.value; setSettings({...settings, ads: n}); }} className="flex-1 p-4 rounded-xl outline-none border border-yellow-300 font-bold" />
                      <select value={ad.targetOS} onChange={e => { const n = [...settings.ads]; n[idx].targetOS = e.target.value; setSettings({...settings, ads: n}); }} className="p-4 rounded-xl outline-none border border-yellow-300 font-bold bg-white cursor-pointer">
                        <option value="all">هەموو ئامێرەکان</option><option value="android">تەنها Android</option><option value="ios">تەنها iPhone / iPad</option><option value="windows">تەنها کۆمپیوتەر Windows</option>
                      </select>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input type="url" placeholder="بەستەری ڕیکلامەکە" value={ad.url} onChange={e => { const n = [...settings.ads]; n[idx].url = e.target.value; setSettings({...settings, ads: n}); }} className="flex-1 p-4 rounded-xl outline-none border border-yellow-300 font-bold" dir="ltr" />
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => { const n = [...settings.ads]; const currentStatus = n[idx].isActive !== false; n[idx].isActive = !currentStatus; setSettings({...settings, ads: n}); }} className={`px-4 py-4 rounded-xl font-bold flex items-center gap-2 transition ${ad.isActive !== false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}>{ad.isActive !== false ? <><Eye size={18}/> چالاکە</> : <><EyeOff size={18}/> شاراوەیە</>}</button>
                        <button onClick={() => { fileInputRef.current!.onchange = (e:any) => handleImageUpload(e, 'ads', idx); fileInputRef.current!.click(); }} className="px-4 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl whitespace-nowrap transition"><Camera size={20}/></button>
                        <button onClick={() => { const n = settings.ads.filter((_:any, i:number) => i !== idx); setSettings({...settings, ads: n}); }} className="p-4 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"><Trash2 size={20}/></button>
                      </div>
                    </div>
                    {ad.imageUrl && <img src={ad.imageUrl} className="h-20 w-20 object-cover rounded-xl border border-yellow-400 shadow-sm" alt="Ad Preview" />}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Mobile Save Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 z-40">
         <button onClick={saveSettings} className={`w-full py-4 rounded-2xl font-black text-white shadow-xl ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'} flex justify-center gap-2`}><Save size={20}/> پاشەکەوتکردنی هەمووی</button>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-neutral-900">دەستکاریکردنی پرۆفایل</h2>
            <div className="space-y-5">
              <input type="text" value={editingUser.displayName} onChange={e => setEditingUser({...editingUser, displayName: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-bold outline-none focus:border-neutral-400" placeholder="ناوی تەواو" />
              <textarea value={editingUser.bio} onChange={e => setEditingUser({...editingUser, bio: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-medium outline-none focus:border-neutral-400 h-32 resize-none" placeholder="بایۆ" />
              <input type="text" value={editingUser.slug} onChange={e => setEditingUser({...editingUser, slug: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-bold outline-none focus:border-neutral-400" placeholder="ناوی لینک" dir="ltr" />
              <div className="flex gap-3 pt-4">
                <button onClick={saveUserEdit} className={`flex-1 py-4 text-white rounded-2xl font-bold shadow-lg ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'} transition active:scale-95`}>پاشەکەوت</button>
                <button onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-neutral-100 text-neutral-600 rounded-2xl font-bold hover:bg-neutral-200 transition">پاشگەزبوونەوە</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}