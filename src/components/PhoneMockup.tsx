import { ArrowUpRight, Star } from 'lucide-react';
import * as icons from 'lucide-react';

const VerifiedBadge = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92898C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92898 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92898L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92898 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#1d9bf0"/>
    <path d="M10.3333 14.3333L7.16667 11.1667L8.10833 10.225L10.3333 12.45L15.8917 6.89167L16.8333 7.83333L10.3333 14.3333Z" fill="white"/>
  </svg>
);

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
  const globalBtnTextColor = mockup?.btnTextColor;

  const nameClass = mockup?.nameColor ? '' : t.text;
  const bioClass = mockup?.bioColor ? '' : t.sub;

  const containerClass = isPublic 
    ? `w-[85%] max-w-[360px] mx-auto aspect-[9/19] rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2.5 relative shrink-0 border-[6px] sm:border-[8px] shadow-[0_0_80px_rgba(251,191,36,0.15)] ${t.shell}`
    : `w-[85%] max-w-[280px] sm:max-w-[320px] mx-auto aspect-[9/19] rounded-[2rem] sm:rounded-[2.5rem] p-2 relative shrink-0 transition-all duration-500 transform-gpu hover:scale-[1.02] border-[4px] sm:border-[6px] shadow-2xl ${t.shell}`;

  const innerRounded = isPublic ? "rounded-[2.2rem] sm:rounded-[2.6rem]" : "rounded-[1.6rem] sm:rounded-[2rem]";
  
  const safeMockupLinks = Array.isArray(mockupLinks) ? mockupLinks : [];
  const safeSponsoredLinks = Array.isArray(sponsoredLinks) ? sponsoredLinks : [];

  const displayLinks = isPublic ? safeMockupLinks : safeMockupLinks.slice(0, 5); // زیاتکردنی ژمارەی بەستەرەکان بۆ بینین
  const displaySponsored = isPublic ? safeSponsoredLinks : safeSponsoredLinks.slice(0, 1);

  const bgPosStyle = mockup?.bgPos ? `${mockup.bgPos.x}% ${mockup.bgPos.y}%` : '50% 50%';
  const avatarPosStyle = mockup?.avatarPos ? `${mockup.avatarPos.x}% ${mockup.avatarPos.y}%` : '50% 50%';

  return (
    <div className={containerClass} style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
      <div className={`w-full h-full ${innerRounded} relative overflow-hidden flex flex-col ${t.inner}`}>
        
        {/* Notch - کامێرای مۆبایل */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-full z-30 flex items-center justify-center gap-2 shadow-sm border border-white/5">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/10"></div>
        </div>

        <div className={`flex-1 flex flex-col items-center z-20 w-full overflow-hidden ${isPublic ? 'pb-32' : 'pb-6'}`}>
          
          <div className="w-full h-32 sm:h-40 relative bg-neutral-800 overflow-hidden shadow-inner shrink-0 rounded-t-[1.6rem] sm:rounded-t-[2rem]">
            {mockup?.bgImage ? (
               <img src={mockup.bgImage} className="w-full h-full object-cover" style={{ objectPosition: bgPosStyle }} alt="Cover" />
            ) : (
               <div className="w-full h-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-80"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          <div className="relative -mt-14 sm:-mt-16 shrink-0 z-30 px-3 sm:px-4 w-full flex flex-col items-center">
            
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
               <h3 className={`text-lg sm:text-xl tracking-wide text-center break-words font-black drop-shadow-lg ${nameClass}`} style={nameStyle}>
                 {mockup?.name || 'کۆسرەت مامە'}
               </h3>
            </div>
            
            <p className={`text-[11px] sm:text-[12px] mb-4 sm:mb-6 font-bold text-center opacity-90 drop-shadow-md px-2 ${bioClass}`} style={bioStyle}>
               {mockup?.bio || 'شارەزا لە تەکنەلۆژیا'}
            </p>

            {/* 🌟 بەشی دوگمەکان (بە ڕەنگی ڕەش بۆ سناپچات) 🌟 */}
            <div className="w-full space-y-2.5 sm:space-y-3 px-1 sm:px-2 flex-none">
              {displayLinks.map((link: any, idx: number) => {
                 const IconName = link.iconName || link.icon || 'Globe';
                 const Icon = (icons as any)[IconName] || icons.Globe;
                 const customColor = link.color || '#1877F2';
                 
                 // دڵنیابوونەوە لەوەی کە ڕەنگی نووسین (بە دیاریکراوی بۆ سناپچات) ڕەش دەبێت گەر دیاری کرابێت
                 const currentBtnTextColor = link.textColor || globalBtnTextColor || (designId === 'light' ? '#000000' : '#ffffff');

                 const btnContent = (
                    <div className={`relative w-full rounded-[14px] sm:rounded-[16px] p-[1.5px] overflow-hidden group transition-transform hover:scale-[1.03] active:scale-95 shadow-[0_5px_20px_rgba(0,0,0,0.2)]`}>
                      <div className="absolute inset-0 bg-white/10 z-0"></div>
                      <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] z-0" 
                           style={{ background: `conic-gradient(from 0deg, transparent 0 280deg, ${customColor} 360deg)` }}>
                      </div>
                      <div className="absolute inset-[1.5px] rounded-[12px] sm:rounded-[14px] bg-black/40 backdrop-blur-md"></div>

                      <div className={`relative z-10 w-full rounded-[12px] sm:rounded-[14px] flex items-center justify-between p-2 sm:p-2.5 ${t.btn}`} style={designId === 'light' ? { backgroundColor: '#ffffff' } : {}}>
                        <div className="flex items-center gap-2.5 sm:gap-3 w-full pr-1">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 shadow-inner overflow-hidden ${t.iconBg}`}>
                            {link.imageUrl || link.icon?.startsWith('/') ? (
                               <img src={link.imageUrl || link.icon} className="w-full h-full object-contain drop-shadow-sm" alt="Icon" />
                            ) : (
                               <Icon size={18} color={customColor} className="drop-shadow-sm" />
                            )}
                          </div>
                          <span className={`font-black text-[12px] sm:text-[14px] truncate drop-shadow-sm`} style={{ color: currentBtnTextColor }}>
                             {link.name || link.title}
                          </span>
                        </div>
                        <div className="pr-2 opacity-80 shrink-0" style={{ color: designId === 'gold' ? '#fbbf24' : customColor }}><ArrowUpRight size={18} strokeWidth={2.5} /></div>
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

          </div>
        </div>
      </div>
    </div>
  );
}