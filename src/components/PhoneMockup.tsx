import * as icons from 'lucide-react';
import { ArrowUpRight, Star } from 'lucide-react';

const VerifiedBadge = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92898C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92898 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92898L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92898 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#1d9bf0"/>
    <path d="M10.3333 14.3333L7.16667 11.1667L8.10833 10.225L10.3333 12.45L15.8917 6.89167L16.8333 7.83333L10.3333 14.3333Z" fill="white"/>
  </svg>
);

const getBrandStyle = (url: string, dbColor?: string) => {
  const lowerUrl = (url || '').toLowerCase();
  
  if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp')) return { bg: '#25D366', text: '#fff' };
  if (lowerUrl.includes('instagram')) return { bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', text: '#fff' };
  if (lowerUrl.includes('snapchat')) return { bg: '#FFFC00', text: '#000' };
  if (lowerUrl.includes('facebook') || lowerUrl.includes('fb.me')) return { bg: '#1877F2', text: '#fff' };
  if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram')) return { bg: '#26A5E4', text: '#fff' };
  if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) return { bg: '#FF0000', text: '#fff' };
  if (lowerUrl.includes('tiktok')) return { bg: '#000000', text: '#fff' };
  if (lowerUrl.includes('linkedin')) return { bg: '#0A66C2', text: '#fff' };
  
  if (dbColor && dbColor !== '#333333' && dbColor !== '') {
     return { bg: dbColor, text: '#fff', border: 'none' };
  }
  
  return { bg: '#ffffff', text: '#1f2937', border: '1px solid #e5e7eb' };
};

export default function PhoneMockup({ mockup, mockupLinks = [], sponsoredLinks = [] }: any) {
  const bgPosStyle = mockup?.bgPos ? `${mockup.bgPos.x}% ${mockup.bgPos.y}%` : '50% 50%';
  const avatarPosStyle = mockup?.avatarPos ? `${mockup.avatarPos.x}% ${mockup.avatarPos.y}%` : '50% 50%';

  const allLinks = [...mockupLinks, ...sponsoredLinks];

  return (
    <div className="relative w-[280px] sm:w-[300px] lg:w-[320px] h-[580px] sm:h-[600px] lg:h-[640px] bg-black rounded-[3rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-neutral-800 shrink-0 overflow-hidden font-kosrat">
      
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-50 flex items-end justify-center pb-1.5 gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-800/80"></div>
        <div className="w-12 h-1.5 rounded-full bg-neutral-800/80"></div>
      </div>

      <div className="w-full h-full bg-slate-50 rounded-[2.25rem] overflow-hidden relative flex flex-col">
        
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-[35%] z-0">
          {mockup?.bgImage ? (
            <img src={mockup.bgImage} className="w-full h-full object-cover" style={{ objectPosition: bgPosStyle }} alt="cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pt-16 pb-20 px-3">
          <div className="flex flex-col items-center">
            
            <div className="relative w-24 h-24 rounded-full p-1 bg-white/60 backdrop-blur-md shadow-lg mb-2">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                {mockup?.avatar ? (
                  <img src={mockup.avatar} alt="avatar" className="w-full h-full object-cover scale-105" style={{ objectPosition: avatarPosStyle }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">بەتاڵ</div>
                )}
              </div>
              {mockup?.isPro && (
                <div className="absolute bottom-1 right-1 z-30 bg-white rounded-full p-[2px] shadow-sm">
                   <VerifiedBadge className="w-5 h-5 text-blue-500" />
                </div>
              )}
            </div>

            <h3 className="text-[17px] font-black text-gray-900 text-center leading-tight">
              {mockup?.name || 'ناوی تۆ'}
            </h3>
            {mockup?.bio && (
              <p className="text-[11px] font-bold text-gray-600 mt-1 text-center max-w-[200px] leading-snug">
                {mockup.bio}
              </p>
            )}

            {/* 🌟 بەشی دوگمەکان (لێرەدا دوگمەکان زۆر باریکتر و پێکەوە نووساوتر کراون) 🌟 */}
            <div className="w-full mt-5 flex flex-col gap-2">
              {allLinks.map((link: any, index: number) => {
                const brandStyle = getBrandStyle(link.url, link.color);
                const IconName = link.iconName || link.icon || 'Globe';
                const Icon = (icons as any)[IconName] || icons.Globe;
                const isAd = link.targetOS !== undefined;

                if (isAd) {
                  return (
                    <div key={index} className="relative w-full shadow-sm rounded-[10px] overflow-hidden bg-white border border-orange-100 p-2 flex items-center justify-between mt-1">
                      <div className="absolute -top-1 -left-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm z-20">VIP</div>
                      <div className="flex items-center gap-2 relative z-10 w-full">
                        <div className="w-8 h-8 rounded-md bg-gray-50 p-0.5 shrink-0">
                          {link.imageUrl ? <img src={link.imageUrl} className="w-full h-full object-cover rounded-sm" /> : <Star size={16} className="text-orange-500 mx-auto mt-1" />}
                        </div>
                        <div className="flex-1 text-right min-w-0 pr-1">
                          <h4 className="font-black text-[11px] text-gray-900 line-clamp-1">{link.title}</h4>
                          <p className="text-[8px] font-bold text-gray-500 truncate">سپۆنسەرکراو</p>
                        </div>
                        <ArrowUpRight size={14} className="text-orange-500 shrink-0" />
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={index}
                    style={{ background: brandStyle.bg, color: brandStyle.text, border: brandStyle.border || 'none' }}
                    className="w-full py-1.5 px-2.5 rounded-[10px] flex items-center justify-between shadow-sm relative overflow-hidden"
                  >
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden p-1 bg-black/10">
                      {link.imageUrl ? <img src={link.imageUrl} className="w-full h-full object-contain drop-shadow-sm" /> : <Icon size={12} className="opacity-90" />}
                    </div>
                    <span className="flex-grow text-center px-1 z-10 font-bold text-[11px]">{link.title || link.name}</span>
                    <div className="w-6 h-6 flex-shrink-0"></div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

        {/* 🌟 دوگمەی خوارەوە کە جێگیرە 🌟 */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center z-40 pointer-events-none px-4">
          <div className="pointer-events-auto relative group w-full max-w-[200px]">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full blur-[4px] opacity-60"></div>
             <div className="relative px-3 py-2 bg-gray-900 rounded-full flex items-center justify-center gap-1.5 text-white shadow-xl border border-gray-700">
                <icons.Sparkles size={12} className="text-amber-400 animate-pulse" />
                <span className="font-black text-[10px] tracking-wide">لینکێکی ئاوا دروست بکە</span>
             </div>
          </div>
       </div>

      </div>
    </div>
  );
}