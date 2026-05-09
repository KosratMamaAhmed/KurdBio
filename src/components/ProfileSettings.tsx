import { Camera, User, FileText, Save, Image as ImageIcon, Lock, Palette } from 'lucide-react';

export default function ProfileSettings({ profile, setProfile, saving, handleUpdateProfile, handleImageUpload, isUploadingAvatar, avatarInputRef }: any) {
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-200 shadow-sm">
      <h2 className="text-xl font-black text-neutral-900 mb-8 flex items-center gap-2 border-b border-neutral-100 pb-4">
        <User className="text-orange-500" size={24} /> ڕێکخستنی پرۆفایل
      </h2>

      {/* 🌟 باکگراوندی گەورە و سەربەخۆ 🌟 */}
      <div className="mb-8">
        <label className="text-sm font-black text-neutral-700 mb-3 flex items-center gap-2">
           <ImageIcon size={18} className="text-orange-400" /> وێنەی باکگراوند (Cover)
        </label>
        <div className="relative w-full h-56 sm:h-72 rounded-3xl bg-neutral-900 overflow-hidden border border-neutral-200 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] group transition-all">
          {profile?.bgImage ? (
            <img src={profile.bgImage} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Background" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 bg-neutral-100">
              <ImageIcon size={40} className="mb-2 opacity-50" />
              <span className="text-sm font-bold">باکگراوند بەتاڵە</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-black text-sm cursor-pointer hover:bg-white/30 transition shadow-xl flex items-center gap-2 border border-white/20">
              <input type="file" accept="image/*" className="hidden" onChange={(e:any) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader(); reader.readAsDataURL(file);
                    reader.onload = (ev) => handleUpdateProfile({ bgImage: ev.target?.result as string });
                 }
              }} />
              <Camera size={18} /> گۆڕینی باکگراوند
            </label>
          </div>
        </div>
      </div>

      {/* 🌟 وێنەی پرۆفایلی جیاکراوە لەگەڵ درۆپ شادۆ 🌟 */}
      <div className="mb-10 pb-8 border-b border-neutral-100">
        <label className="text-sm font-black text-neutral-700 mb-3 flex items-center gap-2">
           <User size={18} className="text-orange-400" /> وێنەی پرۆفایل (Avatar)
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
           <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-neutral-50 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center group/avatar shrink-0">
             {isUploadingAvatar ? (
               <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
           <div className="text-xs font-bold text-neutral-400 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex-1">
             <span className="text-orange-500 block mb-1 font-black">زانیاری گرنگ:</span>
             بۆ گۆڕینی وێنەی پرۆفایلەکەت کرتە لە وێنەکە بکە. تکایە با قەبارەی وێنەکەت لە 2MB کەمتر بێت بۆ خێراتر لۆدبوونی پەڕەکەت.
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
          <p className="text-[10px] font-bold text-red-400 mt-1.5">بۆ پاراستنی لینکەکانت ناتوانیت ناوەکە بگۆڕیت.</p>
        </div>

        {/* 🌟 گۆڕینی ڕەنگی ناو و بایۆ 🌟 */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
           <div>
              <label className="text-xs font-black text-neutral-600 mb-2 flex items-center gap-1"><Palette size={14}/> ڕەنگی ناو</label>
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-neutral-200">
                <input type="color" value={profile?.nameColor || '#1f2937'} onChange={e => setProfile({...profile, nameColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono font-bold text-neutral-500" dir="ltr">{profile?.nameColor || '#1f2937'}</span>
              </div>
           </div>
           <div>
              <label className="text-xs font-black text-neutral-600 mb-2 flex items-center gap-1"><Palette size={14}/> ڕەنگی بایۆ</label>
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-neutral-200">
                <input type="color" value={profile?.bioColor || '#4b5563'} onChange={e => setProfile({...profile, bioColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono font-bold text-neutral-500" dir="ltr">{profile?.bioColor || '#4b5563'}</span>
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
         <button 
            onClick={() => handleUpdateProfile({ displayName: profile.displayName, bio: profile.bio, nameColor: profile.nameColor, bioColor: profile.bioColor })} 
            disabled={saving}
            className="w-full sm:w-auto px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
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