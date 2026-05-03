import { useState } from 'react';
import { GripVertical, Edit3, Trash2 } from 'lucide-react';
import * as icons from 'lucide-react';

export default function DraggableLinkList({ links, setLinks, onEdit, onDelete }: any) {
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const handleDragStart = (e: React.DragEvent, link: any) => {
    setDraggedItem(link);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, targetLink: any) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetLink.id) return;

    const draggedIdx = links.findIndex((l: any) => l.id === draggedItem.id);
    const targetIdx = links.findIndex((l: any) => l.id === targetLink.id);

    const newLinks = [...links];
    newLinks.splice(draggedIdx, 1); 
    newLinks.splice(targetIdx, 0, draggedItem); 

    setLinks(newLinks); 
    setDraggedItem(null);
  };

  return (
    <div className="space-y-3">
      {links.map((link: any) => {
        const IconName = link.iconName || link.icon || 'Globe';
        const Icon = (icons as any)[IconName] || icons.Globe;

        return (
          <div
            key={link.id}
            draggable
            onDragStart={(e) => handleDragStart(e, link)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, link)}
            className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl hover:border-orange-300 shadow-sm cursor-grab active:cursor-grabbing active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="text-neutral-300 group-hover:text-orange-400 transition-colors">
                 <GripVertical size={22} />
              </div>
              
              <div className="w-11 h-11 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
                {link.imageUrl || link.icon?.startsWith('/') ? (
                   <img src={link.imageUrl || link.icon} className="w-full h-full object-contain p-1.5" alt="icon" />
                ) : (
                   <Icon size={22} color={link.color || '#333333'} />
                )}
              </div>
              
              <div className="pl-2">
                <h4 className="font-black text-sm text-neutral-800 line-clamp-1">{link.title || link.name}</h4>
                <p className="text-xs font-bold text-neutral-400 max-w-[140px] sm:max-w-[200px] truncate mt-0.5" dir="ltr">{link.url}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onEdit(link)} className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-colors" title="دەستکاریکردن">
                <Edit3 size={18} strokeWidth={2.5} />
              </button>
              <button onClick={() => onDelete(link.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors" title="سڕینەوە">
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}