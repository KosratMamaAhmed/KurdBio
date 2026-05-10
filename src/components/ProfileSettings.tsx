import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, FileText, Save, Image as ImageIcon, Lock, Palette, Star, UploadCloud, CheckCircle } from 'lucide-react';

export default function ProfileSettings({ profile, setProfile, saving, handleUpdateProfile, handleImageUpload, isUploadingAvatar, avatarInputRef }: any) {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  // لۆجیکی ڕاکێشان و بەردانی وێنە (Drag & Drop) بەبێ سەیڤکردنی ڕاستەوخۆ
  const handleDrag = (e: any) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") { setDragActive(true); } 
    else if (e.type === "dragleave") { setDragActive(false); }
  };

  const handleDrop = (e: any) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (!profile?.isPro) return; 
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader(); reader.readAsDataURL(file);
      // تەنها لەسەر شاشەکە دەیگۆڕێت، نایخاتە داتابەیس تا پاشەکەوت نەکەیت
      reader.onload = (ev) => setProfile({...profile, bgImage: ev.target?.result as string});
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-200 shadow-sm relative overflow-hidden">
      
      <h2 className="text-xl font-black text-neutral-900 mb-8 flex items-center gap-2 border-b border-neutral-100 pb-4">
        <User className="text-orange-500" size={24} /> ڕێکخستنی پرۆفایل
      </h2>

      {/* 🌟 باکگراوندەکە زۆر فراوانکرا و Drag & Drop جێبەجێکرا 🌟 */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
           <label className="text-sm font-black text-neutral-700 flex items-center gap-2">
              <ImageIcon size={18} className={profile?.isPro ? "text-orange-500" : "text-neutral-400"} /> وێنەی باکگراوند (Cover)
           </label>
           {!profile?.isPro && (
             <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1"><Star size={12}/> تایبەت بە VIP</span>
           )}
        </div>

        {profile?.isPro ? (
           <div 
             onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
             className={`relative w-full h-[280px] sm:h-[400px] rounded-[2rem] bg-neutral-900 overflow-hidden border-2 border-dashed transition-all shadow-sm group ${dragActive ? 'border-orange-500 scale-[1.02] bg-orange-50' : 'border-neutral-300 hover:border-orange-400'}`}
           >
             {profile?.bgImage ? (
               <img src={profile.bgImage} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Background" />
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                 <UploadCloud size={56} className={`mb-4 transition-colors ${dragActive ? 'text-orange-500' : 'opacity-60'}`} />
                 <span className="text-base font-black text-neutral-700 mb-1">وێنەیەک ڕابکێشە ئێرە</span>
                 <span className="text-xs font-bold opacity-70">(Drag & Drop) یان کلیک بکە</span>
               </div>
             )}
             
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <label className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-black text-sm cursor-pointer hover:bg-white/30 transition shadow-xl flex items-center gap-2 border border-white/20">
                 <input type="file" accept="image/*" className="hidden" onChange={(e:any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                       const reader = new FileReader(); reader.readAsDataURL(file);
                       reader.onload = (ev) => setProfile({...profile, bgImage: ev.target?.result as string});
                    }
                 }} />
                 <Camera size={18} /> هەڵبژاردنی وێنە
               </label>
             </div>
           </div>
        ) : (
           <div className="relative w-full h-[280px] sm:h-[400px] rounded-[2rem] bg-neutral-100 overflow-hidden border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-center p-6 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-neutral-200 text-amber-500">
                 <Lock size={28} />
              </div>
              <h3 className="font-black text-neutral-800 text-lg mb-2">باکگراوند داخراوە!</h3>
              <p className="text-xs font-bold text-neutral-500 mb-6 max-w-[250px]">بۆ گۆڕینی باکگراوند و جوانترکردنی پرۆفایلەکەت، پێویستە هەژمارەکەت بکەیتە VIP.</p>
              <button onClick={() => navigate('/payment')} className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                 <Star size={18} /> بەرزکردنەوە بۆ VIP
              </button>
           </div>
        )}
      </div>

      <div className="mb-10 pb-8 border-b border-neutral-100">
        <label className="text-sm font-black text-neutral-700 mb-3 flex items-center gap-2">
           <User size={18} className="text-blue-500" /> وێنەی پرۆفایل (Avatar)
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
           <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-neutral-50 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center group/avatar shrink-0">
             {isUploadingAvatar ? (
               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             ) : profile?.avatarUrl ? (
               <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
             ) : (
               <User size={40} className="text-neutral-300" />
             )}
             <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
               <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} />
               <Camera size={32} />
             </label>
           </div>
           <div className="text-xs font-bold text-neutral-500 leading-relaxed bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex-1">
             <span className="text-blue-600 block mb-1.5 font-black flex items-center gap-1.5"><CheckCircle size={14}/> تێبینی:</span>
             گۆڕینی وێنەی پرۆفایل بۆ هەموو بەکارهێنەران بە خۆڕاییە. تکایە با قەبارەی وێنەکەت لە 2MB کەمتر بێت.
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div>
          <label className="text-sm font-bold text-neutral-600 block mb-2">ناوی تەواو</label>
          <input 
            type="text" 
            value={profile?.displayName || ''} 
            onChange={e => setProfile({...profile, displayName: e.target.value})} 
            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:bg-white focus:border-orange-500 font-bold transition-colors" 
            placeholder="ناوەکەت بنووسە..."
          />
        </div>
        
        <div>
          <label className="text-sm font-bold text-neutral-600 mb-2 flex items-center gap-2">
             ناوی لینک (یوزەرنەیم) <Lock size={14} className="text-red-400" />
          </label>
          <div className="relative opacity-70">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-sm" dir="ltr">biokurd.com/</span>
            <input 
              type="text" 
              value={profile?.slug || ''} 
              disabled={true}
              className="w-full p-4 pl-[115px] bg-neutral-200 border border-neutral-300 rounded-2xl outline-none font-bold text-left text-neutral-600 cursor-not-allowed" 
              dir="ltr"
            />
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100 mt-2">
           <div>
              <label className="text-xs font-black text-neutral-600 mb-2 flex items-center gap-1"><Palette size={14}/> ڕەنگی ناو</label>
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-neutral-200">
                <input type="color" value={profile?.nameColor || '#000000'} onChange={e => setProfile({...profile, nameColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono font-bold text-neutral-500" dir="ltr">{profile?.nameColor || '#000000'}</span>
              </div>
           </div>
           <div>
              <label className="text-xs font-black text-neutral-600 mb-2 flex items-center gap-1"><Palette size={14}/> ڕەنگی بایۆ</label>
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-neutral-200">
                <input type="color" value={profile?.bioColor || '#10b981'} onChange={e => setProfile({...profile, bioColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono font-bold text-neutral-500" dir="ltr">{profile?.bioColor || '#10b981'}</span>
              </div>
           </div>
        </div>

        <div className="md:col-span-2 mt-2">
          <label className="text-sm font-bold text-neutral-600 mb-2 flex items-center gap-2"><FileText size={16}/> کورتەیەک دەربارەی خۆت (بایۆ)</label>
          <textarea 
            value={profile?.bio || ''} 
            onChange={e => setProfile({...profile, bio: e.target.value})} 
            className="w-full p-5 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:bg-white focus:border-orange-500 font-bold h-40 sm:h-48 resize-none leading-relaxed transition-colors" 
            placeholder="شتێک دەربارەی خۆت بنووسە لێرەدا بۆ ئەوەی خەڵکی زیاتر بتبینن..."
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
         {/* 🌟 لێرەدا هەموو شتەکان پێکەوە دەنێردرێن بۆ داتابەیس 🌟 */}
         <button 
            onClick={() => handleUpdateProfile({ 
               displayName: profile.displayName, 
               bio: profile.bio, 
               nameColor: profile.nameColor, 
               bioColor: profile.bioColor,
               bgImage: profile.bgImage,
               avatarUrl: profile.avatarUrl
            })} 
            disabled={saving}
            className="w-full sm:w-auto px-12 py-4 bg-neutral-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
         >
            {saving ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><Save size={22} /> پاشەکەوتکردن</>
            )}
         </button>
      </div>
      
    </div>
  );
}