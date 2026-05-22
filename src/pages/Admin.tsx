import { useState, useEffect, useRef } from 'react';
import { Users, LogOut, Trash2, Edit, Save, Key, UserCheck, UserX, Star, Camera, Lock, Share2, Globe, Search, Smartphone, MonitorSmartphone, Settings } from 'lucide-react';

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
  { id: 'asia', name: 'ئاسیا سێڵ', iconName: 'Phone', imageUrl: '/social/asia.png', baseUrl: 'tel:', color: '#ED1C24' },
  { id: 'korek', name: 'کۆڕەک تلیکۆم', iconName: 'Phone', imageUrl: '/social/korek.png', baseUrl: 'tel:', color: '#0054A6' },
  { id: 'fastpay', name: 'FastPay - فاستپەی', iconName: 'Copy', imageUrl: '/social/fastpay.png', baseUrl: 'copy:', color: '#E1137B' },
  { id: 'fib', name: 'FIB - بانکی یەکەمی عێراق', iconName: 'Copy', imageUrl: '/social/fib.png', baseUrl: 'copy:', color: '#8DC63F' },
  { id: 'qicard', name: 'Qi Card', iconName: 'Copy', imageUrl: '/social/qicard.png', baseUrl: 'copy:', color: '#231F20' },
  { id: 'custom', name: 'لینکێکی تایبەت (Custom)', iconName: 'Globe', imageUrl: '', baseUrl: '', color: '#333333' }
];

export default function Admin({ user, onLogout, theme }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ ads: [], socialPlatforms: [], mockup: {} });
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('biokurd_token') || user?.token;
    if (!token) { onLogout(); return; }
    try {
      const [uRes, sRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/public/settings?_t=${Date.now()}`)
      ]);
      const uData = await uRes.json();
      const sData = await sRes.json();
      let finalUsers = (uData && !uData.error && Array.isArray(uData)) ? uData : [];
      setUsers(finalUsers);
      if (sData && !sData.error) setSettings((prev: any) => ({ ...prev, ...sData }));
    } catch (err) { setUsers([]); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveSettings = async () => {
    const token = localStorage.getItem('biokurd_token') || user?.token; setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      if(res.ok) alert('بە سەرکەوتوویی پاشەکەوت کرا!'); else alert('کێشە هەیە!');
    } catch (e) { alert('کێشەی هێڵ هەیە!'); } setSaving(false);
  };

  const handleToggleUser = async (userId: string, currentStatus: boolean) => {
    if (!confirm('دڵنیایت؟')) return;
    const token = localStorage.getItem('biokurd_token') || user?.token;
    await fetch('/api/admin/toggle-user', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, isActive: !currentStatus }) });
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, listType: 'ads' | 'mockup', index?: number, mockupField?: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas'); const MAX = 800; let w = img.width; let h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        if (listType === 'ads' && index !== undefined) {
           setSettings((prev: any) => ({ ...prev, ads: prev.ads.map((ad: any, i: number) => i === index ? { ...ad, imageUrl: base64 } : ad) }));
        } else if (listType === 'mockup' && mockupField) {
           setSettings((prev: any) => ({ ...prev, mockup: { ...prev.mockup, [mockupField]: base64 } }));
        }
      };
    };
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans" dir="rtl">
      <header className="bg-white/80 backdrop-blur-xl border-b border-white sticky top-0 z-30 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-xl flex items-center gap-2 text-slate-800"><Lock size={20} className="text-orange-500" /> داشبۆردی بەڕێوەبەر</div>
          <button onClick={onLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'users' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><Users size={18}/> بەکارهێنەران</button>
          <button onClick={() => setActiveTab('ads')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'ads' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><MonitorSmartphone size={18}/> ڕیکلامی زیرەک</button>
          <button onClick={() => setActiveTab('socials')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'socials' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><Share2 size={18}/> تۆڕەکان</button>
          <button onClick={() => setActiveTab('mockup')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'mockup' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><Smartphone size={18}/> مۆکئەپی سەرەکی</button>
          
          <button onClick={saveSettings} disabled={saving} className="mt-auto hidden lg:flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-black shadow-xl disabled:opacity-50 transition-transform active:scale-95">
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={18}/> پاشەکەوتکردن</>}
          </button>
        </div>

        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
          
          {/* بەکارهێنەران */}
          {activeTab === 'users' && (
             <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                 <div><h2 className="text-xl font-black text-slate-800">سەرجەم بەکارهێنەران ({filteredUsers.length})</h2></div>
                 <div className="relative w-full sm:w-72">
                   <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400"><Search size={18} /></div>
                   <input type="text" placeholder="گەڕان..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-bold text-sm shadow-sm" />
                 </div>
               </div>
               <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100">
                 <table className="w-full text-sm text-right">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100"><tr><th className="px-6 py-4">بەکارهێنەر</th><th className="px-6 py-4 text-center">دەسەڵاتەکان</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-base flex items-center gap-2 text-slate-800">{u.displayName} {u.isPro && <Star size={14} className="text-amber-500 fill-amber-500"/>}</div>
                          <div className="text-xs text-slate-400 mt-1">@{u.username} | {u.email}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-black shadow-sm ${u.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{u.isActive ? 'چالاک' : 'ڕاگیراو'}</span>
                            <button onClick={() => forcePasswordChange(u.id)} className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 border border-purple-100" title="گۆڕینی پاسوۆرد"><Key size={16} /></button>
                            <button onClick={() => setEditingUser(u)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-100" title="دەستکاریکردن"><Edit size={16} /></button>
                            <button onClick={() => handleToggleUser(u.id, u.isActive)} className={`p-1.5 rounded-lg border ${u.isActive ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`} title="چالاککردن / ڕاگرتن">{u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}</button>
                            {u.id !== 0 && <button onClick={() => deleteUser(u.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100" title="سڕینەوە"><Trash2 size={16} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
             </div>
          )}

          {/* ڕیکلامی زیرەک */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                   <h2 className="text-xl font-black text-slate-800">ڕیکلامی زیرەک (Smart Ads)</h2>
                   <p className="text-xs font-bold text-slate-500 mt-1">ئەم ڕیکلامانە بە پێی جۆری مۆبایل نیشان دەدرێن لە بنەوەی لینکەکان.</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setSettings((prev:any) => ({...prev, ads: [...(prev.ads||[]), { id: Date.now(), title: '', url: '', imageUrl: '', targetOS: 'all', isActive: true }] }))} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 active:scale-95 transition-transform">+ ڕیکلام</button>
                </div>
              </div>
              <div className="space-y-4">
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                {(settings.ads||[]).map((ad: any, idx: number) => (
                  <div key={ad.id} className={`p-5 bg-white rounded-[1.5rem] border ${ad.isActive ? 'border-slate-200 shadow-sm' : 'border-dashed border-slate-300 opacity-60'} flex flex-col md:flex-row gap-4 items-center transition-all`}>
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl shrink-0 group relative">
                         {ad.imageUrl ? <img src={ad.imageUrl} className="w-full h-full object-cover rounded-xl" /> : <MonitorSmartphone className="w-full h-full text-slate-300 p-3" />}
                         <button onClick={() => { fileInputRef.current!.onchange = (e:any) => handleImageUpload(e, 'ads', idx); fileInputRef.current!.click(); }} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer rounded-xl backdrop-blur-sm transition-opacity"><Camera size={20}/></button>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                         <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">ناوی ڕیکلام</label>
                            <input type="text" placeholder="ناونیشان..." value={ad.title} onChange={e => setSettings((prev:any) => ({...prev, ads: prev.ads.map((a:any, i:number) => i === idx ? {...a, title: e.target.value} : a)}))} className="p-3 bg-slate-50 border border-slate-200 rounded-xl w-full font-bold text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">بەستەر (URL)</label>
                            <input type="text" placeholder="https://..." value={ad.url} onChange={e => setSettings((prev:any) => ({...prev, ads: prev.ads.map((a:any, i:number) => i === idx ? {...a, url: e.target.value} : a)}))} className="p-3 bg-slate-50 border border-slate-200 rounded-xl w-full font-bold text-sm outline-none focus:border-orange-500 focus:bg-white text-left transition-colors" dir="ltr" />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">جۆری ئامێر (OS)</label>
                            <select value={ad.targetOS || 'all'} onChange={e => setSettings((prev:any) => ({...prev, ads: prev.ads.map((a:any, i:number) => i === idx ? {...a, targetOS: e.target.value} : a)}))} className="p-3 bg-slate-50 border border-slate-200 rounded-xl w-full font-bold text-sm outline-none cursor-pointer">
                               <option value="all">هەموو ئامێرەکان</option>
                               <option value="ios">تەنها ئایفۆن (iOS)</option>
                               <option value="android">تەنها ئەندرۆید</option>
                            </select>
                         </div>
                         <div className="flex gap-2 items-end">
                            <button onClick={() => setSettings((prev:any) => ({...prev, ads: prev.ads.map((a:any, i:number) => i === idx ? {...a, isActive: !a.isActive} : a)}))} className={`flex-1 p-3 rounded-xl font-bold text-sm transition-colors border ${ad.isActive ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}>
                               {ad.isActive ? 'چالاکە' : 'ناچالاکە'}
                            </button>
                            <button onClick={() => setSettings((prev:any) => ({...prev, ads: prev.ads.filter((_:any, i:number) => i !== idx)}))} className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={20}/></button>
                         </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* تۆڕە کۆمەڵایەتییەکان */}
          {activeTab === 'socials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <h2 className="text-xl font-black text-slate-800">ڕێکخستنی تۆڕە کۆمەڵایەتییەکان</h2>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { if(confirm('دڵنیایت لە گێڕانەوەی بەستەرە بنەڕەتییەکان؟')) setSettings((prev:any) => ({...prev, socialPlatforms: DEFAULT_SOCIALS})); }} className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-sm">بنەڕەتییەکان</button>
                  <button onClick={() => setSettings((prev:any) => ({...prev, socialPlatforms: [...(prev.socialPlatforms || []), { id: `platform_${Date.now()}`, name: '', iconName: 'Globe', imageUrl: '', baseUrl: '', color: '#000000' }]}))} className={`px-4 py-2 rounded-xl font-bold text-white shadow-lg shadow-orange-500/30 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-transform`}>+ زیادکردن</button>
                </div>
              </div>
              <div className="space-y-4">
                {(settings.socialPlatforms || []).map((social: any, idx: number) => (
                  <div key={social.id} className="flex flex-col xl:flex-row gap-4 p-5 bg-white rounded-2xl border border-slate-200 items-center shadow-sm">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center relative group" style={{ backgroundColor: social.color + '15' }}>
                      {social.imageUrl ? <img src={social.imageUrl} className="w-full h-full object-contain" /> : <Globe color={social.color} size={28} />}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 w-full">
                      <div><label className="text-xs font-bold text-slate-500 mb-1 block">ناوی تۆڕ</label><input type="text" value={social.name} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, name: e.target.value} : s)}))} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:bg-white font-bold text-sm transition-colors" /></div>
                      <div><label className="text-xs font-bold text-slate-500 mb-1 block">بەستەری بنەڕەت (Base Url)</label><input type="text" placeholder="بۆ کۆپیکردن بنووسە: copy:" value={social.baseUrl} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, baseUrl: e.target.value} : s)}))} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:bg-white font-bold text-sm transition-colors" dir="ltr" /></div>
                      <div><label className="text-xs font-bold text-slate-500 mb-1 block">لینکی وێنەکە (/social/..)</label><input type="text" value={social.imageUrl} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, imageUrl: e.target.value} : s)}))} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:bg-white font-bold text-indigo-600 text-sm transition-colors" dir="ltr" /></div>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1 border border-slate-200 bg-slate-50 rounded-xl p-1.5 h-[46px] flex items-center gap-2">
                          <input type="color" value={social.color} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, color: e.target.value} : s)}))} className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" />
                          <input type="text" value={social.color} onChange={e => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.map((s:any, i:number) => i === idx ? {...s, color: e.target.value} : s)}))} className="w-full bg-transparent text-xs font-bold outline-none" dir="ltr" />
                        </div>
                        <button onClick={() => setSettings((prev:any) => ({...prev, socialPlatforms: prev.socialPlatforms.filter((_:any, i:number) => i !== idx)}))} className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition h-[46px]"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* مۆکئەپ */}
          {activeTab === 'mockup' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-xl font-black text-slate-800">ڕێکخستنی مۆکئەپی سەرەکی</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">ئەم زانیارییانە بۆ ئەو دیزاینە بەکاردێن کە لە پەڕەی سەرەکی و تیتۆریاڵەکاندا نیشان دەدرێن.</p>
              </div>
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">ناوی ناو مۆکئەپ</label>
                    <input type="text" value={settings.mockup?.name || ''} onChange={e => setSettings((prev:any) => ({...prev, mockup: {...prev.mockup, name: e.target.value}}))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 font-bold" />
                 </div>
                 <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">بایۆی ناو مۆکئەپ</label>
                    <input type="text" value={settings.mockup?.bio || ''} onChange={e => setSettings((prev:any) => ({...prev, mockup: {...prev.mockup, bio: e.target.value}}))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 font-bold" />
                 </div>
                 
                 <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">وێنەی پرۆفایلی مۆکئەپ</label>
                    <div className="flex items-center gap-4">
                       <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center relative overflow-hidden group">
                          {settings.mockup?.avatarUrl ? <img src={settings.mockup.avatarUrl} className="w-full h-full object-cover" /> : <Camera className="text-slate-400" />}
                          <button onClick={() => { fileInputRef.current!.onchange = (e:any) => handleImageUpload(e, 'mockup', undefined, 'avatarUrl'); fileInputRef.current!.click(); }} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Camera size={24}/></button>
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">ڕەنگی ناوەکان لە مۆکئەپ</label>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl w-max">
                      <input type="color" value={settings.mockup?.textColor || '#000000'} onChange={e => setSettings((prev:any) => ({...prev, mockup: {...prev.mockup, textColor: e.target.value}}))} className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0" />
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* دوگمەی پاشەکەوتی خێرا بۆ مۆبایل */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-40 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
         <button onClick={saveSettings} disabled={saving} className={`w-full py-4 rounded-2xl font-black text-white shadow-xl bg-slate-900 hover:bg-black active:scale-95 transition-transform flex justify-center items-center gap-2 disabled:opacity-50`}>
           {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={20}/> پاشەکەوتکردنی هەمووی</>}
         </button>
      </div>

      {/* Editing User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-white">
            <h2 className="text-2xl font-black mb-6 text-slate-800">دەستکاری پرۆفایل</h2>
            <div className="space-y-5">
              <input type="text" value={editingUser.displayName} onChange={e => setEditingUser({...editingUser, displayName: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors" placeholder="ناوی تەواو" />
              <textarea value={editingUser.bio} onChange={e => setEditingUser({...editingUser, bio: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none h-32 resize-none focus:border-orange-500 focus:bg-white transition-colors" placeholder="بایۆ" />
              <input type="text" value={editingUser.slug} onChange={e => setEditingUser({...editingUser, slug: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors" placeholder="ناوی لینک" dir="ltr" />
              <div className="flex gap-3 pt-4">
                <button onClick={saveUserEdit} className={`flex-1 py-4 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 bg-gradient-to-br from-orange-400 to-orange-500 hover:to-orange-600 transition active:scale-95`}>پاشەکەوت</button>
                <button onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">لابردن</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}