import { ArrowUpRight } from 'lucide-react';
import * as icons from 'lucide-react';

const VerifiedBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92898C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92898 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92898L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92898 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#1d9bf0"/>
    <path d="M10.3333 14.3333L7.16667 11.1667L8.10833 10.225L10.3333 12.45L15.8917 6.89167L16.8333 7.83333L10.3333 14.3333Z" fill="white"/>
  </svg>
);

// 🌟 تەنها ٥ دیزاینە پریمیمە خەیاڵییەکە 🌟
export const THEME_STYLES: Record<string, any> = {
  gold: { 
    shell: 'border-amber-500/50 bg-[#050505]', 
    inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a2700] via-[#050505] to-black', 
    text: 'text-amber-400', sub: 'text-amber-400/60', btn: 'bg-black/50 backdrop-blur-md border border-amber-500/30', iconBg: 'bg-amber-500/10' 
  },
  aurora: { 
    shell: 'border-teal-400/40 bg-[#040f12]', 
    inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d3b36] via-[#040f12] to-black', 
    text: 'text-teal-300', sub: 'text-teal-500/70', btn: 'bg-teal-950/30 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]', iconBg: 'bg-teal-500/20' 
  },
  cyberpunk: { 
    shell: 'border-pink-500/50 bg-[#0a000a]', 
    inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4a004a] via-[#111111] to-black', 
    text: 'text-pink-400', sub: 'text-cyan-400/80', btn: 'bg-black/40 backdrop-blur-md border border-pink-500/40 shadow-[4px_4px_0px_0px_rgba(236,72,153,0.3)]', iconBg: 'bg-cyan-500/20' 
  },
  glass: { 
    shell: 'border-white/20 bg-slate-900', 
    inner: 'bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-[#170529] to-black', 
    text: 'text-white', sub: 'text-white/70', btn: 'bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.2)]', iconBg: 'bg-white/10' 
  },
  light: { 
    shell: 'border-neutral-300 bg-white', 
    inner: 'bg-gradient-to-br from-slate-100 via-white to-neutral-100', 
    text: 'text-neutral-900', sub: 'text-neutral-500', btn: 'bg-white shadow-sm border border-neutral-200', iconBg: 'bg-slate-100' 
  }
};

export default function PhoneMockup({ mockup, mockupLinks, sponsoredLinks, isPublic = false, handleLinkClick }: any) {
  const designId = mockup?.buttonDesign || 'gold';
  const t = THEME_STYLES[designId] || THEME_STYLES.gold;

  const nameStyle = mockup?.nameColor ? { color: mockup.nameColor } : undefined;
  const bioStyle = mockup?.bioColor ? { color: mockup.bioColor } : undefined;
  const btnTextStyle = mockup?.btnTextColor ? { color: mockup.btnTextColor } : undefined;

  const nameClass = mockup?.nameColor ? '' : t.text;
  const bioClass = mockup?.bioColor ? '' : t.sub;
  const btnTextClass = mockup?.btnTextColor ? '' : t.text;

  const containerClass = isPublic 
    ? `w-[85%] max-w-[360px] mx-auto aspect-[9/19] rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2.5 relative shrink-0 border-[6px] sm:border-[8px] shadow-[0_0_80px_rgba(251,191,36,0.15)] ${t.shell}`
    : `w-[85%] max-w-[280px] sm:max-w-[320px] mx-auto aspect-[9/19] rounded-[2rem] sm:rounded-[2.5rem] p-2 relative shrink-0 transition-all duration-500 transform-gpu hover:scale-[1.02] border-[4px] sm:border-[6px] shadow-2xl ${t.shell}`;

  const innerRounded = isPublic ? "rounded-[2.2rem] sm:rounded-[2.6rem]" : "rounded-[1.6rem] sm:rounded-[2rem]";
  
  const safeMockupLinks = Array.isArray(mockupLinks) ? mockupLinks : [];
  const safeSponsoredLinks = Array.isArray(sponsoredLinks) ? sponsoredLinks : [];

  const displayLinks = isPublic ? safeMockupLinks : safeMockupLinks.slice(0, 3);
  const displaySponsored = isPublic ? safeSponsoredLinks : safeSponsoredLinks.slice(0, 1);

  const bgPosStyle = mockup?.bgPos ? `${mockup.bgPos.x}% ${mockup.bgPos.y}%` : '50% 50%';
  const avatarPosStyle = mockup?.avatarPos ? `${mockup.avatarPos.x}% ${mockup.avatarPos.y}%` : '50% 50%';

  return (
    <div className={containerClass}>
      <div className={`w-full h-full ${innerRounded} relative overflow-hidden flex flex-col ${t.inner}`}>
        
        {/* Notch - کامێرای مۆبایل */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-full z-30 flex items-center justify-center gap-2 shadow-sm border border-white/5">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/10"></div>
        </div>

        <div className={`flex-1 flex flex-col items-center z-20 w-full overflow-y-auto scrollbar-hide ${isPublic ? 'pb-32' : 'pb-6'}`}>
          
          {/* 🌟 وێنەی کەڤەر (Background Image) 🌟 */}
          <div className="w-full h-32 sm:h-40 relative bg-neutral-800 overflow-hidden shadow-inner shrink-0 rounded-t-[1.6rem] sm:rounded-t-[2rem]">
            {mockup?.bgImage ? (
               <img src={mockup.bgImage} className="w-full h-full object-cover" style={{ objectPosition: bgPosStyle }} alt="Cover" />
            ) : (
               <div className="w-full h-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-80"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          <div className="relative -mt-14 sm:-mt-16 shrink-0 z-30 px-3 sm:px-4 w-full flex flex-col items-center">
            
            {/* وێنەی پرۆفایل کە دەچێتە سەر کەڤەرەکە */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-white/10 backdrop-blur-xl shadow-2xl mb-3 sm:mb-4">
              <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center border-2 border-white/20 bg-neutral-900`}>
                 {mockup?.avatar ? (
                   <img src={mockup.avatar} className="w-full h-full object-cover" style={{ objectPosition: avatarPosStyle }} alt="Profile" />
                 ) : (
                   <span className="text-4xl font-black text-white">{(mockup?.name || 'کۆسرەت').charAt(0)}</span>
                 )}
              </div>
              {mockup?.isPro && (
                <div className="absolute bottom-0 right-1 z-30">
                  <VerifiedBadge className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md bg-black/50 backdrop-blur-md rounded-full p-[1px]" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 w-full mb-1">
               <h3 className={`text-xl sm:text-2xl tracking-wide text-center break-words font-black drop-shadow-lg ${nameClass}`} style={nameStyle}>
                 {mockup?.name || 'کۆسرەت مامە'}
               </h3>
            </div>
            
            <p className={`text-[12px] sm:text-[13px] mb-6 sm:mb-8 font-bold text-center opacity-90 drop-shadow-md px-2 ${bioClass}`} style={bioStyle}>
               {mockup?.bio || 'شارەزا لە تەکنەلۆژیا'}
            </p>

            <div className="w-full space-y-3 sm:space-y-4 px-1 sm:px-2 flex-none">
              {displayLinks.map((link: any, idx: number) => {
                 const IconName = link.iconName || link.icon || 'Globe';
                 const Icon = (icons as any)[IconName] || icons.Globe;
                 const customColor = link.color || '#1877F2';

                 const btnContent = (
                    <div className={`relative w-full rounded-[16px] sm:rounded-[18px] p-[2px] overflow-hidden group transition-transform hover:scale-[1.03] active:scale-95 shadow-[0_5px_20px_rgba(0,0,0,0.2)]`}>
                      <div className="absolute inset-0 bg-white/10 z-0"></div>
                      <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] z-0" 
                           style={{ background: `conic-gradient(from 0deg, transparent 0 280deg, ${customColor} 360deg)` }}>
                      </div>
                      <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] z-0 blur-[6px]" 
                           style={{ background: `conic-gradient(from 0deg, transparent 0 280deg, ${customColor} 360deg)` }}>
                      </div>
                      <div className="absolute inset-[2px] rounded-[14px] sm:rounded-[16px] bg-black/40 backdrop-blur-md"></div>

                      <div className={`relative z-10 w-full rounded-[14px] sm:rounded-[16px] flex items-center justify-between p-2.5 sm:p-3 ${t.btn}`} style={designId === 'light' ? { backgroundColor: '#ffffff' } : {}}>
                        <div className="flex items-center gap-2.5 sm:gap-3 w-full pr-1">
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden ${t.iconBg}`}>
                            {link.imageUrl || link.icon?.startsWith('/') ? (
                               <img src={link.imageUrl || link.icon} className="w-full h-full object-contain drop-shadow-sm" alt="Icon" />
                            ) : (
                               <Icon size={22} color={customColor} className="drop-shadow-sm" />
                            )}
                          </div>
                          <span className={`font-black text-[13px] sm:text-[15px] truncate drop-shadow-sm ${btnTextClass}`} style={btnTextStyle}>
                             {link.name || link.title}
                          </span>
                        </div>
                        <div className="pr-2 opacity-80 shrink-0" style={{ color: designId === 'gold' ? '#fbbf24' : customColor }}><ArrowUpRight size={20} strokeWidth={2.5} /></div>
                      </div>
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
              <div className="w-full mt-8 space-y-4 sm:space-y-5 px-1 sm:px-2 flex-none relative z-10">
                <div className="flex items-center justify-center gap-2 w-full opacity-90">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50"></div>
                  <span className="text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-lg border bg-black/80 border-amber-500/30 text-amber-400 tracking-widest uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    سپۆنسەر کراو
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50"></div>
                </div>

                {displaySponsored.map((item: any, idx: number) => {
                   const IconName = item.iconName || item.icon || 'Star';
                   const Icon = (icons as any)[IconName] || icons.Star;

                   const spBtnContent = (
                      <div className="relative w-full group transition-transform hover:scale-[1.03] active:scale-95 shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)]">
                        <div className="absolute -top-1.5 -left-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] border border-yellow-300 z-30 rotate-[-12deg]">VIP</div>
                        
                        <div className="relative w-full rounded-[18px] sm:rounded-[20px] p-[2px] overflow-hidden">
                          <div className="absolute inset-0 bg-white/10 z-0"></div>
                          <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite] z-0"
                               style={{ background: `conic-gradient(from 0deg, transparent 0 250deg, #ef4444 300deg, #f97316 330deg, #fbbf24 360deg)` }}>
                          </div>
                          <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite] z-0 blur-[8px]"
                               style={{ background: `conic-gradient(from 0deg, transparent 0 250deg, #ef4444 300deg, #f97316 330deg, #fbbf24 360deg)` }}>
                          </div>
                          <div className="absolute inset-[2px] rounded-[16px] sm:rounded-[18px] bg-black"></div>

                          <div className="relative z-10 w-full bg-gradient-to-br from-neutral-950 to-[#0a0a0a] rounded-[16px] sm:rounded-[18px] p-3 sm:p-4 flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-2.5 sm:gap-3 w-full pr-1 mt-1">
                              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white/5 p-1.5 flex items-center justify-center shrink-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                                {item.imageUrl || item.icon?.startsWith('/') ? <img src={item.imageUrl || item.icon} className="w-full h-full object-cover rounded-lg relative z-10" /> : <Icon size={26} className="text-amber-400 relative z-10" strokeWidth={2.5} />}
                              </div>
                              <div className="flex-1 text-right min-w-0 pr-1 relative z-10">
                                <h4 className="font-black text-[14px] sm:text-[16px] drop-shadow-md text-white line-clamp-1">{item.name || item.title}</h4>
                                <p className="text-[10px] sm:text-[11px] font-bold text-amber-400/90 truncate drop-shadow-sm mt-1">{(item.url && item.url.includes('.apk')) ? 'داگرتنی بەرنامە' : 'سپۆنسەری تایبەت'}</p>
                              </div>
                              <ArrowUpRight size={20} className="opacity-90 ml-1 shrink-0 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] relative z-10" strokeWidth={3} />
                            </div>
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

            {!isPublic && (
               <div className="mt-auto pt-6 pb-2 w-full flex justify-center shrink-0 relative z-20">
                  <span className="text-amber-400 font-black text-[11px] sm:text-[12px] drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] text-center tracking-wide w-full px-2">بە ئاسانی دیزاینێکی ئاوا بۆخۆت دروست بکە</span>
               </div>
            )}
          </div>
        </div>

        {isPublic && (
          <div className="absolute bottom-0 left-0 w-full pt-20 pb-6 px-4 bg-gradient-to-t from-black via-black/90 to-transparent z-40 flex justify-center pointer-events-none">
            <a href="https://biokurd.com" className="relative p-[2px] sm:p-[2.5px] rounded-full overflow-hidden group hover:scale-105 active:scale-95 transition-all duration-300 w-full max-w-[320px] shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] pointer-events-auto">
              <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_160deg,#fbbf24_220deg,#f59e0b_280deg,#fffbeb_360deg)] animate-[spin_2s_linear_infinite] z-0"></div>
              <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 backdrop-blur-xl rounded-full w-full h-full border border-white/10 overflow-hidden shadow-[inset_0_0_20px_rgba(251,191,36,0.05)]">
                <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent opacity-50 group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out"></div>
                <icons.Sparkles size={18} className="text-amber-400 relative z-10 animate-pulse" />
                <span className="text-amber-400 font-bold text-[15px] sm:text-[17px] whitespace-nowrap drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)] relative z-10 tracking-wide mt-0.5" style={{ fontFamily: '"Amiri", serif' }}>لینکێکی ئاوا بۆخۆت دروست بکە</span>
              </div>
            </a>
          </div>
        )}
      </div>

      <div className="absolute top-24 -left-1.5 w-1.5 h-10 bg-neutral-800 rounded-l-md"></div>
      <div className="absolute top-40 -left-1.5 w-1.5 h-14 bg-neutral-800 rounded-l-md"></div>
      <div className="absolute top-56 -left-1.5 w-1.5 h-14 bg-neutral-800 rounded-l-md"></div>
      <div className="absolute top-40 -right-1.5 w-1.5 h-20 bg-neutral-800 rounded-r-md"></div>
    </div>
  );
}