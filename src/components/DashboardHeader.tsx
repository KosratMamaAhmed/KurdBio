import { ExternalLink, LogOut } from 'lucide-react';

interface Props {
  profile: any;
  theme: any;
  onLogout: () => void;
}

export default function DashboardHeader({ profile, theme, onLogout }: Props) {
  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className={`font-black text-2xl tracking-tight ${theme?.text || 'text-orange-500'}`}>
          BioKurd
        </div>
        <div className="flex items-center gap-4">
          <a 
            href={`/${profile?.slug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-sm font-bold ${theme?.text || 'text-orange-500'} ${theme?.light || 'bg-orange-50'} px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm border border-neutral-200/50`}
          >
            بینین <ExternalLink size={16} />
          </a>
          <button 
            onClick={onLogout} 
            className="p-2.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}