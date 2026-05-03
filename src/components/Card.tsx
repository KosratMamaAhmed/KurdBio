import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Palette, Type, Move, Droplet, Layout, Star } from 'lucide-react';

interface CardProps {
  profile: any;
  onClose: () => void;
}

// 🌟 تەنها ٥ دیزاینە پریمیمە خەیاڵییەکە وەک مۆکئەپەکە 🌟
const CARD_DESIGNS = [
  { id: 0, name: 'ئاڵتوونی شاهانە', bg: ['#0f172a', '#020617'], shape: '#fbbf24', shapeShadow: 'rgba(251, 191, 36, 0.5)', text: '#fbbf24', subText: '#fcd34d', qrFg: '000000', calligCol: '#ffffff', scanCol: '#94a3b8' },
  { id: 1, name: 'شەبەنگی باکوور', bg: ['#042f2e', '#020617'], shape: '#10b981', shapeShadow: 'rgba(16, 185, 129, 0.6)', text: '#34d399', subText: '#6ee7b7', qrFg: '042f2e', calligCol: '#ffffff', scanCol: '#a7f3d0' },
  { id: 2, name: 'سایبەرپەنک', bg: ['#2e1065', '#000000'], shape: '#ec4899', shapeShadow: 'rgba(236, 72, 153, 0.7)', text: '#f472b6', subText: '#fbcfe8', qrFg: '2e1065', calligCol: '#22d3ee', scanCol: '#f9a8d4' },
  { id: 3, name: 'شوشەیی بلور', bg: ['#1e1b4b', '#0f172a'], shape: '#6366f1', shapeShadow: 'rgba(99, 102, 241, 0.6)', text: '#818cf8', subText: '#c7d2fe', qrFg: '1e1b4b', calligCol: '#ffffff', scanCol: '#a5b4fc' },
  { id: 4, name: 'سپی پلاتینی', bg: ['#f8fafc', '#e2e8f0'], shape: '#0f172a', shapeShadow: 'rgba(15, 23, 42, 0.3)', text: '#0f172a', subText: '#334155', qrFg: '000000', calligCol: '#1e293b', scanCol: '#475569' }
];

const FONTS = [
  { id: 'Amiri', name: 'ئەمیری (کالیگرافی)' },
  { id: 'Aref Ruqaa', name: 'عارف ڕوقعە' },
  { id: 'Reem Kufi', name: 'ڕیم کوفی' },
  { id: 'Samim', name: 'سەمیم (ناوازە)' },
  { id: 'Vazirmatn', name: 'ڤەزیرمەتن' },
  { id: 'Noto Sans Arabic', name: 'نۆتۆ سانس' },
  { id: 'Great Vibes', name: 'ئینگلیزی کالیگرافی ١' },
  { id: 'Dancing Script', name: 'ئینگلیزی کالیگرافی ٢' },
  { id: 'Custom1', name: 'فۆنتی تایبەتی ١' },
  { id: 'Custom2', name: 'فۆنتی تایبەتی ٢' }
];

export default function Card({ profile, onClose }: CardProps) {
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState<'themes' | 'text' | 'position'>('themes');
  
  const [activeDesign, setActiveDesign] = useState(0);
  
  const [selectedFont, setSelectedFont] = useState('Noto Sans Arabic');
  const [customText, setCustomText] = useState('سکانم بکە بۆ بینینی سەرجەم بەستەرەکانم');
  const [fontSize, setFontSize] = useState(24); 
  const [posX, setPosX] = useState(750); 
  const [posY, setPosY] = useState(530); 

  const [nameColor, setNameColor] = useState(CARD_DESIGNS[0].text);
  const [bioColor, setBioColor] = useState(CARD_DESIGNS[0].subText);
  const [customTextColor, setCustomTextColor] = useState(CARD_DESIGNS[0].calligCol); 

  const [debouncedSettings, setDebouncedSettings] = useState({ text: customText, nameCol: nameColor, bioCol: bioColor, customCol: customTextColor, x: posX, y: posY, font: selectedFont, size: fontSize });

  const changeTheme = (idx: number) => {
    setActiveDesign(idx);
    setNameColor(CARD_DESIGNS[idx].text);
    setBioColor(CARD_DESIGNS[idx].subText);
    setCustomTextColor(CARD_DESIGNS[idx].calligCol);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSettings({ text: customText, nameCol: nameColor, bioCol: bioColor, customCol: customTextColor, x: posX, y: posY, font: selectedFont, size: fontSize });
    }, 150);
    return () => clearTimeout(timer);
  }, [customText, nameColor, bioColor, customTextColor, posX, posY, selectedFont, fontSize]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => generateCardPreview());
    } else {
      setTimeout(generateCardPreview, 500);
    }
  }, [profile, activeDesign, debouncedSettings]); 

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (w < 2 * r) r = w / 2; if (h < 2 * r) r = h / 2;
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };

  const generateCardPreview = async () => {
    if (!profile?.slug) return;
    setGenerating(true);
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1050; canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas 2D context is not available");

      const design = CARD_DESIGNS[activeDesign];
      const fontPrimary = `"${debouncedSettings.font}", "Vazirmatn", sans-serif`;
      const isEnglish = /^[A-Za-z]/.test(debouncedSettings.text);
      const isLightMode = activeDesign === 4; // دیزاینی ٤ سپییە

      // بڕینەوەی کارتەکە
      roundRect(ctx, 0, 0, 1050, 600, 40);
      ctx.clip();

      // باکگراوند
      const bgGradient = ctx.createLinearGradient(0, 0, 1050, 600);
      bgGradient.addColorStop(0, design.bg[0]); 
      bgGradient.addColorStop(1, design.bg[1]); 
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1050, 600);

      // بریقەی سەر شاشەی کارتەکە (Glow)
      const glow1 = ctx.createRadialGradient(850, 100, 50, 850, 100, 400);
      glow1.addColorStop(0, design.shapeShadow); glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1; ctx.fillRect(0, 0, 1050, 600);

      const glow2 = ctx.createRadialGradient(200, 500, 50, 200, 500, 400);
      glow2.addColorStop(0, design.shapeShadow); glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2; ctx.fillRect(0, 0, 1050, 600);

      // نووسینی ناوەکەی لە باکگراونددا (Watermark)
      ctx.save();
      ctx.translate(525, 300); ctx.rotate(-Math.PI / 8);
      ctx.fillStyle = isLightMode ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)'; 
      ctx.font = `900 250px ${fontPrimary}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(profile.slug.toUpperCase(), 0, 0);
      ctx.restore();

      // شێوە ئەندازەییەکانی کارتەکە
      ctx.fillStyle = isLightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1050, 0); ctx.lineTo(1050, 250); ctx.lineTo(0, 450); ctx.closePath(); ctx.fill();

      ctx.shadowColor = design.shapeShadow; ctx.shadowBlur = 40; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 10;
      ctx.fillStyle = design.shape; 
      ctx.beginPath(); ctx.moveTo(0, 600); ctx.lineTo(0, 400); ctx.bezierCurveTo(200, 450, 400, 550, 600, 600); ctx.closePath(); ctx.fill();
      ctx.shadowColor = 'transparent'; 

      const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
        const img = new window.Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = reject; img.src = src;
      });

      // 🌟 بەشی QR Code 🌟
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`https://biokurd.com/${profile.slug}`)}&margin=1&color=${design.qrFg}&bgcolor=ffffff`;
      const xQ = 80; const yQ = 80; const wQ = 320; const hQ = 320;

      ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, xQ - 15, yQ - 15, wQ + 30, hQ + 30, 30); ctx.fill(); ctx.shadowColor = 'transparent';

      try {
        const qrRes = await fetch(qrUrl); const qrBlob = await qrRes.blob();
        const qrObjUrl = URL.createObjectURL(qrBlob); const qrImg = await loadImage(qrObjUrl);
        ctx.save(); roundRect(ctx, xQ, yQ, wQ, hQ, 20); ctx.clip(); ctx.drawImage(qrImg, xQ, yQ, wQ, hQ); ctx.restore();
      } catch (e) { console.error("Failed to load QR code"); }

      // 🌟 ڕێکخستنی نووسینی "SCAN TO CONNECT" بۆ ئەوەی لەگەڵ باکگراوند بگونجێت 🌟
      ctx.fillStyle = design.scanCol;
      ctx.font = `bold 20px "Tajawal", sans-serif`; ctx.textAlign = 'center';
      ctx.fillText("SCAN TO CONNECT", xQ + (wQ / 2), yQ + hQ + 35);

      // 🌟 بەشی پرۆفایل و دەقەکان 🌟
      const textCenterX = 750; const avatarY = 160; const avatarRadius = 85;

      // ١. هێڵی دەرەوەی پرۆفایلەکە کە جیای دەکاتەوە
      ctx.shadowColor = design.shapeShadow; ctx.shadowBlur = 35;
      ctx.beginPath(); ctx.arc(textCenterX, avatarY, avatarRadius + 12, 0, Math.PI * 2); ctx.fillStyle = design.shape; ctx.fill(); ctx.shadowColor = 'transparent';

      // ٢. هێڵی ناوەوە (باکگراوند) کە تۆخە بۆ دەرخستنی وێنەکە
      ctx.beginPath(); ctx.arc(textCenterX, avatarY, avatarRadius + 4, 0, Math.PI * 2);
      ctx.fillStyle = isLightMode ? '#ffffff' : '#050505'; ctx.fill();

      // ٣. خودی وێنەکە
      if (profile.avatarUrl) {
        try {
          const avatarImg = await loadImage(profile.avatarUrl);
          ctx.save(); ctx.beginPath(); ctx.arc(textCenterX, avatarY, avatarRadius, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
          ctx.drawImage(avatarImg, textCenterX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2); ctx.restore();
        } catch (e) { drawAvatarFallback(ctx, textCenterX, avatarY, avatarRadius, profile.displayName, fontPrimary, design.text, isLightMode); }
      } else { drawAvatarFallback(ctx, textCenterX, avatarY, avatarRadius, profile.displayName, fontPrimary, design.text, isLightMode); }

      // ناو (بەرگرتن لە چوونە دەرەوەی لە هێڵ بە بەکارهێنانی maxWidth = 450)
      const nameY = 290; ctx.textBaseline = 'top'; ctx.textAlign = 'center';
      ctx.fillStyle = debouncedSettings.nameCol;
      ctx.shadowColor = design.shapeShadow; ctx.shadowBlur = 20; ctx.shadowOffsetY = 3;
      ctx.font = `900 65px ${fontPrimary}`; 
      ctx.fillText(profile.displayName || 'کۆسرەت', textCenterX, nameY, 450);
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      // بایۆ (بەرگرتن لە چوونە دەرەوەی لە هێڵ بە بەکارهێنانی maxWidth = 420)
      ctx.fillStyle = debouncedSettings.bioCol; 
      ctx.font = `500 30px ${fontPrimary}`;
      const bioText = profile.bio || 'باشترین بەستەرەکانم لێرە ببینە';
      wrapText(ctx, bioText, textCenterX, 390, 45, 420);

      // دەقی کالیگرافی خوارەوە (یان هەر دەقێکی تر کە خۆی دەینووسێت)
      const customRenderText = debouncedSettings.text.trim();
      if (customRenderText !== '') {
          ctx.fillStyle = debouncedSettings.customCol;
          ctx.font = `700 ${debouncedSettings.size}px ${fontPrimary}`; 
          ctx.textBaseline = 'middle'; 
          
          if (isEnglish) {
            ctx.direction = 'ltr'; ctx.textAlign = 'left';
          } else {
            ctx.direction = 'rtl'; ctx.textAlign = 'center'; 
          }
          
          // لێرەشدا ڕێگری دەکەین لە دەرچوون لە کارتەکە بە 450px
          ctx.fillText(customRenderText, debouncedSettings.x, debouncedSettings.y, 450);
      }

      ctx.fillStyle = design.shape; ctx.font = `900 24px sans-serif`;
      ctx.direction = 'ltr'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      ctx.fillText("BioKurd.com", 1010, 575);

      setCardImage(canvas.toDataURL('image/png', 1.0));
      
    } catch (err) { console.error("Error generating card:", err); } 
    finally { setGenerating(false); }
  };

  const drawAvatarFallback = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, name: string, font: string, textColor: string, isLight: boolean) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = isLight ? '#f3f4f6' : '#1e293b'; ctx.fill();
    ctx.fillStyle = CARD_DESIGNS[activeDesign].shape; ctx.font = `bold 80px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(name?.charAt(0).toUpperCase() || 'U', x, y + 5);
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, lineHeight: number, maxWidth: number) => {
    const words = text.split(' '); let line = '';
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' '; let metrics = ctx.measureText(testLine); let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) { ctx.fillText(line.trim(), x, y); line = words[n] + ' '; y += lineHeight; } else { line = testLine; }
    }
    ctx.fillText(line.trim(), x, y);
  };

  const downloadBusinessCard = () => {
    if (!cardImage) return;
    const a = document.createElement('a'); a.download = `BioKurd-${profile.slug}-Card.png`; a.href = cardImage; a.click();
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col lg:flex-row overflow-hidden font-sans" dir="rtl">
      
      {/* 🌟 بەشی بینینی کارتەکە 🌟 */}
      <div className="w-full lg:w-[65%] h-[45vh] lg:h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-[#050505] relative flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-4 z-20">
           <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl shadow-2xl flex items-center justify-center">
             <Layout size={28} className="text-amber-400"/>
           </div>
           <div>
             <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">ستۆدیۆی کارتی تایبەت</h2>
             <p className="text-[11px] sm:text-sm font-bold text-amber-400/80 uppercase tracking-widest mt-0.5">BioKurd Premium</p>
           </div>
        </div>

        <button onClick={onClose} className="absolute top-4 left-4 sm:top-8 sm:left-8 p-3.5 bg-white/5 hover:bg-red-500 border border-white/10 hover:border-red-400 text-white rounded-2xl transition-all active:scale-90 z-20 shadow-lg">
          <X size={22} strokeWidth={3}/>
        </button>

        <div className="w-full max-w-[800px] relative flex items-center justify-center mt-12 sm:mt-0 z-20 perspective-1000">
          {generating ? (
            <div className="flex flex-col items-center gap-6 py-20">
               <div className="relative w-20 h-20 flex items-center justify-center">
                 <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                 <Star size={32} className="text-amber-400 animate-pulse" />
               </div>
               <span className="font-black text-lg animate-pulse text-white tracking-wide">دروستکردنی کارتەکەت بەکوالێتی بەرز...</span>
            </div>
          ) : (
            cardImage && (
              <motion.img 
                initial={{ opacity: 0, scale: 0.8, rotateY: 15 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                src={cardImage} alt="Business Card" 
                className="w-full max-h-[35vh] lg:max-h-[75vh] object-contain rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10 hover:scale-[1.02] transition-transform duration-500 cursor-pointer" 
              />
            )
          )}
        </div>
        
        <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 px-6 hidden lg:flex">
            <button onClick={downloadBusinessCard} disabled={generating || !cardImage} className={`w-full max-w-md py-5 text-black rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(251,191,36,0.3)] bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:brightness-110 disabled:opacity-50 text-base uppercase tracking-wide`}>
              <Download size={22} strokeWidth={3} /> داگرتنی کارتەکەم بە کوالێتی HD
            </button>
        </div>
      </div>

      {/* 🌟 بەشی ڕێکخستنەکان 🌟 */}
      <div className="w-full lg:w-[35%] h-[55vh] lg:h-full bg-neutral-900 border-l border-white/5 flex flex-col relative z-30 shadow-2xl">
         
         <div className="flex p-2 bg-black/40 backdrop-blur-xl border border-white/5 m-5 rounded-2xl shrink-0">
            <button onClick={() => setActiveTab('themes')} className={`flex-1 py-3.5 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'themes' ? 'bg-amber-500 shadow-md text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Palette size={18}/> دیزاینەکان</button>
            <button onClick={() => setActiveTab('text')} className={`flex-1 py-3.5 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-amber-500 shadow-md text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Droplet size={18}/> ڕەنگ و دەق</button>
            <button onClick={() => setActiveTab('position')} className={`flex-1 py-3.5 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'position' ? 'bg-amber-500 shadow-md text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Move size={18}/> فۆنت و شوێن</button>
         </div>

         <div className="flex-1 overflow-y-auto px-6 pb-28 scrollbar-hide">
            <AnimatePresence mode="wait">
               {activeTab === 'themes' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <label className="text-sm font-black text-white/90 block mb-3 flex items-center gap-2"><Star size={16} className="text-amber-400"/> دیزاینێکی پریمیم هەڵبژێرە</label>
                    <div className="grid grid-cols-2 gap-4">
                       {CARD_DESIGNS.map(design => (
                          <button key={design.id} onClick={() => changeTheme(design.id)} className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col gap-3 relative overflow-hidden group ${activeDesign === design.id ? 'border-amber-400 bg-white/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]' : 'border-white/5 bg-black/20 hover:border-white/20'}`}>
                             <div className="absolute -right-4 -top-4 w-12 h-12 rounded-full blur-[15px] opacity-50 group-hover:opacity-100 transition-opacity" style={{background: design.shape}}></div>
                             <div className="flex gap-2 relative z-10"><span className="w-5 h-5 rounded-full shadow-inner border border-white/20" style={{background: design.bg[0]}}></span><span className="w-5 h-5 rounded-full shadow-inner border border-white/20" style={{background: design.shape}}></span></div>
                             <span className={`font-black text-sm relative z-10 ${activeDesign === design.id ? 'text-amber-400' : 'text-white/80'}`}>{design.name}</span>
                          </button>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'text' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="space-y-3 bg-black/30 p-5 rounded-3xl border border-white/5 shadow-inner">
                       <label className="text-sm font-black text-white/90 flex items-center gap-2"><Type size={16} className="text-amber-400"/> دەقی سەر کارتەکە بنووسە</label>
                       <input type="text" dir="auto" placeholder="دەقێک لێرە بنووسە..." value={customText} onChange={(e) => setCustomText(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-amber-400 font-bold text-sm shadow-sm dir-auto text-white placeholder-white/30 transition-all" />
                    </div>

                    <div className="space-y-4">
                       <label className="text-sm font-black text-white/90 flex items-center gap-2"><Droplet size={16} className="text-amber-400"/> گۆڕینی ڕەنگەکان بە ئارەزووی خۆت</label>
                       
                       <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl border border-white/5">
                         <span className="text-xs font-bold text-white/70">ڕەنگی ناو (Name)</span>
                         <div className="flex items-center gap-3">
                           <span className="text-[10px] font-mono text-white/40 uppercase">{nameColor}</span>
                           <input type="color" value={nameColor} onChange={(e) => setNameColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 shadow-inner" />
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl border border-white/5">
                         <span className="text-xs font-bold text-white/70">ڕەنگی بایۆ (Bio)</span>
                         <div className="flex items-center gap-3">
                           <span className="text-[10px] font-mono text-white/40 uppercase">{bioColor}</span>
                           <input type="color" value={bioColor} onChange={(e) => setBioColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 shadow-inner" />
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl border border-white/5">
                         <span className="text-xs font-bold text-white/70">ڕەنگی دەقی خوارەوە</span>
                         <div className="flex items-center gap-3">
                           <span className="text-[10px] font-mono text-white/40 uppercase">{customTextColor}</span>
                           <input type="color" value={customTextColor} onChange={(e) => setCustomTextColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 shadow-inner" />
                         </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'position' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="space-y-4 bg-black/30 p-5 rounded-3xl border border-white/5 shadow-inner">
                       <label className="text-sm font-black text-white/90 flex items-center gap-2"><Type size={16} className="text-amber-400"/> جۆری فۆنت</label>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1 pr-2">
                         {FONTS.map(font => (
                           <button key={font.id} onClick={() => setSelectedFont(font.id)} className={`p-3.5 rounded-xl border text-center transition-all font-black text-sm shadow-sm ${selectedFont === font.id ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:text-white'}`} style={{fontFamily: `"${font.id}", sans-serif`}}>
                             {font.name}
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="space-y-8 bg-black/30 p-6 rounded-3xl border border-white/5 shadow-inner">
                       <label className="text-sm font-black text-white/90 flex items-center gap-2"><Move size={16} className="text-amber-400"/> ڕێکخستنی دەقی خوارەوە</label>
                       
                       <div className="pt-2">
                         <div className="flex justify-between text-xs font-bold text-white/60 mb-3"><span>قەبارەی فۆنت (Size)</span> <span className="text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">{fontSize}px</span></div>
                         <input type="range" min="16" max="60" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                       </div>

                       <div>
                         {/* 🌟 لیمیتەکانم گونجاندووە بۆ ئەوەی هەرگیز نەچێتە دەرەوەی هێڵ 🌟 */}
                         <div className="flex justify-between text-xs font-bold text-white/60 mb-3"><span>لەلای ڕاست و چەپ (X)</span> <span className="text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">{posX}</span></div>
                         <input type="range" min="50" max="950" value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                       </div>
                       
                       <div>
                         <div className="flex justify-between text-xs font-bold text-white/60 mb-3"><span>لەلای سەرەوە و خوارەوە (Y)</span> <span className="text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">{posY}</span></div>
                         <input type="range" min="50" max="550" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         <div className="absolute bottom-0 left-0 w-full p-5 bg-neutral-900/90 backdrop-blur-xl border-t border-white/5 lg:hidden z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <button onClick={downloadBusinessCard} disabled={generating || !cardImage} className={`w-full py-4 text-black rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_20px_rgba(251,191,36,0.2)] bg-gradient-to-r from-amber-400 to-yellow-500 disabled:opacity-50 text-sm uppercase`}>
              <Download size={20} strokeWidth={3} /> داگرتنی کارتەکەم
            </button>
         </div>
      </div>
    </div>
  );
}