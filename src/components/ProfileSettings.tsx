import { Camera, User, FileText, Save, Image as ImageIcon } from 'lucide-react';

export default function ProfileSettings({ profile, setProfile, saving, handleUpdateProfile, handleImageUpload, isUploadingAvatar, avatarInputRef }: any) {
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-200 shadow-sm">
      <h2 className="text-xl font-black text-neutral-900 mb-6 flex items-center gap-2">
        <User className="text-orange-500"/> ڕێکخستنی پرۆفایل
      </h2>

      {/* بەشی وێنە و باکگراوند */}
      <div className="mb-8">
        <label className="text-sm font-bold text-neutral-600 block mb-4">وێنەی پرۆفایل و باکگراوند</label>
        <div className="relative w-full h-40 sm:h-48 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 shadow-inner group">
          {profile?.bgImage ? (
            <img src={profile.bgImage} className="w-full h-full object-cover" alt="Background" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
              <ImageIcon size={32} className="mb-2 opacity-50" />
              <span className="text-xs font-bold">باکگراوند بەتاڵە</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold text-sm cursor-pointer hover:bg-white/30 transition">
              <input type="file" accept="image/*" className="hidden" onChange={(e:any) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader(); reader.readAsDataURL(file);
                    reader.onload = (ev) => handleUpdateProfile({ bgImage: ev.target?.result as string });
                 }
              }} />
              گۆڕینی باکگراوند
            </label>
          </div>

          <div className="absolute -bottom-8 left-6 w-24 h-24 rounded-full border-4 border-white bg-neutral-50 shadow-lg overflow-hidden flex items-center justify-center group/avatar">
            {isUploadingAvatar ? (
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            ) : profile?.avatarUrl ? (
              <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <User size={32} className="text-neutral-400" />
            )}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
              <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} />
              <Camera size={24} />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-6 mt-6 border-t border-neutral-100">
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
        
        {/* 🌟 بەشی کورتەیەک دەربارەی خۆت (گەورەکراو) 🌟 */}
        <div>
          <label className="text-sm font-bold text-neutral-600 mb-2 flex items-center gap-2"><FileText size={16}/> کورتەیەک دەربارەی خۆت</label>
          <textarea 
            value={profile?.bio || ''} 
            onChange={e => setProfile({...profile, bio: e.target.value})} 
            className="w-full p-5 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:bg-white focus:border-orange-500 font-bold h-40 sm:h-56 resize-none leading-relaxed transition-colors" 
            placeholder="شتێک دەربارەی خۆت بنووسە لێرەدا بۆ ئەوەی خەڵکی زیاتر بتبینن..."
          />
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-600 block mb-2">ناوی لینک (یوزەرنەیم)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm" dir="ltr">biokurd.com/</span>
            <input 
              type="text" 
              value={profile?.slug || ''} 
              onChange={e => setProfile({...profile, slug: e.target.value.toLowerCase()})} 
              className="w-full p-4 pl-[110px] bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:bg-white focus:border-orange-500 font-bold text-left transition-colors" 
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* 🌟 دوگمەی پاشەکەوتکردن کە زۆر گەورە و دیارە 🌟 */}
      <div className="mt-10 flex justify-end">
         <button 
            onClick={() => handleUpdateProfile({ displayName: profile.displayName, bio: profile.bio, slug: profile.slug })} 
            disabled={saving}
            className="w-full sm:w-auto px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
         >
            {saving ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><Save size={22} /> پاشەکەوتکردنی گۆڕانکارییەکان</>
            )}
         </button>
      </div>
      
    </div>
  );
}