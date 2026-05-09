import { useState, useEffect, useRef } from 'react';
import { Users, LogOut, Trash2, Edit, Save, Key, UserCheck, UserX, Star, Link as LinkIcon, Camera, Lock, Share2, Globe, Eye, EyeOff, Search, BarChart3, TrendingUp, MousePointerClick, CalendarDays } from 'lucide-react';

interface Props { user: any; onLogout: () => void; theme: any; }

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

export default function Admin({ user, onLogout, theme }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalVisits: 0, totalClicks: 0, dailyActiveUsers: 0, monthlyActiveUsers: 0 });
  const [settings, setSettings] = useState<any>({ globalButtons: [], ads: [], socialPlatforms: [] });
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) { onLogout(); return; }

    try {
      const [uRes, sRes, statsRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/public/settings?_t=${Date.now()}`),
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const uData = await uRes.json();
      const sData = await sRes.json();
      const statsData = await statsRes.json();

      let finalUsers = (uData && !uData.error && Array.isArray(uData)) ? uData : [];
      setUsers(finalUsers);
      if (sData && !sData.error) setSettings((prev: any) => ({ ...prev, ...sData }));
      
      if (statsData && !statsData.error) {
          setStats(statsData);
      } else {
          const totalV = finalUsers.reduce((acc: number, curr: any) => acc + (curr.visits || 0), 0);
          const totalC = finalUsers.reduce((acc: number, curr: any) => acc + (curr.clicks || 0), 0);
          setStats({ totalVisits: totalV, totalClicks: totalC, dailyActiveUsers: 0, monthlyActiveUsers: 0 });
      }
    } catch (err) { console.error(err); setUsers([]); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveSettings = async () => {
    const token = localStorage.getItem('biokurd_token') || user?.token; setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      if(res.ok) alert('پاشەکەوت کرا!'); else alert('کێشە هەیە!');
    } catch (e) { alert('کێشەی هێڵ هەیە!'); } setSaving(false);
  };

  const handleToggleUser = async (userId: string, currentStatus: boolean) => {
    if (!confirm('دڵنیایت؟')) return;
    const token = localStorage.getItem('biokurd_token') || user?.token;
    await fetch('/api/admin/toggle-user', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, isActive: !currentStatus }) });
    fetchData();
  };

  const handleTogglePro = async (userId: string, currentStatus: boolean) => {
    if (!confirm('دڵنیایت لە گۆڕینی VIP؟')) return;
    const token = localStorage.getItem('biokurd_token') || user?.token;
    await fetch('/api/admin/toggle-pro', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, isPro: !currentStatus }) });
    fetchData();
  };

  const forcePasswordChange = async (targetId: number) => {
    const newPass = prompt("پاسوۆردی نوێ:"); if (!newPass) return;
    const token = localStorage.getItem('biokurd_token') || user?.token;
    await fetch('/api/admin/force-password', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId, newPassword: newPass }) });
    alert("گۆڕدرا!");
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('بە یەکجاری دەسڕێتەوە، دڵنیایت؟')) return;
    const token = localStorage.getItem('biokurd_token') || user?.token;
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchData();
  };

  const saveUserEdit = async () => {
    const token = localStorage.getItem('biokurd_token') || user?.token;
    await fetch('/api/admin/edit-user', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(editingUser) });
    setEditingUser(null); fetchData();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, listType: 'ads' | 'globalButtons', index?: number) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas'); const MAX = 800; let w = img.width; let h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        if (listType === 'ads' && index !== undefined) setSettings((prev: any) => ({ ...prev, ads: prev.ads.map((ad: any, i: number) => i === index ? { ...ad, imageUrl: base64 } : ad) }));
        else if (listType === 'globalButtons' && index !== undefined) setSettings((prev: any) => ({ ...prev, globalButtons: prev.globalButtons.map((btn: any, i: number) => i === index ? { ...btn, imageUrl: base64 } : btn) }));
      };
    };
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  const rankedUsers = [...safeUsers].sort((a, b) => ((b.visits || 0) + (b.clicks || 0)) - ((a.visits || 0) + (a.clicks || 0)));

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-[100dvh] bg-neutral-50 font-sans" dir="rtl">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-xl flex items-center gap-2 text-orange-500"><Lock size={20} /> بەڕێوەبەر</div>
          <button onClick={onLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'stats' ? 'bg-orange-500 text-white' : 'bg-white text-neutral-500'}`}><BarChart3 size={18}/> ئامار</button>
          <button onClick={() => setActiveTab('ranking')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'ranking' ? 'bg-orange-500 text-white' : 'bg-white text-neutral-500'}`}><TrendingUp size={18}/> ڕیزبەندی</button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'users' ? 'bg-orange-500 text-white' : 'bg-white text-neutral-500'}`}><Users size={18}/> بەکارهێنەران</button>
          <button onClick={() => setActiveTab('ads')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'ads' ? 'bg-orange-500 text-white' : 'bg-white text-neutral-500'}`}><Star size={18}/> ڕیکلام (VIP)</button>
          <button onClick={() => setActiveTab('buttons')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'buttons' ? 'bg-orange-500 text-white' : 'bg-white text-neutral-500'}`}><LinkIcon size={18}/> بەستەری گشتی</button>
          <button onClick={() => setActiveTab('socials')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'socials' ? 'bg-orange-500 text-white' : 'bg-white text-neutral-500'}`}><Share2 size={18}/> تۆڕەکان</button>
          
          <button onClick={saveSettings} disabled={saving} className="mt-auto hidden lg:flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50">
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={18}/> پاشەکەوتکردن</>}
          </button>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-neutral-100 overflow-hidden">
          
          {activeTab === 'stats' && (
             <div className="space-y-6">
                 <div><h2 className="text-xl font-black text-neutral-900">ئاماری گشتی سیستەم</h2></div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-2"><TrendingUp size={24}/></div>
                        <h3 className="text-3xl font-black text-neutral-900">{stats.totalVisits || 0}</h3>
                        <p className="text-sm font-bold text-neutral-500">سەردانەکان</p>
                     </div>
                     <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-2"><MousePointerClick size={24}/></div>
                        <h3 className="text-3xl font-black text-neutral-900">{stats.totalClicks || 0}</h3>
                        <p className="text-sm font-bold text-neutral-500">کلیکەکان</p>
                     </div>
                 </div>
             </div>
          )}

          {activeTab === 'users' && (
             <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                 <div><h2 className="text-xl font-black text-neutral-900">سەرجەم بەکارهێنەران</h2></div>
                 <div className="relative w-full sm:w-72">
                   <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-400"><Search size={18} /></div>
                   <input type="text" placeholder="گەڕان..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-bold text-sm" />
                 </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-right">
                  <thead className="bg-neutral-50 text-neutral-500"><tr><th className="px-6 py-4 rounded-r-xl">بەکارهێنەر</th><th className="px-6 py-4 text-center rounded-l-xl">دەسەڵاتەکان</th></tr></thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-base flex items-center gap-2">{u.displayName} {u.isPro && <Star size={14} className="text-amber-500 fill-amber-500"/>}</div>
                          <div className="text-xs text-neutral-400 mt-1">@{u.username} | {u.email}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-black ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'چالاک' : 'ڕاگیراو'}</span>
                            <button onClick={() => handleTogglePro(u.id, u.isPro)} className={`px-2 py-1 rounded-lg text-xs font-black transition shadow-sm ${u.isPro ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>{u.isPro ? 'VIP' : 'Free'}</button>
                            <button onClick={() => forcePasswordChange(u.id)} className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100" title="گۆڕینی پاسوۆرد"><Key size={16} /></button>
                            <button onClick={() => setEditingUser(u)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="دەستکاریکردن"><Edit size={16} /></button>
                            <button onClick={() => handleToggleUser(u.id, u.isActive)} className={`p-1.5 rounded-lg ${u.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`} title="چالاککردن / ڕاگرتن">{u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}</button>
                            {u.id !== 0 && <button onClick={() => deleteUser(u.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="سڕینەوە"><Trash2 size={16} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
             </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                <h2 className="text-xl font-black">ڕیکلامەکان (VIP)</h2>
                <div className="flex gap-2">
                   <button onClick={() => setSettings((prev:any) => ({...prev, ads: [...(prev.ads||[]), { id: Date.now(), title: 'نوێ', url: '', imageUrl: '', targetOS: 'all', isActive: true }] }))} className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold">+ زیادکردن</button>
                   <button onClick={saveSettings} className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2"><Save size={16}/> سەیڤ</button>
                </div>
              </div>
              <div className="space-y-4">
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                {(settings.ads||[]).map((ad: any, idx: number) => (
                  <div key={ad.id} className="p-4 bg-neutral-50 rounded-2xl border flex flex-col md:flex-row gap-4 items-center">
                      <div className="w-16 h-16 bg-white border p-1 rounded-xl shrink-0 group relative">
                         {ad.imageUrl ? <img src={ad.imageUrl} className="w-full h-full object-cover rounded-lg" /> : <Star className="w-full h-full text-amber-400 p-2" />}
                         <button onClick={() => { fileInputRef.current!.onchange = (e:any) => handleImageUpload(e, 'ads', idx); fileInputRef.current!.click(); }} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer rounded-lg"><Camera size={20}/></button>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                         <input type="text" placeholder="ناو" value={ad.title} onChange={e => setSettings((prev:any) => ({...prev, ads: prev.ads.map((a:any, i:number) => i === idx ? {...a, title: e.target.value} : a)}))} className="p-2 border rounded-lg w-full font-bold text-sm outline-none" />
                         <input type="text" placeholder="URL" value={ad.url} onChange={e => setSettings((prev:any) => ({...prev, ads: prev.ads.map((a:any, i:number) => i === idx ? {...a, url: e.target.value} : a)}))} className="p-2 border rounded-lg w-full font-bold text-sm outline-none text-left" dir="ltr" />
                      </div>
                      <button onClick={() => setSettings((prev:any) => ({...prev, ads: prev.ads.filter((_:any, i:number) => i !== idx)}))} className="p-3 bg-red-100 text-red-600 rounded-xl"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'buttons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                <h2 className="text-xl font-black">بەستەرە گشتییەکان</h2>
                <div className="flex gap-2">
                   <button onClick={() => setSettings((prev:any) => ({...prev, globalButtons: [...(prev.globalButtons||[]), { id: Date.now(), title: '', url: '', icon: 'Globe', imageUrl: '' }] }))} className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold">+ بەستەر</button>
                   <button onClick={saveSettings} className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2"><Save size={16}/> سەیڤ</button>
                </div>
              </div>
              <div className="space-y-4">
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                {(settings.globalButtons||[]).map((btn: any, idx: number) => (
                  <div key={btn.id} className="p-4 bg-neutral-50 rounded-2xl border flex flex-col md:flex-row gap-4 items-center">
                      <div className="w-12 h-12 bg-white border p-1 rounded-xl shrink-0 group relative">
                         {btn.imageUrl ? <img src={btn.imageUrl} className="w-full h-full object-contain rounded-lg" /> : <LinkIcon className="w-full h-full text-neutral-400 p-2" />}
                         <button onClick={() => { fileInputRef.current!.onchange = (e:any) => handleImageUpload(e, 'globalButtons', idx); fileInputRef.current!.click(); }} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer rounded-lg"><Camera size={16}/></button>
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                         <input type="text" placeholder="ناو" value={btn.title} onChange={e => setSettings((prev:any) => ({...prev, globalButtons: prev.globalButtons.map((b:any, i:number) => i === idx ? {...b, title: e.target.value} : b)}))} className="p-2 border rounded-lg w-full font-bold text-sm outline-none" />
                         <input type="url" placeholder="URL" value={btn.url} onChange={e => setSettings((prev:any) => ({...prev, globalButtons: prev.globalButtons.map((b:any, i:number) => i === idx ? {...b, url: e.target.value} : b)}))} className="p-2 border rounded-lg w-full font-bold text-sm outline-none text-left" dir="ltr" />
                      </div>
                      <button onClick={() => setSettings((prev:any) => ({...prev, globalButtons: prev.globalButtons.filter((_:any, i:number) => i !== idx)}))} className="p-3 bg-red-100 text-red-600 rounded-xl"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'socials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                <h2 className="text-xl font-black">ڕێکخستنی تۆڕە کۆمەڵایەتییەکان</h2>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { if(confirm('دڵنیایت لەم کارە؟')) setSettings((prev:any) => ({...prev, socialPlatforms: DEFAULT_SOCIALS})); }} className="px-4 py-2 rounded-xl font-bold bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition text-sm">بنەڕەتییەکان</button>
                  <button onClick={() => setSettings((prev:any) => ({...prev, socialPlatforms: [...(prev.socialPlatforms || []), { id: `platform_${Date.now()}`, name: '', iconName: 'Globe', imageUrl: '', baseUrl: '', color: '#000000' }]}))} className={`px-4 py-2 rounded-xl font-bold text-white shadow-md bg-orange-500 hover:bg-orange-600`}>+ زیادکردن</button>
                  <button onClick={saveSettings} disabled={saving} className={`px-4 py-2 rounded-xl font-bold text-white shadow-md bg-green-500 hover:bg-green-600 transition flex items-center justify-center gap-2`}>
                     {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={16}/> سەیڤ</>}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {(settings.socialPlatforms || []).map((social: any, idx: number) => (
                  <div key={social.id} className="flex flex-col xl:flex-row gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 items-center shadow-sm">
                    <div className="w-14 h-14 shrink-0 rounded-[14px] bg-white border border-neutral-200 p-2 flex items-center justify-center" style={{ backgroundColor: social.color + '15' }}>
                      {social.imageUrl ? <img src={social.imageUrl} className="w-full h-full object-contain" /> : <Globe color={social.color} size={28} />}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 w-full">
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">ناوی تۆڕ</label><input type="text" value={social.name} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, name: e.target.value} : s)}))} className="w-full p-3 rounded-xl border outline-none font-bold text-sm" /></div>
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">بەستەری بنەڕەت</label><input type="text" value={social.baseUrl} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, baseUrl: e.target.value} : s)}))} className="w-full p-3 rounded-xl border outline-none font-bold text-sm" dir="ltr" /></div>
                      <div><label className="text-xs font-bold text-neutral-500 mb-1 block">وێنەی ئایکۆن</label><input type="text" value={social.imageUrl} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, imageUrl: e.target.value} : s)}))} className="w-full p-3 rounded-xl border outline-none font-bold text-indigo-600 text-sm" dir="ltr" /></div>
                      <div className="flex gap-3 items-end">
                        <div className="flex-1 border bg-white rounded-xl p-1.5 h-[46px] flex items-center gap-2">
                          <input type="color" value={social.color} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, color: e.target.value} : s)}))} className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" />
                          <input type="text" value={social.color} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, color: e.target.value} : s)}))} className="w-full text-xs font-bold outline-none" dir="ltr" />
                        </div>
                        <button onClick={() => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.filter((_:any, i:number) => i !== idx)}))} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition h-[46px]"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
             <div className="space-y-6">
                 <div><h2 className="text-xl font-black text-neutral-900">ڕیزبەندی ئەندامان</h2></div>
                 <div className="space-y-3">
                    {rankedUsers.slice(0, 50).map((u, index) => (
                       <div key={u.id} className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
                          <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-white ${index === 0 ? 'bg-amber-400' : 'bg-neutral-300'}`}>#{index + 1}</div>
                          <div className="flex-1">
                             <div className="font-black text-neutral-900">{u.displayName || u.username} {u.isPro && <Star size={12} className="text-amber-500 inline fill-amber-500"/>}</div>
                             <div className="text-xs text-neutral-500 font-bold">@{u.username}</div>
                          </div>
                          <div className="flex gap-4 text-sm font-bold">
                             <div className="text-orange-500 flex flex-col items-center"><TrendingUp size={16}/>{u.visits || 0}</div>
                             <div className="text-blue-500 flex flex-col items-center"><MousePointerClick size={16}/>{u.clicks || 0}</div>
                          </div>
                       </div>
                    ))}
                 </div>
             </div>
          )}

        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 z-40 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
         <button onClick={saveSettings} disabled={saving} className={`w-full py-4 rounded-2xl font-black text-white shadow-xl bg-orange-500 hover:bg-orange-600 flex justify-center items-center gap-2 disabled:opacity-50`}>
           {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={20}/> پاشەکەوتکردنی هەمووی</>}
         </button>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-neutral-900">دەستکاری پرۆفایل</h2>
            <div className="space-y-5">
              <input type="text" value={editingUser.displayName} onChange={e => setEditingUser({...editingUser, displayName: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-bold outline-none focus:border-neutral-400" placeholder="ناوی تەواو" />
              <textarea value={editingUser.bio} onChange={e => setEditingUser({...editingUser, bio: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-medium outline-none h-32 resize-none" placeholder="بایۆ" />
              <input type="text" value={editingUser.slug} onChange={e => setEditingUser({...editingUser, slug: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-bold outline-none" placeholder="ناوی لینک" dir="ltr" />
              <div className="flex gap-3 pt-4">
                <button onClick={saveUserEdit} className={`flex-1 py-4 text-white rounded-2xl font-bold shadow-lg bg-orange-500 hover:bg-orange-600 transition`}>پاشەکەوت</button>
                <button onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-neutral-100 text-neutral-600 rounded-2xl font-bold hover:bg-neutral-200 transition">لابردن</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}