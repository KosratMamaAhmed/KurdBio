import { Palette, Droplet, Sparkles } from 'lucide-react';
import PhoneMockup from './PhoneMockup';

export const MOCKUP_DESIGNS = [
  { id: 'mockup', name: 'تاریکی شاهانە' },
  { id: 'light', name: 'سپی پلاتینی' },
  { id: 'gold', name: 'ئاڵتوونی و ڕەش' },
  { id: 'neon', name: 'شوشەیی نیۆن' },
  { id: 'emerald', name: 'زەمردی متمانە' },
  { id: 'vintage', name: 'قاوەیی کلاسیک' },
  { id: 'crimson', name: 'خوێناوی تاریک' },
  { id: 'navy', name: 'سرمەیی مۆدێرن' },
  { id: 'royal', name: 'مۆر و ڕۆزگۆڵد' },
  { id: 'minimal', name: 'مینیماڵی خاوێن' }
];

const PRESET_COLORS = [
  { id: 'gold', name: 'ئاڵتوونی', colors: { nameColor: '#fbbf24', bioColor: '#fcd34d', btnTextColor: '#ffffff' } },
  { id: 'ocean', name: 'زەریایی', colors: { nameColor: '#38bdf8', bioColor: '#bae6fd', btnTextColor: '#ffffff' } },
  { id: 'emerald', name: 'زەمردی', colors: { nameColor: '#10b981', bioColor: '#a7f3d0', btnTextColor: '#ffffff' } },
  { id: 'dark', name: 'کلاسیک سپی', colors: { nameColor: '#ffffff', bioColor: '#94a3b8', btnTextColor: '#ffffff' } },
  { id: 'royal', name: 'شاهانە', colors: { nameColor: '#d8b4fe', bioColor: '#e9d5ff', btnTextColor: '#ffffff' } },
  { id: 'sunset', name: 'خۆرئاوا', colors: { nameColor: '#fb923c', bioColor: '#fed7aa', btnTextColor: '#ffffff' } },
  { id: 'rose', name: 'گوڵەباخ', colors: { nameColor: '#f472b6', bioColor: '#fbcfe8', btnTextColor: '#ffffff' } },
  { id: 'bw', name: 'ڕەش و سپی', colors: { nameColor: '#0f172a', bioColor: '#475569', btnTextColor: '#000000' } }
];

export default function ThemeSettings({ profile, setProfile, handleUpdateProfile }: any) {
  return (
    <div className="bg-neutral-50 p-6 sm:p-8 rounded-[2.5rem] shadow-inner border border-neutral-200 flex flex-col xl:flex-row gap-10 items-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/40 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex-1 w-full relative z-10">
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 mb-6">
          <Palette className="text-orange-500" size={28} />
          <h2 className="text-2xl font-black text-neutral-900">ڕووکار و دیزاینی مۆکئەپ</h2>
        </div>

        <p className="text-neutral-500 font-bold text-sm mb-4">ئەو دیزاینە هەڵبژێرە کە دەتەوێت سەردانیکەران لە پەڕەکەتدا بیبینن.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 pb-2">
          {MOCKUP_DESIGNS.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setProfile({...profile, theme: m.id});
                handleUpdateProfile({ theme: m.id });
              }}
              className={`p-3 rounded-2xl border-2 text-center transition-all ${profile?.theme === m.id || (!profile?.theme && m.id === 'mockup') ? 'border-orange-500 bg-white shadow-md scale-105 z-10' : 'border-neutral-200 bg-white/50 hover:bg-white hover:border-orange-200'}`}
            >
              <h3 className={`font-black text-sm mb-1 ${profile?.theme === m.id || (!profile?.theme && m.id === 'mockup') ? 'text-orange-600' : 'text-neutral-700'}`}>{m.name}</h3>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-black text-neutral-800 mb-4 flex items-center gap-2">
            <Droplet size={18} className="text-orange-500" /> ڕێکخستنی ڕەنگی دەقەکان
          </h3>

          <div className="mb-5 bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm">
             <span className="text-xs font-bold text-neutral-500 mb-2 flex items-center gap-1"><Sparkles size={14} className="text-amber-500"/> تێکەڵەی ڕەنگە ناوازەکان (خێرا)</span>
             <div className="flex flex-wrap gap-2">
               {PRESET_COLORS.map(p => (
                 <button 
                   key={p.id}
                   onClick={() => {
                     setProfile({...profile, ...p.colors});
                     handleUpdateProfile(p.colors);
                   }}
                   className="px-3 py-1.5 rounded-lg text-[11px] font-black border transition-transform hover:scale-105 active:scale-95"
                   style={{ backgroundColor: p.colors.nameColor + '15', borderColor: p.colors.nameColor, color: p.colors.nameColor }}
                 >
                   {p.name}
                 </button>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-500">ڕەنگی ناو</span>
              <div className="flex items-center gap-2">
                <input type="color" value={profile?.nameColor || '#fbbf24'} 
                  onChange={e => setProfile({...profile, nameColor: e.target.value})} 
                  onBlur={e => handleUpdateProfile({ nameColor: e.target.value })} 
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" 
                />
                <span className="text-xs font-mono uppercase text-neutral-400">{profile?.nameColor || '#fbbf24'}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-500">ڕەنگی بایۆ</span>
              <div className="flex items-center gap-2">
                <input type="color" value={profile?.bioColor || '#fcd34d'} 
                  onChange={e => setProfile({...profile, bioColor: e.target.value})} 
                  onBlur={e => handleUpdateProfile({ bioColor: e.target.value })} 
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" 
                />
                <span className="text-xs font-mono uppercase text-neutral-400">{profile?.bioColor || '#fcd34d'}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-500">ڕەنگی ناو دوگمەکان</span>
              <div className="flex items-center gap-2">
                <input type="color" value={profile?.btnTextColor || '#ffffff'} 
                  onChange={e => setProfile({...profile, btnTextColor: e.target.value})} 
                  onBlur={e => handleUpdateProfile({ btnTextColor: e.target.value })} 
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" 
                />
                <span className="text-xs font-mono uppercase text-neutral-400">{profile?.btnTextColor || '#ffffff'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 w-full sm:w-auto flex justify-center xl:justify-end relative z-10 pointer-events-none scale-90 sm:scale-100 origin-center xl:origin-left mt-8 xl:mt-0">
         <PhoneMockup 
           mockup={{ 
             name: profile?.displayName || 'ناوی تۆ', 
             bio: profile?.bio || 'بایۆگرافی خۆت لێرە بنووسە', 
             avatar: profile?.avatarUrl, 
             buttonDesign: profile?.theme || 'mockup',
             nameColor: profile?.nameColor || '#fbbf24',
             bioColor: profile?.bioColor || '#fcd34d',
             btnTextColor: profile?.btnTextColor || '#ffffff',
             isPro: profile?.isPro
           }} 
           mockupLinks={profile?.links?.slice(0, 3) || []} 
         />
      </div>
    </div>
  )
}