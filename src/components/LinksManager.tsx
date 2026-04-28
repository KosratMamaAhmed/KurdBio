import { useState, useRef } from 'react';
import { Share2, Plus, Trash2, GripVertical, Link as LinkIcon, Image as ImageIcon, Camera, X } from 'lucide-react';
import * as icons from 'lucide-react';

export default function LinksManager({ user, profile, setProfile, settings, theme }: any) {
  const [addingLink, setAddingLink] = useState(false);
  const [addingCustomLink, setAddingCustomLink] = useState(false);
  
  // داتای بەستەری گشتی (لۆگۆدار)
  const [customLinkData, setCustomLinkData] = useState({ title: '', url: '', logoBase64: '' });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const customLogoRef = useRef<HTMLInputElement>(null);

  const handleAddSocialLink = async (platformId: string) => {
    const platform = settings?.socialPlatforms?.find((p:any) => p.id === platformId);
    if(!platform) return;
    
    // دروستکردنی کاتی بۆ ئەوەی خێرا دەربکەوێت
    const tempId = Date.now();
    const newLink = { 
      id: tempId, 
      title: platform.name, 
      url: platform.baseUrl, 
      icon: platform.iconName, 
      color: platform.color, 
      platformId: platform.id, 
      imageUrl: platform.imageUrl 
    };
    
    setProfile({...profile, links: [...(profile.links||[]), newLink]});
    setAddingLink(false);
    
    // ناردن بۆ باکێند
    try {
      const res = await fetch('/api/links', { method: 'POST', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(newLink) });
      const data = await res.json();
      if(data.success) {
        setProfile((prev: any) => ({...prev, links: prev.links.map((l:any) => l.id === tempId ? {...l, id: data.linkId} : l)}));
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleAddCustomLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkData.title || !customLinkData.url) return alert("تکایە ناو و لینکی بەستەرەکە پڕبکەرەوە");

    const tempId = Date.now();
    const newLink = { 
      id: tempId, 
      title: customLinkData.title, 
      url: customLinkData.url, 
      icon: 'Link', // ئایکۆنی بنەڕەتی گەر لۆگۆی دانەنا
      color: '#10b981', // ڕەنگی سەوز بۆ بەستەری گشتی
      platformId: 'custom', 
      imageUrl: customLinkData.logoBase64 
    };

    setProfile({...profile, links: [...(profile.links||[]), newLink]});
    setAddingCustomLink(false);
    setCustomLinkData({ title: '', url: '', logoBase64: '' });
    
    try {
      const res = await fetch('/api/links', { method: 'POST', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(newLink) });
      const data = await res.json();
      if(data.success) {
        setProfile((prev: any) => ({...prev, links: prev.links.map((l:any) => l.id === tempId ? {...l, id: data.linkId} : l)}));
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsUploadingLogo(true);
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 256; // بچووککردنەوە بۆ 256x256
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } } else { if (height > MAX) { width *= MAX / height; height = MAX; } }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
        setCustomLinkData({ ...customLinkData, logoBase64: canvas.toDataURL('image/png', 0.9) });
        setIsUploadingLogo(false);
      };
    };
  };

  const updateLink = (id: number, field: string, value: string) => {
    setProfile({...profile, links: profile.links.map((l:any) => l.id === id ? {...l, [field]: value} : l)});
  };

  const saveLinkUpdate = async (linkId: number) => {
    const link = profile.links.find((l:any) => l.id === linkId);
    if(!link) return;
    await fetch(`/api/links/${linkId}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(link) });
  };

  const removeLink = async (id: number) => {
    if(!confirm('دڵنیایت لە سڕینەوەی ئەم بەستەرە؟')) return;
    setProfile({...profile, links: profile.links.filter((l:any) => l.id !== id)});
    await fetch(`/api/links/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` } });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 mb-8 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl text-white ${theme?.main || 'bg-orange-500'} shadow-lg`}><Share2 size={24}/></div>
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">بەستەرەکانم</h2>
            <p className="text-sm font-bold text-neutral-500 mt-1">تۆڕە کۆمەڵایەتییەکان یان بەستەری تایبەت زیاد بکە.</p>
          </div>
        </div>
      </div>

      {/* 🌟 فۆڕمی زیادکردنی بەستەری گشتی بە لۆگۆوە 🌟 */}
      {addingCustomLink ? (
        <form onSubmit={handleAddCustomLink} className="mb-8 bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl animate-[fadeIn_0.3s_ease-out]">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-black text-emerald-800 text-lg flex items-center gap-2"><LinkIcon size={20}/> بەستەری نوێ دروست بکە</h3>
             <button type="button" onClick={() => setAddingCustomLink(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors"><X size={20}/></button>
           </div>
           
           <div className="space-y-4">
             <div>
               <label className="text-xs font-black text-emerald-700 mb-2 block">ناوی بەستەر</label>
               <input type="text" placeholder="بۆ نموونە: ماڵپەڕی سەرەکیم" value={customLinkData.title} onChange={e => setCustomLinkData({...customLinkData, title: e.target.value})} className="w-full p-4 bg-white border border-emerald-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm shadow-sm transition-all" required />
             </div>
             
             <div>
               <label className="text-xs font-black text-emerald-700 mb-2 block">لینکەکە لێرە دابنێ</label>
               <input type="url" placeholder="https://..." value={customLinkData.url} onChange={e => setCustomLinkData({...customLinkData, url: e.target.value})} className="w-full p-4 bg-white border border-emerald-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm shadow-sm transition-all" dir="ltr" required />
             </div>

             <div>
               <label className="text-xs font-black text-emerald-700 mb-2 block">لۆگۆی بەستەر (ئارەزوومەندانە)</label>
               <input type="file" ref={customLogoRef} accept="image/*" onChange={handleCustomLogoUpload} className="hidden" />
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-200 p-2 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                   {isUploadingLogo ? <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> 
                   : customLinkData.logoBase64 ? <img src={customLinkData.logoBase64} className="w-full h-full object-contain" /> 
                   : <ImageIcon className="text-emerald-200" size={24}/>}
                 </div>
                 <button type="button" onClick={() => customLogoRef.current?.click()} className="px-5 py-3.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black rounded-xl transition shadow-sm flex items-center gap-2 text-sm">
                   <Camera size={18}/> هەڵبژاردنی وێنە
                 </button>
               </div>
             </div>

             <button type="submit" className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95 mt-2">
               زیادکردنی بەستەر
             </button>
           </div>
        </form>
      ) : addingLink ? (
        <div className="mb-8 p-6 bg-neutral-50 rounded-3xl border border-neutral-100 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-black text-neutral-800">تۆڕێک هەڵبژێرە</h3>
             <button onClick={() => setAddingLink(false)} className="text-neutral-400 hover:text-neutral-600"><X size={20}/></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2 pb-2">
            {(settings?.socialPlatforms || []).map((p: any) => {
              const Icon = (icons as any)[p.iconName] || icons.Globe;
              return (
                <button key={p.id} onClick={() => handleAddSocialLink(p.id)} className="flex flex-col items-center gap-3 p-4 bg-white border border-neutral-200 rounded-2xl hover:border-orange-300 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: p.color + '15' }}>
                    {p.imageUrl ? <img src={p.imageUrl} className="w-7 h-7 object-contain" /> : <Icon size={24} color={p.color} />}
                  </div>
                  <span className="font-black text-xs text-neutral-700">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
           <button onClick={() => setAddingLink(true)} className={`flex-1 py-4 sm:py-5 border-2 border-dashed ${theme?.border || 'border-orange-200'} rounded-2xl text-neutral-600 font-black flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all hover:border-orange-400 text-sm sm:text-base`}>
             <Plus size={20}/> تۆڕی کۆمەڵایەتی
           </button>
           <button onClick={() => setAddingCustomLink(true)} className={`flex-1 py-4 sm:py-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-emerald-700 font-black flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all shadow-sm text-sm sm:text-base`}>
             <LinkIcon size={20}/> بەستەری گشتی بە لۆگۆ
           </button>
        </div>
      )}

      {/* 🌟 لیستی بەستەرەکان 🌟 */}
      <div className="space-y-4 relative z-10">
        {(!profile?.links || profile.links.length === 0) ? (
          <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-neutral-100">
            <Share2 size={40} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-neutral-500 font-bold">هێشتا هیچ بەستەرێکت زیاد نەکردووە!</p>
          </div>
        ) : (
          profile.links.map((link: any, index: number) => {
            const Icon = (icons as any)[link.icon || 'Globe'] || icons.Globe;
            const isCustom = link.platformId === 'custom' || link.platformId === 'apk';
            
            return (
              <div key={link.id} className={`group flex flex-col xl:flex-row gap-4 p-4 sm:p-5 bg-white rounded-3xl border ${isCustom ? 'border-emerald-200' : 'border-neutral-200'} items-start xl:items-center shadow-sm hover:shadow-md transition-all`}>
                
                <div className="flex items-center gap-4 w-full xl:w-auto">
                  <div className="cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 shrink-0 hidden sm:block">
                    <GripVertical size={20}/>
                  </div>
                  
                  <div className={`w-14 h-14 shrink-0 rounded-[14px] overflow-hidden ${isCustom ? 'bg-emerald-50' : 'bg-neutral-50'} border border-neutral-100 p-2.5 flex items-center justify-center shadow-inner`}>
                    {link.imageUrl ? <img src={link.imageUrl} className="w-full h-full object-contain" /> : <Icon size={28} color={link.color} />}
                  </div>
                  
                  {/* ناو بۆ مۆبایل */}
                  <div className="xl:hidden flex-1">
                    <input type="text" value={link.title} onChange={e => updateLink(link.id, 'title', e.target.value)} onBlur={() => saveLinkUpdate(link.id)} className="w-full bg-transparent font-black text-lg outline-none text-neutral-800 placeholder-neutral-400" />
                  </div>
                  
                  <button onClick={() => removeLink(link.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition xl:hidden shrink-0">
                    <Trash2 size={20}/>
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div className="hidden xl:block">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 block">ناوی بەستەر</label>
                    <input type="text" value={link.title} onChange={e => updateLink(link.id, 'title', e.target.value)} onBlur={() => saveLinkUpdate(link.id)} className="w-full p-3.5 bg-neutral-50 rounded-xl border-transparent focus:bg-white focus:border-orange-300 outline-none font-bold transition-all shadow-inner" />
                  </div>
                  <div className="col-span-1 md:col-span-2 xl:col-span-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 block">لینک (URL)</label>
                    <input type="text" value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} onBlur={() => saveLinkUpdate(link.id)} className="w-full p-3.5 bg-neutral-50 rounded-xl border-transparent focus:bg-white focus:border-orange-300 outline-none font-bold text-sm transition-all shadow-inner" dir="ltr" />
                  </div>
                </div>

                <button onClick={() => removeLink(link.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition hidden xl:block shrink-0 shadow-sm">
                  <Trash2 size={20}/>
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}