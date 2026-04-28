import * as icons from 'lucide-react';
import { Globe, ChevronLeft } from 'lucide-react';

export default function IconPicker({ showPicker, setShowPicker, iconsList, selectedIconInfo, currentIconName, onSelect }: any) {
  return (
    <div className="relative">
      <label className="text-sm font-bold text-neutral-500 mb-2 block pl-2">تۆڕی کۆمەڵایەتی هەڵبژێرە</label>
      <button type="button" onClick={() => setShowPicker(!showPicker)} className="w-full p-4 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between outline-none font-black shadow-sm transition hover:border-neutral-300">
        <div className="flex items-center gap-4">
          <div style={{ color: selectedIconInfo?.color || '#000' }}>
            {(() => { const IconComp = (icons as any)[currentIconName] || Globe; return <IconComp size={28} />; })()}
          </div>
          <span className="text-sm font-bold">{selectedIconInfo?.title || currentIconName}</span>
        </div>
        <ChevronLeft size={24} className="text-neutral-400" />
      </button>
      {showPicker && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-neutral-100 rounded-3xl shadow-2xl z-20 p-5 grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-72 overflow-y-auto">
          {iconsList.map((icon: any) => {
            const IconComp = (icons as any)[icon.name] || Globe;
            return (
              <button key={icon.id || icon.name} type="button" onClick={() => onSelect(icon)} 
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl hover:bg-neutral-50 transition border border-transparent hover:border-neutral-200 shadow-sm hover:shadow-md"
              >
                <div style={{ color: icon.color }}><IconComp size={32} /></div>
                <span className="text-[11px] font-black text-neutral-600 text-center">{icon.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}