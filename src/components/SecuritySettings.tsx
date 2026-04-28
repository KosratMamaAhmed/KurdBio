import { Lock } from 'lucide-react';

export default function SecuritySettings({ profile, setProfile, userToken }: any) {
  const handleRequestPassword = async () => {
    const input = document.getElementById('newPassInput') as HTMLInputElement;
    if(!input.value || input.value.length < 6) { alert('پاسوۆرد نابێت لە ٦ پیت کەمتر بێت'); return; }
    await fetch('/api/request-password-change', { 
      method: 'POST', 
      headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ newPassword: input.value }) 
    });
    input.value = ''; 
    setProfile({...profile, pendingPassword: true});
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-50"><Lock className="text-red-500" size={28} /><h2 className="text-xl font-black">گۆڕینی تێپەڕەوشە (پاسوۆرد)</h2></div>
      <div className="space-y-4">
        {profile?.pendingPassword ? (
          <div className="p-6 bg-amber-50 text-amber-700 rounded-2xl border-2 border-amber-200 font-black flex items-center justify-center gap-3 text-sm"><Lock size={18}/> داواکارییەکەت نێردراوە. چاوەڕێبە تا ئەدمین پەسەندی دەکات.</div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="password" placeholder="پاسوۆردی نوێ بنووسە لێرە..." id="newPassInput" className="flex-1 p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-red-400 outline-none transition font-bold text-sm text-left" dir="ltr" />
            <button onClick={handleRequestPassword} className="px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition active:scale-95 border border-red-100 shadow-sm text-sm">ناردنی داواکاری</button>
          </div>
        )}
      </div>
    </div>
  );
}