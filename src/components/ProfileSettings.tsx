import { useState } from 'react';
import { Camera, Save, User, FileText, Image as ImageIcon } from 'lucide-react';

export default function ProfileSettings({ profile, setProfile, theme, saving, handleUpdateProfile, handleImageUpload, isUploadingAvatar, avatarInputRef }: any) {
  
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // کەڤەر پێویستە پانییەکەی زیاتر بێت
        const MAX_WIDTH = 800; const MAX_HEIGHT = 400;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        handleUpdateProfile({ bgImage: base64String });
        setProfile({ ...profile, bgImage: base64String });
      };
    };
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-neutral-200">
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 mb-6">
        <User className="text-orange-500" size={24} />
        <h2 className="text-xl font-black text-neutral-900">زانیارییە کەسییەکان</h2>
      </div>

      <div className="space-y-6">
        {/* بەشی وێنەی کەڤەر و پرۆفایل */}
        <div className="relative mb-12">
           {/* کەڤەر */}
           <div className="w-full h-32 sm:h-40 bg-neutral-100 rounded-2xl overflow-hidden relative group">
             {profile?.bgImage ? <img src={profile.bgImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-neutral-400"><ImageIcon size={32}/></div>}
             <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer font-bold text-sm">
                <Camera size={20} className="ml-2"/> گۆڕینی کەڤەر
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
             </label>
           </div>
           
           {/* پرۆفایل */}
           <div className="absolute -bottom-8 right-6 flex items-end gap-4">
              <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-neutral-100 shadow-md overflow-hidden shrink-0">
                {isUploadingAvatar ? <div className="w-full h-full flex items-center justify-center bg-neutral-200"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div> : profile?.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-neutral-400"><Camera size={32}/></div>}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} />
                  <Camera size={24} />
                </label>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div>
            <label className="text-sm font-bold text-neutral-600 block mb-2">ناوی تەواو</label>
            <input type="text" value={profile?.displayName || ''} onChange={e => setProfile({...profile, displayName: e.target.value})} onBlur={() => handleUpdateProfile({ displayName: profile.displayName })} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-orange-500 font-bold" />
          </div>
          <div>
            <label className="text-sm font-bold text-neutral-600 block mb-2 flex items-center gap-2"><FileText size={16}/> کورتەیەک دەربارەی خۆت</label>
            <textarea value={profile?.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} onBlur={() => handleUpdateProfile({ bio: profile.bio })} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-orange-500 font-bold h-14 resize-none overflow-hidden" placeholder="کورتەیەک بنووسە..." />
          </div>
        </div>
      </div>
    </div>
  );
}