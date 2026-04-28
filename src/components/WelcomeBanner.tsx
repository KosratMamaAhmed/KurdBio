import { ExternalLink, QrCode, Star } from 'lucide-react';

interface Props {
  profile: any;
  theme: any;
  isPro: boolean;
  copyProfileLink: () => void;
  setShowQrModal: (show: boolean) => void;
}

export default function WelcomeBanner({ profile, theme, isPro, copyProfileLink, setShowQrModal }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className={`${theme?.main || 'bg-orange-500'} text-white rounded-[2rem] p-6 sm:p-8 shadow-xl ${theme?.shadow || 'shadow-orange-200'} flex flex-col items-center justify-between gap-6 bg-gradient-to-br ${theme?.grad || 'from-orange-500 to-amber-500'}`}>
        <div className="w-full text-center sm:text-right">
          <h2 className="text-2xl font-black mb-2 flex items-center justify-center sm:justify-start gap-3">
            بەخێربێیت، {profile?.displayName} 
            {isPro && <Star className="text-amber-400 fill-amber-400 drop-shadow-md" size={24} />}
          </h2>
          <p className="text-white/80 font-medium mb-6">لینکەکەت کۆپی بکە یان کارتی بازرگانی دابگرە</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button 
              onClick={() => setShowQrModal(true)} 
              className="flex-1 px-6 py-4 bg-black/20 hover:bg-black/30 text-white rounded-2xl font-black transition active:scale-95 shadow-inner border border-white/20 flex items-center justify-center gap-2"
            >
              <QrCode size={20} /> کارتی بازرگانی و QR
            </button>
            <button 
              onClick={copyProfileLink} 
              className="flex-1 px-6 py-4 bg-white text-neutral-900 rounded-2xl font-black hover:bg-neutral-50 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} /> کۆپیکردنی لینک
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}