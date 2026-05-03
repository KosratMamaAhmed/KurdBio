import { ArrowUpRight } from 'lucide-react';
import * as icons from 'lucide-react';

const VerifiedBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92898C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92898 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92898L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92898 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#1d9bf0"/>
    <path d="M10.3333 14.3333L7.16667 11.1667L8.10833 10.225L10.3333 12.45L15.8917 6.89167L16.8333 7.83333L10.3333 14.3333Z" fill="white"/>
  </svg>
);

// 🌟 لێرەدا هەموو باکگراوندەکانی ناوەوە کران بە تێکەڵەی ڕەنگەکان (Gradients) کە زۆر ناوازەن 🌟
export const THEME_STYLES: Record<string, any> = {
  mockup: { shell: 'border-slate-800 bg-black', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#020617] to-black', text: 'text-white', sub: 'text-slate-400', btn: 'bg-white/5 backdrop-blur-md border border-white/10', iconBg: 'bg-white/10' },
  light: { shell: 'border-neutral-300 bg-white', inner: 'bg-gradient-to-br from-slate-100 via-white to-neutral-100', text: 'text-neutral-900', sub: 'text-neutral-500', btn: 'bg-white shadow-sm border border-neutral-200', iconBg: 'bg-slate-100' },
  gold: { shell: 'border-amber-500/50 bg-[#0a0a0a]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a1e00] via-[#050505] to-black', text: 'text-amber-400', sub: 'text-amber-400/60', btn: 'bg-black/50 backdrop-blur-md border border-amber-500/30', iconBg: 'bg-amber-500/10' },
  neon: { shell: 'border-cyan-500/40 bg-black', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#002a42] via-black to-[#0a001a]', text: 'text-cyan-300', sub: 'text-cyan-500/70', btn: 'bg-cyan-950/30 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]', iconBg: 'bg-cyan-500/20' },
  emerald: { shell: 'border-emerald-700 bg-[#022c22]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#064e3b] via-[#022c22] to-black', text: 'text-emerald-300', sub: 'text-emerald-500/70', btn: 'bg-emerald-950/50 border border-emerald-700/50', iconBg: 'bg-emerald-500/20' },
  vintage: { shell: 'border-orange-800 bg-[#2e1065]', inner: 'bg-gradient-to-br from-[#451a03] via-[#2e1065] to-[#170529]', text: 'text-amber-200', sub: 'text-amber-500/70', btn: 'bg-black/40 border border-orange-800/50', iconBg: 'bg-orange-500/20' },
  crimson: { shell: 'border-red-900 bg-[#171717]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#450a0a] via-[#171717] to-black', text: 'text-red-300', sub: 'text-red-500/70', btn: 'bg-red-950/30 border border-red-900/50', iconBg: 'bg-red-800/30' },
  navy: { shell: 'border-blue-800 bg-[#0f172a]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e3a8a] via-[#0f172a] to-black', text: 'text-blue-200', sub: 'text-blue-400/70', btn: 'bg-blue-950/40 border border-blue-800/50', iconBg: 'bg-blue-500/20' },
  royal: { shell: 'border-pink-500/40 bg-[#171717]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3b0764] via-[#171717] to-black', text: 'text-pink-300', sub: 'text-pink-500/70', btn: 'bg-purple-950/30 border border-pink-500/30', iconBg: 'bg-pink-500/20' },
  minimal: { shell: 'border-gray-300 bg-gray-100', inner: 'bg-gradient-to-b from-gray-200 via-gray-100 to-white', text: 'text-gray-900', sub: 'text-gray-500', btn: 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]', iconBg: 'bg-gray-100' },
  cyberpunk: { shell: 'border-yellow-400 bg-neutral-900', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4a004a] via-[#111111] to-black', text: 'text-yellow-400', sub: 'text-yellow-500/70', btn: 'bg-black border border-yellow-400 shadow-[4px_4px_0px_0px_rgba(236,72,153,0.8)]', iconBg: 'bg-yellow-500/20' },
  glassmorphism: { shell: 'border-white/20 bg-slate-900', inner: 'bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-[#170529] to-black', text: 'text-white', sub: 'text-white/70', btn: 'bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]', iconBg: 'bg-white/10' },
  dracula: { shell: 'border-[#ff79c6] bg-[#282a36]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#44475a] via-[#282a36] to-black', text: 'text-[#ff79c6]', sub: 'text-[#bd93f9]', btn: 'bg-[#44475a]/50 border border-[#ff79c6]/50', iconBg: 'bg-[#bd93f9]/20' },
  aurora: { shell: 'border-green-400/40 bg-[#0B101E]', inner: 'bg-gradient-to-b from-[#0B101E] via-[#051814] to-[#1A2F2B]', text: 'text-green-300', sub: 'text-green-500/70', btn: 'bg-[#121E1C] border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]', iconBg: 'bg-green-500/10' },
  sunset: { shell: 'border-orange-400/40 bg-[#2D1B2E]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#6a1523] via-[#2D1B2E] to-[#120012]', text: 'text-orange-300', sub: 'text-orange-500/70', btn: 'bg-white/5 backdrop-blur-md border border-orange-500/30', iconBg: 'bg-orange-500/20' },
  ocean: { shell: 'border-cyan-500/40 bg-[#0A192F]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00344d] via-[#0A192F] to-[#020c1b]', text: 'text-[#64ffda]', sub: 'text-[#64ffda]/60', btn: 'bg-[#112240] border border-[#64ffda]/30', iconBg: 'bg-[#64ffda]/10' },
  forest: { shell: 'border-[#A3B18A] bg-[#1b2b23]', inner: 'bg-gradient-to-b from-[#2a4436] via-[#1b2b23] to-[#0d1612]', text: 'text-[#DAD7CD]', sub: 'text-[#A3B18A]', btn: 'bg-white/5 border border-[#A3B18A]/50', iconBg: 'bg-[#A3B18A]/20' },
  candy: { shell: 'border-pink-300 bg-[#fdf2f8]', inner: 'bg-gradient-to-br from-pink-100 via-sky-50 to-white', text: 'text-slate-800', sub: 'text-slate-500', btn: 'bg-white/60 backdrop-blur-sm shadow-sm border border-pink-200', iconBg: 'bg-pink-100' },
  hacker: { shell: 'border-[#00ff00] bg-black', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#002200] via-black to-black', text: 'text-[#00ff00]', sub: 'text-[#00ff00]/60', btn: 'bg-black border border-[#00ff00]/50', iconBg: 'bg-[#00ff00]/10' },
  luxury: { shell: 'border-[#B76E79] bg-[#1a1a1a]', inner: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a2024] via-[#1a1a1a] to-black', text: 'text-[#B76E79]', sub: 'text-[#B76E79]/70', btn: 'bg-[#2a2a2a] border border-[#B76E79]/50 shadow-[0_4px_15px_rgba(183,110,121,0.15)]', iconBg: 'bg-[#B76E79]/10' }
};

export default function PhoneMockup({ mockup, mockupLinks, sponsoredLinks, isPublic = false, handleLinkClick }: any) {
  const designId = mockup?.buttonDesign || 'mockup';
  const t = THEME_STYLES[designId] || THEME_STYLES.mockup;

  const nameStyle = mockup?.nameColor ? { color: mockup.nameColor } : undefined;
  const bioStyle = mockup?.bioColor ? { color: mockup.bioColor } : undefined;
  const btnTextStyle = mockup?.btnTextColor ? { color: mockup.btnTextColor } : undefined;

  const nameClass = mockup?.nameColor ? '' : t.text;
  const bioClass = mockup?.bioColor ? '' : t.sub;
  const btnTextClass = mockup?.btnTextColor ? '' : t.text;

  const containerClass = isPublic 
    ? `w-full max-w-[400px] mx-auto aspect-[9/19] max-h-[92dvh] rounded-[3rem] p-2 sm:p-2.5 relative shrink-0 border-[6px] sm:border-[8px] shadow-[0_0_80px_rgba(251,191,36,0.15)] ${t.shell}`
    : `w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-[9/19] rounded-[2rem] sm:rounded-[2.5rem] p-2 relative shrink-0 transition-all duration-500 transform-gpu hover:scale-[1.02] border-[4px] sm:border-[6px] shadow-2xl ${t.shell}`;

  const innerRounded = isPublic ? "rounded-[2.6rem]" : "rounded-[1.6rem] sm:rounded-[2rem]";
  
  const safeMockupLinks = Array.isArray(mockupLinks) ? mockupLinks : [];
  const safeSponsoredLinks = Array.isArray(sponsoredLinks) ? sponsoredLinks : [];

  const displayLinks = isPublic ? safeMockupLinks : safeMockupLinks.slice(0, 3);
  const displaySponsored = isPublic ? safeSponsoredLinks : safeSponsoredLinks.slice(0, 1);

  return (
    <div className={containerClass}>
      <div className={`w-full h-full ${innerRounded} relative overflow-hidden flex flex-col ${t.inner}`}>
        
        {/* Notch - کامێرای مۆبایل */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-center gap-2 shadow-sm border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
        </div>

        <div className={`flex-1 flex flex-col items-center pt-14 px-4 pb-6 z-20 w-full overflow-y-auto scrollbar-hide ${isPublic ? 'pb-32' : ''}`}>
          
          <div className="relative mb-5 shrink-0 mt-2 sm:mt-0">
            <div className="relative w-24 h-24 rounded-[1.6rem] p-[2px] overflow-hidden group shadow-2xl">
              <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_280deg,rgba(255,255,255,0.9)_360deg)] animate-[spin_3s_linear_infinite] z-0"></div>
              <div className="relative z-10 w-full h-full rounded-[1.5rem] overflow-hidden flex items-center justify-center bg-neutral-900 border-[2px] border-white/20">
                 {mockup?.avatar ? (
                   <img src={mockup.avatar} className="w-full h-full object-cover" alt="Profile" />
                 ) : (
                   <span className="text-4xl font-black text-white">{(mockup?.name || 'کۆسرەت').charAt(0)}</span>
                 )}
              </div>
            </div>
            {mockup?.isPro && (
              <div className="absolute -top-1.5 -left-1.5 z-30 pointer-events-none">
                <VerifiedBadge className="w-[26px] h-[26px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 w-full px-2 mb-1.5">
             <h3 className={`text-2xl tracking-wide text-center break-words font-black ${nameClass}`} style={nameStyle}>
               {mockup?.name || 'کۆسرەت مامە'}
             </h3>
             {mockup?.isPro && <VerifiedBadge className="w-[20px] h-[20px] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />}
          </div>
          
          <p className={`text-[13px] mb-8 font-bold text-center px-2 opacity-90 ${bioClass}`} style={bioStyle}>
             {mockup?.bio || 'شارەزا لە تەکنەلۆژیا'}
          </p>

          <div className="w-full space-y-4 px-1 sm:px-2 flex-none">
            {displayLinks.map((link: any, idx: number) => {
               const IconName = link.iconName || link.icon || 'Globe';
               const Icon = (icons as any)[IconName] || icons.Globe;
               const customColor = link.color || '#1877F2';

               const btnContent = (
                  <div className={`relative w-full rounded-[18px] p-[2px] overflow-hidden group transition-transform hover:scale-[1.03] active:scale-95 shadow-[0_5px_20px_rgba(0,0,0,0.2)]`}>
                    <div className="absolute inset-0 bg-white/10 z-0"></div>
                    <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] z-0" 
                         style={{ background: `conic-gradient(from 0deg, transparent 0 280deg, ${customColor} 360deg)` }}>
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] z-0 blur-[6px]" 
                         style={{ background: `conic-gradient(from 0deg, transparent 0 280deg, ${customColor} 360deg)` }}>
                    </div>
                    <div className="absolute inset-[2px] rounded-[16px] bg-black/40 backdrop-blur-md"></div>

                    <div className={`relative z-10 w-full rounded-[16px] flex items-center justify-between p-3 ${t.btn}`} style={['light'].includes(designId) ? { backgroundColor: '#ffffff' } : {}}>
                      <div className="flex items-center gap-3 w-full pr-1">
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden ${t.iconBg}`}>
                          {link.imageUrl || link.icon?.startsWith('/') ? (
                             <img src={link.imageUrl || link.icon} className="w-full h-full object-contain" alt="Icon" />
                          ) : (
                             <Icon size={24} color={customColor} />
                          )}
                        </div>
                        <span className={`font-black text-[14px] sm:text-[15px] truncate ${btnTextClass}`} style={btnTextStyle}>
                           {link.name || link.title}
                        </span>
                      </div>
                      <div className="pr-2 opacity-80 shrink-0" style={{ color: designId === 'gold' ? '#fbbf24' : customColor }}><ArrowUpRight size={22} strokeWidth={2.5} /></div>
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
            <div className="w-full mt-8 space-y-5 px-1 sm:px-2 flex-none relative z-10">
              <div className="flex items-center justify-center gap-2 w-full opacity-90">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50"></div>
                <span className="text-[10px] font-black px-3 py-1 rounded-lg border bg-black/80 border-amber-500/30 text-amber-400 tracking-widest uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  سپۆنسەر کراو
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50"></div>
              </div>

              {displaySponsored.map((item: any, idx: number) => {
                 const IconName = item.iconName || item.icon || 'Star';
                 const Icon = (icons as any)[IconName] || icons.Star;

                 const spBtnContent = (
                    <div className="relative w-full group transition-transform hover:scale-[1.03] active:scale-95 shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)]">
                      <div className="absolute -top-1.5 -left-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] border border-yellow-300 z-30 rotate-[-12deg]">VIP</div>
                      
                      <div className="relative w-full rounded-[20px] p-[2px] overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 z-0"></div>
                        <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite] z-0"
                             style={{ background: `conic-gradient(from 0deg, transparent 0 250deg, #ef4444 300deg, #f97316 330deg, #fbbf24 360deg)` }}>
                        </div>
                        <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_infinite] z-0 blur-[8px]"
                             style={{ background: `conic-gradient(from 0deg, transparent 0 250deg, #ef4444 300deg, #f97316 330deg, #fbbf24 360deg)` }}>
                        </div>

                        <div className="absolute inset-[2px] rounded-[18px] bg-black/60 backdrop-blur-md"></div>

                        <div className="relative z-10 w-full bg-gradient-to-br from-neutral-950 to-[#0a0a0a] rounded-[18px] p-3 sm:p-4 flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-3 w-full pr-1 mt-1">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/5 p-1.5 flex items-center justify-center shrink-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10 relative overflow-hidden">
                              <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                              {item.imageUrl || item.icon?.startsWith('/') ? <img src={item.imageUrl || item.icon} className="w-full h-full object-cover rounded-lg relative z-10" /> : <Icon size={30} className="text-amber-400 relative z-10" strokeWidth={2.5} />}
                            </div>
                            <div className="flex-1 text-right min-w-0 pr-1 relative z-10">
                              <h4 className="font-black text-[15px] sm:text-[17px] drop-shadow-md text-white line-clamp-1">{item.name || item.title}</h4>
                              <p className="text-[11px] sm:text-[12px] font-bold text-amber-400/90 truncate drop-shadow-sm mt-1">{(item.url && item.url.includes('.apk')) ? 'داگرتنی بەرنامە' : 'سپۆنسەری تایبەت'}</p>
                            </div>
                            <ArrowUpRight size={24} className="opacity-90 ml-1 shrink-0 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] relative z-10" strokeWidth={3} />
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
                <span className="text-amber-400 font-black text-[12px] drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] text-center tracking-wide w-full px-2">بە ئاسانی دیزاینێکی ئاوا بۆخۆت دروست بکە</span>
             </div>
          )}
        </div>

        {isPublic && (
          <div className="absolute bottom-0 left-0 w-full pt-20 pb-6 px-4 bg-gradient-to-t from-black via-black/90 to-transparent z-40 flex justify-center pointer-events-none">
            <a href="https://biokurd.com" className="relative p-[2.5px] rounded-full overflow-hidden group hover:scale-105 active:scale-95 transition-all duration-300 w-full max-w-[320px] shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] pointer-events-auto">
              <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_160deg,#fbbf24_220deg,#f59e0b_280deg,#fffbeb_360deg)] animate-[spin_2s_linear_infinite] z-0"></div>
              <div className="relative z-10 flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 backdrop-blur-xl rounded-full w-full h-full border border-white/10 overflow-hidden shadow-[inset_0_0_20px_rgba(251,191,36,0.05)]">
                <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent opacity-50 group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out"></div>
                <icons.Sparkles size={20} className="text-amber-400 relative z-10 animate-pulse" />
                <span className="text-amber-400 font-bold text-[17px] whitespace-nowrap drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)] relative z-10 tracking-wide mt-0.5" style={{ fontFamily: '"Amiri", serif' }}>لینکێکی ئاوا بۆخۆت دروست بکە</span>
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