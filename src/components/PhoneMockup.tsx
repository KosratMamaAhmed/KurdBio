import * as icons from 'lucide-react';
import { ArrowUpRight, Star } from 'lucide-react';

const VerifiedBadge = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92898C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92898 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92898L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92898 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#1d9bf0"/>
    <path d="M10.3333 14.3333L7.16667 11.1667L8.10833 10.225L10.3333 12.45L15.8917 6.89167L16.8333 7.83333L10.3333 14.3333Z" fill="white"/>
  </svg>
);

export default function PhoneMockup({ mockup, mockupLinks = [], sponsoredLinks = [] }: any) {
  const bgPosStyle = mockup?.bgPos ? `${mockup.bgPos.x}% ${mockup.bgPos.y}%` : '50% 50%';
  const avatarPosStyle = mockup?.avatarPos ? `${mockup.avatarPos.x}% ${mockup.avatarPos.y}%` : '50% 50%';

  const allLinks = [...mockupLinks, ...sponsoredLinks];

  return (
    <div className="relative w-[300px] h-[610px] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-neutral-800 shrink-0 overflow-hidden font-kosrat">
      
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-50"></div>

      <div className="w-full h-full bg-slate-50 rounded-[2.25rem] overflow-hidden relative flex flex-col">
        
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-[38%] z-0">
          {mockup?.bgImage ? (
            <img src={mockup.bgImage} className="w-full h-full object-cover" style={{ objectPosition: bgPosStyle }} alt="bg" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/10 to-transparent"></div>
        </div>

        {/* 🌟 Content: مۆکئەپ بێ سکرۆڵ (Overflow Hidden) 🌟 */}
        <div className="relative z-10 w-full flex-1 overflow-hidden pt-16 px-4">
          <div className="flex flex-col items-center">
            
            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-full p-1 bg-white/50 backdrop-blur-md shadow-lg mb-2">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                {mockup?.avatar ? (
                  <img src={mockup.avatar} className="w-full h-full object-cover scale-105" style={{ objectPosition: avatarPosStyle }} alt="avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">بەتاڵ</div>
                )}
              </div>
              {mockup?.isPro && (
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-[1px] shadow-sm">
                   <VerifiedBadge className="w-5 h-5 text-blue-500" />
                </div>
              )}
            </div>

            <h3 className="text-[16px] font-black text-gray-900 text-center leading-tight">{mockup?.name || 'BioKurd'}</h3>
            {mockup?.bio && <p className="text-[10px] font-bold text-gray-500 mt-1 text-center line-clamp-2 px-2">{mockup.bio}</p>}

            {/* 🌟 Buttons Section: باریک و ڕێک 🌟 */}
            <div className="w-full mt-4 flex flex-col gap-2">
              {allLinks.slice(0, 8).map((link: any, index: number) => {
                const IconName = link.iconName || link.icon || 'Globe';
                const Icon = (icons as any)[IconName] || icons.Globe;
                const brandColor = link.color || '#333333';
                const isSponsored = link.targetOS !== undefined;

                if (isSponsored) {
                  return (
                    <div key={index} className="w-full bg-white border border-orange-100 p-1.5 rounded-lg flex items-center gap-2 shadow-sm relative">
                       <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                         {link.imageUrl ? <img src={link.imageUrl} className="w-full h-full object-contain" /> : <Star size={12} className="text-orange-500" />}
                       </div>
                       <span className="text-[10px] font-black text-gray-800 flex-1 truncate">{link.title}</span>
                       <ArrowUpRight size={12} className="text-orange-400" />
                    </div>
                  );
                }

                return (
                  <div 
                    key={index}
                    style={{ backgroundColor: brandColor, color: '#fff' }}
                    className="w-full py-1.5 px-2.5 rounded-lg flex items-center justify-between shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-black/10 shrink-0">
                      {link.imageUrl ? <img src={link.imageUrl} className="w-full h-full object-contain p-0.5" /> : <Icon size={10} />}
                    </div>
                    <span className="flex-1 text-center font-bold text-[10px] truncate px-1">{link.title || link.name}</span>
                    <div className="w-5 h-5 shrink-0"></div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

        {/* Footer Button */}
        <div className="absolute bottom-5 left-0 w-full flex justify-center px-4">
           <div className="w-full py-2 bg-neutral-900 rounded-full flex items-center justify-center gap-2 text-white border border-white/10 shadow-xl">
              <icons.Sparkles size={12} className="text-amber-400" />
              <span className="font-black text-[10px]">لینکێکی ئاوا دروست بکە</span>
           </div>
        </div>

      </div>
    </div>
  );
}