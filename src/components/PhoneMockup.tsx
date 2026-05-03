import { ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import * as icons from 'lucide-react';

const VerifiedBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92898C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92898 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92898L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92898 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#1d9bf0"/>
    <path d="M10.3333 14.3333L7.16667 11.1667L8.10833 10.225L10.3333 12.45L15.8917 6.89167L16.8333 7.83333L10.3333 14.3333Z" fill="white"/>
  </svg>
);

// 🌟 باکگراوندە سادە و ناوازەکان (ئێستا وەک باکگراوندی پەڕە کاردەکەن نەک مۆبایل) 🌟
export const THEME_STYLES: Record<string, any> = {
  light: { bg: 'bg-[#f4f4f5]', text: 'text-neutral-900', sub: 'text-neutral-500', btnText: 'text-white' },
  dark: { bg: 'bg-[#111111]', text: 'text-white', sub: 'text-neutral-400', btnText: 'text-white' },
  soft_blue: { bg: 'bg-[#f0f9ff]', text: 'text-[#0369a1]', sub: 'text-[#38bdf8]', btnText: 'text-white' },
  midnight: { bg: 'bg-[#0f172a]', text: 'text-white', sub: 'text-slate-400', btnText: 'text-white' },
  desert: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', sub: 'text-[#d97706]', btnText: 'text-white' },
  forest: { bg: 'bg-[#064e3b]', text: 'text-[#ecfdf5]', sub: 'text-[#6ee7b7]', btnText: 'text-white' },
  rose: { bg: 'bg-[#fff1f2]', text: 'text-[#be185d]', sub: 'text-[#f472b6]', btnText: 'text-white' },
  lavender: { bg: 'bg-[#faf5ff]', text: 'text-[#6b21a8]', sub: 'text-[#c084fc]', btnText: 'text-white' },
  neon_cyber: { bg: 'bg-[#000000]', text: 'text-[#22d3ee]', sub: 'text-[#ec4899]', btnText: 'text-white' },
  glass: { bg: 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100', text: 'text-slate-800', sub: 'text-slate-500', btnText: 'text-white' }
};

export default function PhoneMockup({ mockup, mockupLinks, sponsoredLinks, isPublic = false, handleLinkClick }: any) {
  const designId = mockup?.buttonDesign || 'light';
  const t = THEME_STYLES[designId] || THEME_STYLES.light;

  const nameStyle = mockup?.nameColor ? { color: mockup.nameColor } : undefined;
  const bioStyle = mockup?.bioColor ? { color: mockup.bioColor } : undefined;
  
  // لێرەدا مۆکئەپ و هێڵەکانی مۆبایل لابران، ئێستا دەبێتە پەڕەیەکی ڕێکخراو
  const containerClass = isPublic 
    ? `w-full min-h-screen ${t.bg}`
    : `w-full max-w-[340px] mx-auto h-[650px] rounded-[2rem] relative shrink-0 transition-all duration-500 shadow-xl overflow-hidden border border-neutral-200 ${t.bg}`;

  const safeMockupLinks = Array.isArray(mockupLinks) ? mockupLinks : [];
  const safeSponsoredLinks = Array.isArray(sponsoredLinks) ? sponsoredLinks : [];

  const displayLinks = isPublic ? safeMockupLinks : safeMockupLinks.slice(0, 4);
  const displaySponsored = isPublic ? safeSponsoredLinks : safeSponsoredLinks.slice(0, 1);

  return (
    <div className={containerClass}>
      
      {/* 🌟 وێنەی کەڤەر (Background Image) 🌟 */}
      <div className="w-full h-36 sm:h-48 relative bg-neutral-200 overflow-hidden">
        {mockup?.bgImage ? (
           <img src={mockup.bgImage} className="w-full h-full object-cover" alt="Cover" />
        ) : (
           <div className="w-full h-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-80"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-12">
        
        {/* وێنەی پرۆفایل کە دێتە سەر کەڤەرەکە */}
        <div className="relative -mt-16 sm:-mt-20 flex justify-center mb-4 z-10">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-white/20 backdrop-blur-md shadow-xl">
            <div className={`w-full h-full rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center border-4 ${designId === 'dark' || designId === 'midnight' || designId === 'neon_cyber' || designId === 'forest' ? 'border-black' : 'border-white'}`}>
               {mockup?.avatar ? (
                 <img src={mockup.avatar} className="w-full h-full object-cover" alt="Profile" />
               ) : (
                 <span className="text-4xl font-black text-neutral-400">{(mockup?.name || 'کۆسرەت').charAt(0)}</span>
               )}
            </div>
            {mockup?.isPro && (
              <div className="absolute bottom-0 right-0 z-20">
                <VerifiedBadge className="w-7 h-7 drop-shadow-md bg-white rounded-full p-0.5" />
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-8 px-2">
           <h3 className={`text-2xl sm:text-3xl font-black mb-2 flex items-center justify-center gap-1.5 ${mockup?.nameColor ? '' : t.text}`} style={nameStyle}>
             {mockup?.name || 'کۆسرەت مامە'}
           </h3>
           <p className={`text-sm sm:text-base font-bold opacity-90 leading-relaxed ${mockup?.bioColor ? '' : t.sub}`} style={bioStyle}>
             {mockup?.bio || 'شارەزا لە تەکنەلۆژیا. بەستەرەکانم لە خوارەوە ببینە.'}
           </p>
        </div>

        <div className="w-full space-y-4">
          {displayLinks.map((link: any, idx: number) => {
             const IconName = link.iconName || link.icon || 'Globe';
             const Icon = (icons as any)[IconName] || icons.Globe;
             const customColor = link.color || '#333333';

             const btnContent = (
                // 🌟 دوگمەکان ڕەنگی تۆڕەکەیان وەرگرتووە 🌟
                <div 
                  className={`relative w-full rounded-2xl p-4 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 shadow-md`}
                  style={{ backgroundColor: customColor }}
                >
                  <div className="flex items-center gap-4 w-full pr-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-sm`}>
                      {link.imageUrl || link.icon?.startsWith('/') ? (
                         <img src={link.imageUrl || link.icon} className="w-7 h-7 object-contain drop-shadow-sm" alt="Icon" />
                      ) : (
                         <Icon size={24} color="#ffffff" className="drop-shadow-sm" />
                      )}
                    </div>
                    <span className={`font-black text-[15px] sm:text-[16px] truncate text-white drop-shadow-sm`} style={mockup?.btnTextColor ? { color: mockup.btnTextColor } : {}}>
                       {link.name || link.title}
                    </span>
                  </div>
                  <div className="pr-2 shrink-0 text-white/70"><ArrowUpRight size={24} strokeWidth={2.5} /></div>
                </div>
             );

             return isPublic ? (
                <button key={idx} onClick={() => handleLinkClick(link.url, link.id)} className="w-full text-right block">{btnContent}</button>
             ) : (
                <div key={idx} className="w-full">{btnContent}</div>
             );
          })}
        </div>

        {displaySponsored.length > 0 && (
          <div className="w-full mt-10 space-y-4">
            <div className="flex items-center justify-center gap-3 w-full opacity-60 mb-6">
              <div className={`h-[1px] flex-1 ${t.text} opacity-20`}></div>
              <span className={`text-[10px] font-black tracking-widest uppercase ${t.text}`}>سپۆنسەر کراو</span>
              <div className={`h-[1px] flex-1 ${t.text} opacity-20`}></div>
            </div>

            {displaySponsored.map((item: any, idx: number) => {
               const IconName = item.iconName || item.icon || 'Star';
               const Icon = (icons as any)[IconName] || icons.Star;

               const spBtnContent = (
                  <div className="relative w-full group transition-transform hover:scale-[1.02] active:scale-95 shadow-lg">
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md z-30">VIP</div>
                    
                    <div className="relative z-10 w-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 w-full pr-1">
                        <div className="w-14 h-14 rounded-xl bg-white/30 backdrop-blur-sm p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                          {item.imageUrl || item.icon?.startsWith('/') ? <img src={item.imageUrl || item.icon} className="w-full h-full object-cover rounded-lg" /> : <Icon size={28} className="text-black" strokeWidth={2.5} />}
                        </div>
                        <div className="flex-1 text-right min-w-0 pr-1">
                          <h4 className="font-black text-[16px] text-black line-clamp-1">{item.name || item.title}</h4>
                          <p className="text-[12px] font-bold text-black/70 truncate mt-0.5">{(item.url && item.url.includes('.apk')) ? 'داگرتنی بەرنامە' : 'سپۆنسەری تایبەت'}</p>
                        </div>
                        <ArrowUpRight size={26} className="text-black/50 ml-1 shrink-0" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
               );

               return isPublic ? (
                  <button key={`sp-${idx}`} onClick={() => handleLinkClick(item.url, item.id)} className="w-full text-right block">{spBtnContent}</button>
               ) : (
                  <div key={`sp-${idx}`} className="w-full">{spBtnContent}</div>
               );
            })}
          </div>
        )}

        {isPublic && (
          <div className="mt-16 pb-8 flex justify-center opacity-80">
            <a href="https://biokurd.com" className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${t.bg} ${t.text} border border-neutral-300 shadow-sm hover:shadow-md`}>
              <icons.Link size={16} /> لینکێکی ئاوا بۆخۆت دروست بکە
            </a>
          </div>
        )}
      </div>
    </div>
  );
}