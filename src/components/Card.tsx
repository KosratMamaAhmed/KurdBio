import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Loader2, Palette, Type, Move, Droplet, LayoutTemplate } from 'lucide-react';

interface CardProps {
  profile: any;
  onClose: () => void;
}

// 🌟 دیزاینە پریمیمەکانی کارت و مۆکئەپ 🌟
// تێبینی: دیزاینی یەکەم (تاریکی شاهانە) ڕەنگی کالیگرافیەکەی (calligCol) کرا بە ڕەش '#000000'
const CARD_DESIGNS = [
  { id: 0, name: 'تاریکی شاهانە', bg: ['#0f172a', '#020617'], shape: '#fbbf24', shapeShadow: 'rgba(251, 191, 36, 0.4)', text: '#FFFFFF', subText: '#94a3b8', qrFg: '0f172a', calligCol: '#000000' },
  { id: 1, name: 'سپی پلاتینی', bg: ['#ffffff', '#f8fafc'], shape: '#0f172a', shapeShadow: 'rgba(15, 23, 42, 0.3)', text: '#0f172a', subText: '#475569', qrFg: '000000', calligCol: '#0f172a' },
  { id: 2, name: 'ئاڵتوونی و ڕەش', bg: ['#171717', '#000000'], shape: '#d97706', shapeShadow: 'rgba(217, 119, 6, 0.5)', text: '#fef3c7', subText: '#a1a1aa', qrFg: '000000', calligCol: '#fbbf24' },
  { id: 3, name: 'شوشەیی نیۆن', bg: ['#082f49', '#020617'], shape: '#38bdf8', shapeShadow: 'rgba(56, 189, 248, 0.6)', text: '#e0f2fe', subText: '#bae6fd', qrFg: '082f49', calligCol: '#38bdf8' },
  { id: 4, name: 'زەمردی متمانە', bg: ['#064e3b', '#022c22'], shape: '#10b981', shapeShadow: 'rgba(16, 185, 129, 0.4)', text: '#ecfdf5', subText: '#6ee7b7', qrFg: '064e3b', calligCol: '#34d399' },
  { id: 5, name: 'قاوەیی کلاسیک', bg: ['#451a03', '#2e1065'], shape: '#f59e0b', shapeShadow: 'rgba(245, 158, 11, 0.4)', text: '#fef3c7', subText: '#d6d3d1', qrFg: '451a03', calligCol: '#fcd34d' },
  { id: 6, name: 'خوێناوی تاریک', bg: ['#450a0a', '#000000'], shape: '#ef4444', shapeShadow: 'rgba(239, 68, 68, 0.5)', text: '#fef2f2', subText: '#fca5a5', qrFg: '450a0a', calligCol: '#f87171' },
  { id: 7, name: 'سرمەیی مۆدێرن', bg: ['#1e3a8a', '#0f172a'], shape: '#60a5fa', shapeShadow: 'rgba(96, 165, 250, 0.4)', text: '#eff6ff', subText: '#93c5fd', qrFg: '1e3a8a', calligCol: '#93c5fd' },
  { id: 8, name: 'مۆر و ڕۆزگۆڵد', bg: ['#3b0764', '#171717'], shape: '#f472b6', shapeShadow: 'rgba(244, 114, 182, 0.5)', text: '#fdf2f8', subText: '#fbcfe8', qrFg: '3b0764', calligCol: '#f472b6' },
  { id: 9, name: 'مینیماڵی خاوێن', bg: ['#f1f5f9', '#e2e8f0'], shape: '#64748b', shapeShadow: 'rgba(100, 116, 139, 0.3)', text: '#0f172a', subText: '#334155', qrFg: '000000', calligCol: '#1e293b' },
  { id: 10, name: 'سایبەرپەنک', bg: ['#000000', '#111827'], shape: '#ec4899', shapeShadow: 'rgba(236, 72, 153, 0.5)', text: '#fdf2f8', subText: '#fbcfe8', qrFg: '000000', calligCol: '#ec4899' },
  { id: 11, name: 'ئاوی قووڵ', bg: ['#020617', '#082f49'], shape: '#06b6d4', shapeShadow: 'rgba(6, 182, 212, 0.4)', text: '#ecfeff', subText: '#a5f3fc', qrFg: '020617', calligCol: '#22d3ee' },
  { id: 12, name: 'دارستانی تاریک', bg: ['#022c22', '#064e3b'], shape: '#059669', shapeShadow: 'rgba(5, 150, 105, 0.4)', text: '#ecfdf5', subText: '#6ee7b7', qrFg: '022c22', calligCol: '#10b981' },
  { id: 13, name: 'لاڤێندەری ئارام', bg: ['#f3e8ff', '#e9d5ff'], shape: '#a855f7', shapeShadow: 'rgba(168, 85, 247, 0.3)', text: '#3b0764', subText: '#6b21a8', qrFg: '3b0764', calligCol: '#7e22ce' },
  { id: 14, name: 'شەبەنگی شەو', bg: ['#1e1b4b', '#312e81'], shape: '#8b5cf6', shapeShadow: 'rgba(139, 92, 246, 0.4)', text: '#e0e7ff', subText: '#a5b4fc', qrFg: '1e1b4b', calligCol: '#8b5cf6' },
  { id: 15, name: 'خاکیی سادە', bg: ['#fffbeb', '#fef3c7'], shape: '#b45309', shapeShadow: 'rgba(180, 83, 9, 0.2)', text: '#78350f', subText: '#92400e', qrFg: '78350f', calligCol: '#b45309' }
];

// 🌟 لیستی فراوانکراوی فۆنتەکان 🌟
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
  { id: 'Custom2', name: 'فۆنتی تایبەتی ٢' },
  { id: 'Custom3', name: 'فۆنتی تایبەتی ٣' },
  { id: 'Custom4', name: 'فۆنتی تایبەتی ٤' },
  { id: 'Custom5', name: 'فۆنتی تایبەتی ٥' },
  { id: 'Custom6', name: 'فۆنتی تایبەتی ٦' },
  { id: 'Custom7', name: 'فۆنتی تایبەتی ٧' },
  { id: 'Custom8', name: 'فۆنتی تایبەتی ٨' },
  { id: 'Custom9', name: 'فۆنتی تایبەتی ٩' },
  { id: 'Custom10', name: 'فۆنتی تایبەتی ١٠' }
];

export default function Card({ profile, onClose }: CardProps) {
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState<'themes' | 'text' | 'position'>('themes');
  
  const [activeDesign, setActiveDesign] = useState(0);
  
  // 🌟 جێگیرکردنی ڕێکخستنە داواکراوەکان
  const [selectedFont, setSelectedFont] = useState('Noto Sans Arabic'); // فۆنتی بنەڕەتی
  const [customText, setCustomText] = useState('سکانم بکە بۆ بینینی سەرجەم بەستەرەکانم');
  const [fontSize, setFontSize] = useState(28); // قەبارەی 28px
  const [posX, setPosX] = useState(211); // X: 211
  const [posY, setPosY] = useState(569); // Y: 569

  const [nameColor, setNameColor] = useState(CARD_DESIGNS[0].text);
  const [bioColor, setBioColor] = useState(CARD_DESIGNS[0].subText);
  const [customTextColor, setCustomTextColor] = useState(CARD_DESIGNS[0].calligCol); // ئێستا ڕەشە بۆ دیزاینی یەکەم

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
      
      // دیاریکردنی ئاراستەی نووسین، گەر ئینگلیزی بوو با بچێتە چەپ
      const isEnglish = /^[A-Za-z]/.test(debouncedSettings.text);

      roundRect(ctx, 0, 0, 1050, 600, 40);
      ctx.clip();

      const bgGradient = ctx.createLinearGradient(0, 0, 1050, 600);
      bgGradient.addColorStop(0, design.bg[0]); 
      bgGradient.addColorStop(1, design.bg[1]); 
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1050, 600);

      const glow1 = ctx.createRadialGradient(850, 100, 50, 850, 100, 400);
      glow1.addColorStop(0, design.shapeShadow); glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1; ctx.fillRect(0, 0, 1050, 600);

      const glow2 = ctx.createRadialGradient(200, 500, 50, 200, 500, 400);
      glow2.addColorStop(0, design.shapeShadow); glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2; ctx.fillRect(0, 0, 1050, 600);

      ctx.save();
      ctx.translate(525, 300); ctx.rotate(-Math.PI / 8);
      ctx.fillStyle = (activeDesign === 1 || activeDesign === 9 || activeDesign === 13 || activeDesign === 15) ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'; 
      ctx.font = `900 250px ${fontPrimary}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(profile.slug.toUpperCase(), 0, 0);
      ctx.restore();

      ctx.fillStyle = (activeDesign === 1 || activeDesign === 9 || activeDesign === 13 || activeDesign === 15) ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1050, 0); ctx.lineTo(1050, 250); ctx.lineTo(0, 450); ctx.closePath(); ctx.fill();

      ctx.shadowColor = design.shapeShadow; ctx.shadowBlur = 40; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 10;
      ctx.fillStyle = design.shape; 
      ctx.beginPath(); ctx.moveTo(0, 600); ctx.lineTo(0, 400); ctx.bezierCurveTo(200, 450, 400, 550, 600, 600); ctx.closePath(); ctx.fill();
      ctx.shadowColor = 'transparent'; 

      const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
        const img = new window.Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = reject; img.src = src;
      });

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`https://biokurd.com/${profile.slug}`)}&margin=1&color=${design.qrFg}&bgcolor=ffffff`;
      const xQ = 80; const yQ = 80; const wQ = 320; const hQ = 320;

      ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15; ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, xQ - 15, yQ - 15, wQ + 30, hQ + 30, 30); ctx.fill(); ctx.shadowColor = 'transparent';

      try {
        const qrRes = await fetch(qrUrl); const qrBlob = await qrRes.blob();
        const qrObjUrl = URL.createObjectURL(qrBlob); const qrImg = await loadImage(qrObjUrl);
        ctx.save(); roundRect(ctx, xQ, yQ, wQ, hQ, 20); ctx.clip(); ctx.drawImage(qrImg, xQ, yQ, wQ, hQ); ctx.restore();
      } catch (e) { console.error("Failed to load QR code"); }

      ctx.fillStyle = debouncedSettings.nameCol;
      ctx.font = `bold 22px "Tajawal", sans-serif`; ctx.textAlign = 'center';
      ctx.fillText("SCAN TO CONNECT", xQ + (wQ / 2), yQ + hQ + 45);

      const textCenterX = 750; const avatarY = 160; const avatarRadius = 85;

      ctx.shadowColor = design.shapeShadow; ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.arc(textCenterX, avatarY, avatarRadius + 6, 0, Math.PI * 2); ctx.fillStyle = design.shape; ctx.fill(); ctx.shadowColor = 'transparent';

      ctx.beginPath(); ctx.arc(textCenterX, avatarY, avatarRadius + 2, 0, Math.PI * 2);
      ctx.fillStyle = (activeDesign === 1 || activeDesign === 9 || activeDesign === 13 || activeDesign === 15) ? '#ffffff' : '#000000'; ctx.fill();

      if (profile.avatarUrl) {
        try {
          const avatarImg = await loadImage(profile.avatarUrl);
          ctx.save(); ctx.beginPath(); ctx.arc(textCenterX, avatarY, avatarRadius, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
          ctx.drawImage(avatarImg, textCenterX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2); ctx.restore();
        } catch (e) { drawAvatarFallback(ctx, textCenterX, avatarY, avatarRadius, profile.displayName, fontPrimary, design.text); }
      } else { drawAvatarFallback(ctx, textCenterX, avatarY, avatarRadius, profile.displayName, fontPrimary, design.text); }

      const nameY = 290; ctx.textBaseline = 'top'; ctx.textAlign = 'center';
      ctx.fillStyle = debouncedSettings.nameCol;
      ctx.shadowColor = design.shapeShadow; ctx.shadowBlur = 15; ctx.shadowOffsetY = 2;
      ctx.font = `900 60px ${fontPrimary}`; ctx.fillText(profile.displayName || 'کۆسرەت', textCenterX, nameY);
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      ctx.fillStyle = debouncedSettings.bioCol; 
      ctx.font = `400 28px ${fontPrimary}`;
      const bioText = profile.bio || 'باشترین بەستەرەکانم لێرە ببینە';
      wrapText(ctx, bioText, textCenterX, 380, 42, 480);

      // 🌟 جێبەجێکردنی ئاراستەی نووسین (ئینگلیزی بۆ چەپ) و فۆنتەکان
      const customRenderText = debouncedSettings.text.trim();
      if (customRenderText !== '') {
          ctx.fillStyle = debouncedSettings.customCol;
          ctx.font = `700 ${debouncedSettings.size}px ${fontPrimary}`; 
          ctx.textBaseline = 'middle'; 
          
          // ئەگەر ئینگلیزی بوو با بچێتە چەپ
          if (isEnglish) {
            ctx.direction = 'ltr';
            ctx.textAlign = 'left';
          } else {
            ctx.direction = 'rtl';
            ctx.textAlign = 'center'; // بۆ کوردی وەکو خۆی دەمێنێتەوە
          }
          
          ctx.fillText(customRenderText, debouncedSettings.x, debouncedSettings.y);
      }

      ctx.fillStyle = design.shape; ctx.font = `900 24px sans-serif`;
      ctx.direction = 'ltr'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      ctx.fillText("BioKurd.com", 1010, 570);

      setCardImage(canvas.toDataURL('image/png', 1.0));
      
    } catch (err) { console.error("هەڵە لە دروستکردنی کارت:", err); } 
    finally { setGenerating(false); }
  };

  const drawAvatarFallback = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, name: string, font: string, textColor: string) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = (activeDesign === 1 || activeDesign === 9 || activeDesign === 13 || activeDesign === 15) ? '#f3f4f6' : '#1e293b'; ctx.fill();
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
    <div className="fixed inset-0 bg-neutral-50 z-50 flex flex-col lg:flex-row overflow-hidden font-sans" dir="rtl">
      
      <div className="w-full lg:w-[60%] h-[45vh] lg:h-full bg-gradient-to-br from-neutral-900 to-black relative flex flex-col items-center justify-center p-4 sm:p-8 border-b lg:border-b-0 lg:border-l border-neutral-800">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-20">
           <div className="p-2.5 sm:p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl shadow-lg flex items-center justify-center">
             <LayoutTemplate size={24}/>
           </div>
           <div>
             <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">ستۆدیۆی دیزاین</h2>
             <p className="text-[10px] sm:text-xs font-bold text-white/50">BioKurd Studio</p>
           </div>
        </div>

        <button onClick={onClose} className="absolute top-4 left-4 sm:top-6 sm:left-6 p-3 bg-white/10 hover:bg-red-500/80 text-white rounded-full transition-colors active:scale-90 z-20">
          <X size={20} strokeWidth={3}/>
        </button>

        <div className="w-full max-w-2xl relative flex items-center justify-center mt-12 sm:mt-0">
          {generating ? (
            <div className="flex flex-col items-center text-amber-500 gap-4 py-12">
               <Loader2 className="animate-spin" size={48} strokeWidth={3} />
               <span className="font-black text-sm sm:text-base animate-pulse text-white">لە دروستکردنی دیزاینەکەداین...</span>
            </div>
          ) : (
            cardImage && (
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                src={cardImage} alt="Preview" 
                className="w-full max-h-[30vh] lg:max-h-[70vh] object-contain rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-white/10" 
              />
            )
          )}
        </div>
        
        <div className="absolute bottom-4 left-0 w-full flex justify-center z-20 px-4 hidden lg:flex">
            <button onClick={downloadBusinessCard} disabled={generating || !cardImage} className={`w-full max-w-sm py-4 text-neutral-900 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:opacity-60 text-sm sm:text-base`}>
              <Download size={20} strokeWidth={3} /> داگرتنی کارتەکەم (PNG)
            </button>
        </div>
      </div>

      <div className="w-full lg:w-[40%] h-[55vh] lg:h-full bg-white flex flex-col relative z-30 shadow-2xl lg:shadow-none">
         
         <div className="flex p-2 bg-neutral-100 m-4 rounded-2xl shrink-0">
            <button onClick={() => setActiveTab('themes')} className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'themes' ? 'bg-white shadow-sm text-orange-600' : 'text-neutral-500 hover:text-neutral-700'}`}><Palette size={16}/> ڕووکارەکان</button>
            <button onClick={() => setActiveTab('text')} className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-white shadow-sm text-orange-600' : 'text-neutral-500 hover:text-neutral-700'}`}><Droplet size={16}/> ڕەنگ و دەق</button>
            <button onClick={() => setActiveTab('position')} className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'position' ? 'bg-white shadow-sm text-orange-600' : 'text-neutral-500 hover:text-neutral-700'}`}><Move size={16}/> فۆنت و شوێن</button>
         </div>

         <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
            <AnimatePresence mode="wait">
               {activeTab === 'themes' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <label className="text-sm font-black text-neutral-800 block mb-2">دیزاینێکی پڕۆفیشناڵ هەڵبژێرە</label>
                    <div className="block sm:hidden">
                       <select value={activeDesign} onChange={(e) => changeTheme(Number(e.target.value))} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-black text-sm outline-none focus:border-orange-500 appearance-none">
                         {CARD_DESIGNS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                       </select>
                    </div>
                    <div className="hidden sm:grid grid-cols-2 gap-3">
                       {CARD_DESIGNS.map(design => (
                          <button key={design.id} onClick={() => changeTheme(design.id)} className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col gap-2 ${activeDesign === design.id ? 'border-orange-500 bg-orange-50/50 shadow-md' : 'border-neutral-100 bg-white hover:border-orange-200'}`}>
                             <div className="flex gap-1.5"><span className="w-4 h-4 rounded-full border border-black/10" style={{background: design.bg[0]}}></span><span className="w-4 h-4 rounded-full border border-black/10" style={{background: design.shape}}></span></div>
                             <span className="font-black text-sm text-neutral-800">{design.name}</span>
                          </button>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'text' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="space-y-3 bg-neutral-50 p-5 rounded-3xl border border-neutral-100">
                       <label className="text-sm font-black text-neutral-800 flex items-center gap-2"><Type size={16} className="text-orange-500"/> دەقی سەر کارتەکە</label>
                       {/* 🌟 لێرەدا dir-auto کار دەکات بۆ ئەوەی ئینگلیزی بچێتە چەپ */}
                       <input type="text" dir="auto" placeholder="دەقێک لێرە بنووسە..." value={customText} onChange={(e) => setCustomText(e.target.value)} className="w-full p-4 bg-white border border-neutral-200 rounded-2xl outline-none focus:border-orange-500 font-bold text-sm shadow-sm dir-auto" />
                    </div>

                    <div className="space-y-4">
                       <label className="text-sm font-black text-neutral-800 flex items-center gap-2"><Droplet size={16} className="text-orange-500"/> گۆڕینی ڕەنگەکان</label>
                       <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                         <span className="text-xs font-bold text-neutral-600">ڕەنگی ناو (Name)</span>
                         <input type="color" value={nameColor} onChange={(e) => setNameColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" />
                       </div>
                       <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                         <span className="text-xs font-bold text-neutral-600">ڕەنگی بایۆ (Bio)</span>
                         <input type="color" value={bioColor} onChange={(e) => setBioColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" />
                       </div>
                       <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                         <span className="text-xs font-bold text-neutral-600">ڕەنگی دەقی خوارەوە</span>
                         <input type="color" value={customTextColor} onChange={(e) => setCustomTextColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" />
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'position' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="space-y-4 bg-neutral-50 p-5 rounded-3xl border border-neutral-100">
                       <label className="text-sm font-black text-neutral-800 flex items-center gap-2"><Type size={16} className="text-orange-500"/> جۆری فۆنت</label>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
                         {FONTS.map(font => (
                           <button key={font.id} onClick={() => setSelectedFont(font.id)} className={`p-3 rounded-xl border text-center transition-all font-black text-sm ${selectedFont === font.id ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'}`} style={{fontFamily: `"${font.id}", sans-serif`}}>
                             {font.name}
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="space-y-6 bg-neutral-50 p-5 rounded-3xl border border-neutral-100">
                       <label className="text-sm font-black text-neutral-800 flex items-center gap-2"><Move size={16} className="text-orange-500"/> ڕێکخستنی دەقی خوارەوە</label>
                       
                       {/* 🌟 سلایدەری قەبارەی فۆنت */}
                       <div>
                         <div className="flex justify-between text-xs font-bold text-neutral-500 mb-2"><span>قەبارەی فۆنت (Size)</span> <span className="text-neutral-400">{fontSize}px</span></div>
                         <input type="range" min="16" max="60" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-orange-500" />
                       </div>

                       <div>
                         <div className="flex justify-between text-xs font-bold text-neutral-500 mb-2"><span>لەلای ڕاست و چەپ (X)</span> <span className="text-neutral-400">{posX}</span></div>
                         <input type="range" min="50" max="1000" value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full accent-orange-500" />
                       </div>
                       <div>
                         <div className="flex justify-between text-xs font-bold text-neutral-500 mb-2"><span>لەلای سەرەوە و خوارەوە (Y)</span> <span className="text-neutral-400">{posY}</span></div>
                         <input type="range" min="30" max="580" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-orange-500" />
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-neutral-100 lg:hidden z-40">
            <button onClick={downloadBusinessCard} disabled={generating || !cardImage} className={`w-full py-4 text-neutral-900 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg bg-gradient-to-r from-amber-400 to-yellow-500 disabled:opacity-60 text-sm`}>
              <Download size={20} strokeWidth={3} /> داگرتنی کارتەکە
            </button>
         </div>
      </div>
    </div>
  );
}