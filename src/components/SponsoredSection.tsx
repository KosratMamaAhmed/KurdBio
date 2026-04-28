import { motion } from 'motion/react';
import * as icons from 'lucide-react';
import { ArrowUpRight, Eye } from 'lucide-react';

interface SponsoredProps {
  globalBtns: any[];
  activeAds: any[];
}

export default function SponsoredSection({ globalBtns, activeAds }: SponsoredProps) {
  const hasSponsored = activeAds.length > 0 || globalBtns.length > 0;

  if (!hasSponsored) return null;

  return (
    <div className="w-full mt-10 space-y-5 relative z-10">
      <div className="flex items-center justify-center gap-3 mb-6 w-full sm:w-[85%] mx-auto opacity-70">
        <div className="h-[1px] flex-1 bg-white/30"></div>
        <span className="text-[12px] font-black px-4 py-1.5 rounded-xl border bg-black/40 border-white/20 text-white tracking-widest uppercase">
          سپۆنسەرکراو
        </span>
        <div className="h-[1px] flex-1 bg-white/30"></div>
      </div>

      {/* 🌟 دیزاینە بەفری و گەورەکە 🌟 */}
      {[...globalBtns, ...activeAds].map((item: any, index: number) => {
        const isAd = item.targetOS !== undefined; 
        const IconName = item.icon || 'Globe';
        const Icon = (icons as any)[IconName] || icons.Globe;
        
        return (
        <motion.a
          key={`sp-${index}`} href={item.url} target="_blank" rel="noopener noreferrer"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + (index * 0.1) }}
          className="relative block w-full px-2 sm:px-0 mx-auto hover:scale-[1.02] active:scale-95 transition-all duration-300 mb-4 group"
        >
          <div className="relative z-10 block w-full p-4 sm:p-5 rounded-[2rem] border-2 border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.4)] bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl text-white overflow-hidden">
             {/* بریسکەی شوشەیی */}
             <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
             
             <div className="flex items-center justify-between relative z-10">
               <div className="flex items-center gap-4 sm:gap-6 w-full pr-1">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[18px] sm:rounded-[24px] bg-white/40 p-1.5 flex items-center justify-center shrink-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.6)] border border-white/50">
                   {item.imageUrl ? (
                     <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-[14px] sm:rounded-[18px]" />
                   ) : (
                     isAd ? <Eye size={36} strokeWidth={2.5} /> : <Icon size={36} strokeWidth={2.5} />
                   )}
                 </div>
                 <div className="flex-1 text-right min-w-0 pr-2">
                   <h4 className="font-black text-[18px] sm:text-[20px] drop-shadow-md text-white line-clamp-1">{item.title}</h4>
                   {(item.subtitle || isAd) && <p className="text-[12px] sm:text-[14px] font-bold text-white/90 truncate mt-1.5 drop-shadow-sm">{item.subtitle || 'سپۆنسەر'}</p>}
                 </div>
               </div>
               <ArrowUpRight size={28} className="opacity-90 ml-2 shrink-0 text-white drop-shadow-md" strokeWidth={3} />
             </div>
          </div>
        </motion.a>
      )})}
    </div>
  );
}