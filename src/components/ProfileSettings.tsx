import { useState } from 'react';
import { Camera, User, FileText, Image as ImageIcon, Move } from 'lucide-react';

// 🌟 کۆمپۆنێنتی زیرەک بۆ ڕاکێشانی وێنە (Drag & Drop Position) 🌟
function DraggableImage({ src, pos, onPosChange, className, alt }: any) {
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState(pos || { x: 50, y: 50 });

  const handleStart = (clientX: number, clientY: number) => {
    setDragging(true);
    setStart({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return;
    const dx = clientX - start.x;
    const dy = clientY - start.y;
    
    // خێرایی ڕاکێشانەکە (0.2 گونجاوترینە بۆ ئەوەی زۆر خێرا نەبێت)
    let newX = currentPos.x - (dx * 0.2); 
    let newY = currentPos.y - (dy * 0.2);
    
    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));
    
    setCurrentPos({ x: newX, y: newY });
    setStart({ x: clientX, y: clientY });
  };

  const handleEnd = () => {
    if (dragging) {
      setDragging(false);
      onPosChange(currentPos); // پاشەکەوتکردن دوای بەرەڵاکردنی پەنجە
    }
  };

  return (
    <div 
      className={`overflow-hidden relative cursor-move group ${className}`}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      style={{ touchAction: 'none' }} // ڕێگری لە سکڕۆڵ لەکاتی ڕاکێشانی وێنە
    >
       <img 
         src={src} 
         className="w-full h-full object-cover pointer-events-none transition-transform group-hover:scale-[1.02] duration-500" 
         style={{ objectPosition: `${currentPos.x}% ${currentPos.y}%` }} 
         alt={alt}
       />
       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-lg">
             <Move size={14} /> ڕایبکێشە بۆ ڕێکخستن
          </div>
       </div>
    </div>
  );
}

export default function ProfileSettings({ profile, setProfile, theme, saving, handleUpdateProfile }: any) {
  
  // گۆڕینی کەڤەر و هێشتنەوەی کوالێتی بەرز
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; const MAX_HEIGHT = 1200; // قەبارە گەورەتر بۆ ئەوەی بە جوانی ڕابکێشرێت
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
        const base64String = canvas.toDataURL('image/jpeg', 0.85);
        
        const defaultPos = { x: 50, y: 50 }; // ناوەڕاست
        handleUpdateProfile({ bgImage: base64String, bgPos: defaultPos });
        setProfile({ ...profile, bgImage: base64String, bgPos: defaultPos });
      };
    };
  };

  // گۆڕینی پرۆفایل و هێشتنەوەی کوالێتی بەرز
  const handleAvatarUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]; if (!file) return;
     const reader = new FileReader(); reader.readAsDataURL(file);
     reader.onload = (event) => {
        const img = new window.Image(); img.src = event.target?.result as string;
        img.onload = () => {
           const canvas = document.createElement('canvas');
           const MAX_WIDTH = 800; const MAX_HEIGHT = 800;
           let width = img.width; let height = img.height;
           if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
           canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
           const base64String = canvas.toDataURL('image/jpeg', 0.85);
           
           const defaultPos = { x: 50, y: 50 };
           handleUpdateProfile({ avatarUrl: base64String, avatarPos: defaultPos });
           setProfile({ ...profile, avatarUrl: base64String, avatarPos: defaultPos });
        }
     }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-neutral-200">
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 mb-6">
        <User className="text-orange-500" size={24} />
        <h2 className="text-xl font-black text-neutral-900">زانیارییە کەسییەکان</h2>
      </div>

      <div className="space-y-6">
        <div className="relative mb-16 sm:mb-20">
           
           {/* وێنەی کەڤەر بە سیستەمی ڕاکێشانەوە */}
           <div className="w-full h-40 sm:h-56 bg-neutral-100 rounded-3xl overflow-hidden relative shadow-inner">
             {profile?.bgImage ? (
                <DraggableImage 
                  src={profile.bgImage} 
                  pos={profile.bgPos} 
                  onPosChange={(newPos: any) => {
                    setProfile({ ...profile, bgPos: newPos });
                    handleUpdateProfile({ bgPos: newPos });
                  }} 
                  className="w-full h-full"
                  alt="Cover"
                />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                  <ImageIcon size={36}/>
                  <span className="font-bold text-sm">وێنەی کەڤەر دابنێ</span>
                </div>
             )}
             
             {/* دوگمەی گۆڕینی کەڤەر */}
             <div className="absolute top-4 right-4 z-20" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
               <label className="bg-black/60 backdrop-blur-md px-4 py-2 sm:py-2.5 rounded-xl text-white cursor-pointer font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-black transition-colors shadow-lg border border-white/20">
                  <Camera size={18}/> گۆڕینی کەڤەر
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
               </label>
             </div>
           </div>
           
           {/* وێنەی پرۆفایل بە سیستەمی ڕاکێشانەوە */}
           <div className="absolute -bottom-12 sm:-bottom-14 right-6 sm:right-8 flex items-end gap-4 z-30" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
              <div className="relative group w-28 h-28 sm:w-36 sm:h-36 rounded-full border-[6px] border-white bg-neutral-100 shadow-xl overflow-hidden shrink-0">
                {profile?.avatarUrl ? (
                  <DraggableImage 
                    src={profile.avatarUrl} 
                    pos={profile.avatarPos} 
                    onPosChange={(newPos: any) => {
                      setProfile({ ...profile, avatarPos: newPos });
                      handleUpdateProfile({ avatarPos: newPos });
                    }} 
                    className="w-full h-full"
                    alt="Avatar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400"><User size={40}/></div>
                )}
                
                {/* دوگمەی گۆڕینی پرۆفایل لەناو خودی پرۆفایلەکە */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <label className="text-white cursor-pointer pointer-events-auto p-3 bg-white/20 rounded-full backdrop-blur-md hover:bg-white/40 transition">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUploadLocal} />
                    <Camera size={26} />
                  </label>
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
          <div>
            <label className="text-sm font-bold text-neutral-600 block mb-2">ناوی تەواو</label>
            <input type="text" value={profile?.displayName || ''} onChange={e => setProfile({...profile, displayName: e.target.value})} onBlur={() => handleUpdateProfile({ displayName: profile.displayName })} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-orange-500 font-bold" />
          </div>
          <div>
            <label className="text-sm font-bold text-neutral-600 block mb-2 flex items-center gap-2"><FileText size={16}/> کورتەیەک دەربارەی خۆت</label>
            <textarea value={profile?.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} onBlur={() => handleUpdateProfile({ bio: profile.bio })} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-orange-500 font-bold h-14 resize-none overflow-hidden" placeholder="کورتەیەک بنووسە..." />
          </div>
        </div>
      </div>
    </div>
  );
}