import { useNavigate } from 'react-router-dom';
import { Camera, Lock, Save, Star, User } from 'lucide-react';

export default function ProfileSettings({ profile, setProfile, theme, isPro, saving, handleUpdateProfile, handleImageUpload, isUploadingAvatar, avatarInputRef }: any) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-50">
        <div className="flex items-center gap-3"><User className={theme?.text || 'text-orange-500'} size={28} /><h2 className="text-xl font-black">زانیارییە کەسییەکان</h2></div>
        {!isPro && <button onClick={() => navigate('/payment')} className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition"><Star size={16} className="fill-black"/> نوێکردنەوە بۆ VIP</button>}
      </div>
      <div className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row gap-8">
          <div className="relative w-32 h-32 rounded-[2rem] bg-neutral-50 border-4 border-white shadow-xl flex-shrink-0 cursor-pointer overflow-hidden group transition-transform hover:scale-105" onClick={() => isPro ? avatarInputRef.current?.click() : navigate('/payment')}>
            {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl text-neutral-300 font-black">{profile?.displayName?.charAt(0) || <User size={48} />}</div>}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold text-center backdrop-blur-sm">
              {isPro ? <Camera size={32} /> : <><Lock size={24} className="mb-2 text-amber-400"/> پێویستی بە پرۆیە</>}
            </div>
            {isUploadingAvatar && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme?.border || 'border-orange-200'}`}></div></div>}
          </div>
          <input type="file" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} accept="image/*" className="hidden" />
          <div className="flex-1 w-full space-y-2"><label className="text-sm font-bold text-neutral-500 pl-2">ناوی تەواو</label><input type="text" value={profile?.displayName || ''} onChange={e => setProfile({...profile, displayName: e.target.value})} className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-neutral-400 outline-none transition font-bold text-sm" /></div>
        </div>
        <div className="space-y-2"><label className="text-sm font-bold text-neutral-500 pl-2">دەربارەی من (Bio)</label><textarea value={profile?.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl h-32 resize-none focus:border-neutral-400 outline-none transition font-medium leading-relaxed text-sm" /></div>
        <div className="space-y-2"><label className="text-sm font-bold text-neutral-500 pl-2">بەستەری پرۆفایل</label><div className="flex items-center" dir="ltr"><span className="bg-neutral-100 border border-r-0 border-neutral-200 p-3.5 rounded-l-2xl text-neutral-500 font-bold text-sm">biokurd.com/</span><input type="text" value={profile?.slug || ''} onChange={e => setProfile({...profile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')})} className="flex-1 p-3.5 bg-neutral-50 border border-neutral-200 rounded-r-2xl focus:border-neutral-400 outline-none transition font-bold text-sm" /></div></div>
        <button onClick={() => handleUpdateProfile()} disabled={saving} className={`w-full py-4 ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'} text-white rounded-2xl font-black flex items-center justify-center gap-3 transition active:scale-95 shadow-xl disabled:opacity-70 mt-4 text-sm`}>{saving ? 'پاشەکەوت دەکرێت...' : 'پاشەکەوتکردنی زانیارییەکان'}{!saving && <Save size={20} />}</button>
      </div>
    </div>
  );
}