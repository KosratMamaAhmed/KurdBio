import { motion } from 'motion/react';
import * as icons from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

const getContrastColor = (hexColor: string) => {
  if(!hexColor) return '#ffffff';
  let color = hexColor.replace('#', '');
  if (color.length === 3) color = color.split('').map(c => c + c).join('');
  const r = parseInt(color.substring(0, 2), 16), g = parseInt(color.substring(2, 2), 16), b = parseInt(color.substring(4, 2), 16);
  return (((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128) ? '#000000' : '#ffffff';
};

export default function ProfileLinkButton({ link, index, handleLinkClick }: any) {
  const IconName = link.icon === 'X' ? 'Twitter' : link.icon === 'TikTok' ? 'Music' : link.icon;
  const Icon = (icons as any)[IconName] || icons.Globe;
  
  let fallbackImageUrl = link.imageUrl;
  if (!fallbackImageUrl) {
      if (link.url?.includes('viber')) fallbackImageUrl = '/social/viber.png';
      else if (link.url?.includes('tel:')) fallbackImageUrl = '/social/call.png';
  }
  
  const bgColor = link.color || '#171717';
  const textColor = getContrastColor(bgColor);

  // 🔴 لێرەدا بەکارهێنەر دەتوانێت ٤ جۆر دیزاین بەکاربهێنێت. 
  // دیزاینی سەرەکی (دیفاڵت) ڕێک وەک مۆکئەپەکەیە.
  const designVariant = link.design || 'mockup'; // بژاردەکان: mockup, glass, neon, outline

  let buttonContent = null;

  if (designVariant === 'mockup') {
    // ١. دیزاینی مۆکئەپ (نموونە سەرەکییەکە کە داوات کرد)
    buttonContent = (
      <button onClick={() => handleLinkClick(link.url, link.id)} style={{ backgroundColor: bgColor, color: textColor }} className="relative z-10 block w-full p-2 sm:p-2.5 rounded-2xl border border-white/20 shadow-lg bg-opacity-95">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 sm:gap-4 w-full pr-1">
             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[12px] bg-black/20 flex items-center justify-center shrink-0 shadow-inner">
               {fallbackImageUrl ? <img src={fallbackImageUrl} className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-md" alt={link.title} /> : <Icon size={20} strokeWidth={2.5} />}
             </div>
             <span className="font-black text-[13px] sm:text-[15px] tracking-wide text-right leading-tight break-words flex-1 pr-1 drop-shadow-sm">{link.title}</span>
           </div>
           <div className="opacity-80 group-hover:opacity-100 transition-opacity pl-3 shrink-0"><ArrowUpRight size={18} strokeWidth={2.5} /></div>
        </div>
      </button>
    );
  } else if (designVariant === 'glass') {
    // ٢. دیزاینی شوشەیی
    buttonContent = (
      <button onClick={() => handleLinkClick(link.url, link.id)} className="relative z-10 block w-full p-3 sm:p-4 rounded-2xl border border-white/10 shadow-xl bg-white/10 backdrop-blur-md text-white">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 sm:gap-4 w-full pr-1">
             <div className="w-12 h-12 rounded-[12px] shadow-inner flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
               {fallbackImageUrl ? <img src={fallbackImageUrl} className="w-6 h-6 object-contain" alt={link.title} /> : <Icon size={24} color={textColor} strokeWidth={2.5} />}
             </div>
             <span className="font-black text-[14px] sm:text-[16px] text-right flex-1 pr-1">{link.title}</span>
           </div>
           <ArrowUpRight size={20} className="opacity-70" strokeWidth={2.5} />
        </div>
      </button>
    );
  } else if (designVariant === 'neon') {
    // ٣. دیزاینی نیۆن (لێواری ڕووناکدار)
    buttonContent = (
      <button onClick={() => handleLinkClick(link.url, link.id)} style={{ borderColor: bgColor, boxShadow: `0 0 15px ${bgColor}40` }} className="relative z-10 block w-full p-3 rounded-2xl border-2 bg-neutral-900 text-white">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 w-full pr-1">
             <div className="w-10 h-10 flex items-center justify-center shrink-0">
               {fallbackImageUrl ? <img src={fallbackImageUrl} className="w-8 h-8 object-contain" alt={link.title} /> : <Icon size={28} color={bgColor} />}
             </div>
             <span className="font-black text-[14px] sm:text-[15px] flex-1 pr-1" style={{ color: bgColor }}>{link.title}</span>
           </div>
           <ArrowUpRight size={20} color={bgColor} />
        </div>
      </button>
    );
  } else if (designVariant === 'outline') {
    // ٤. دیزاینی سادەی هێڵدار
    buttonContent = (
      <button onClick={() => handleLinkClick(link.url, link.id)} style={{ borderColor: bgColor, color: bgColor }} className="relative z-10 block w-full p-3 rounded-2xl border-2 bg-transparent bg-white/5 backdrop-blur-sm">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 w-full pr-1">
             {fallbackImageUrl ? <img src={fallbackImageUrl} className="w-6 h-6 object-contain" alt={link.title} /> : <Icon size={24} />}
             <span className="font-black text-[14px] sm:text-[15px] flex-1 pr-1">{link.title}</span>
           </div>
           <ArrowUpRight size={20} />
        </div>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + (index * 0.1) }}
      className="relative w-full sm:w-[90%] md:w-[85%] mx-auto overflow-hidden group hover:scale-[1.03] active:scale-95 transition-all duration-300"
    >
      {buttonContent}
    </motion.div>
  );
}