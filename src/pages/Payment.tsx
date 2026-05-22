import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Crown, Copy, Check, Star } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'fastpay', name: 'FastPay', number: '07503221456', logo: '/payment/fastpay.png', color: 'from-[#00a859] to-[#008f4c]', shadow: 'shadow-[#00a859]/20' },
  { id: 'fib', name: 'FIB', number: '7503420910', logo: '/payment/fib.png', color: 'from-[#ED1C24] to-[#C41219]', shadow: 'shadow-[#ED1C24]/20' },
  { id: 'korek', name: 'Korek Telecom', number: '07503221456', logo: '/payment/korek.png', color: 'from-[#F26522] to-[#d95316]', shadow: 'shadow-[#F26522]/20' },
  { id: 'asiacell', name: 'Asiacell', number: '07706448043', logo: '/payment/asia.png', color: 'from-[#E3000F] to-[#b3000c]', shadow: 'shadow-[#E3000F]/20' },
  { id: 'qicard', name: 'QiCard', number: '4156019301', logo: '/payment/qicard.png', color: 'from-[#00529b] to-[#003d73]', shadow: 'shadow-[#00529b]/20' },
];

export default function Payment({ theme }: { theme: any }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#fdfdfc] flex flex-col font-sans" dir="rtl">
      <header className="bg-white border-b border-neutral-100 py-6 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className={`text-2xl font-black flex items-center gap-3 ${theme?.text || 'text-orange-500'}`}>
            <div className="p-2 bg-amber-100 rounded-xl"><Crown className="text-amber-600" size={24} /></div> 
            بەرزکردنەوە بۆ VIP
          </h1>
          <Link to="/dashboard" className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-bold text-neutral-600 transition flex items-center gap-2">
            گەڕانەوە <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6 leading-tight">پەیوەندی بکە بە جیهانی <span className="text-amber-500 underline decoration-amber-200 decoration-8 underline-offset-4">VIP</span></h2>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-medium leading-relaxed">تەنها بە ٢٠٠٠ دینار بۆ ساڵێک، سەرجەم تایبەتمەندییە شاراوەکان و بێسنوورەکانی BioKurd بەکاربهێنە.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20 items-center">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-neutral-200 relative overflow-hidden group hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-black mb-8 text-neutral-400">هەژماری خۆڕایی</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-neutral-700 font-bold text-lg"><CheckCircle2 className="text-neutral-400" /> دانانی تەنها یەک لینک</li>
              <li className="flex items-center gap-4 text-neutral-400 font-bold text-lg opacity-50"><CheckCircle2 /> نەبوونی وێنەی پرۆفایل</li>
              <li className="flex items-center gap-4 text-neutral-400 font-bold text-lg opacity-50"><CheckCircle2 /> نەبوونی وێنەی باکگراوند</li>
              <li className="flex items-center gap-4 text-neutral-400 font-bold text-lg opacity-50"><CheckCircle2 /> نەبوونی دەستکاری ڕەنگەکان</li>
            </ul>
            <div className="mt-10 pt-8 border-t border-neutral-100 text-3xl font-black text-neutral-300">٠ دینار <span className="text-lg font-medium text-neutral-400">/ هەمیشە</span></div>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-[4px] border-amber-400 text-white relative overflow-hidden transform lg:scale-105 z-10">
            <div className="absolute -right-10 -top-10 text-amber-500 opacity-20 animate-pulse"><Crown size={180} /></div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-black mb-6">باشترین هەڵبژاردە <Star size={14} className="fill-amber-400" /></div>
            <h3 className="text-3xl font-black mb-8 text-white relative z-10">هەژماری VIP</h3>
            <ul className="space-y-5 relative z-10">
              <li className="flex items-center gap-4 font-bold text-lg text-amber-50"><CheckCircle2 className="text-amber-400 shrink-0" /> دانانی لینکی بێسنوور</li>
              <li className="flex items-center gap-4 font-bold text-lg text-amber-50"><CheckCircle2 className="text-amber-400 shrink-0" /> دانانی وێنەی پرۆفایل</li>
              <li className="flex items-center gap-4 font-bold text-lg text-amber-50"><CheckCircle2 className="text-amber-400 shrink-0" /> گۆڕینی وێنەی پشتەوە (باکگراوند)</li>
              <li className="flex items-center gap-4 font-bold text-lg text-amber-50"><CheckCircle2 className="text-amber-400 shrink-0" /> گۆڕینی ڕەنگی دوگمەکان و دیزاین</li>
            </ul>
            <div className="mt-10 pt-8 border-t border-white/10 text-5xl font-black text-amber-400 relative z-10">٢٠٠٠ <span className="text-xl font-bold text-white/80">دینار / ساڵانە</span></div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="mx-auto bg-emerald-100 text-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner border-[4px] border-white">
              <ShieldCheck size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black mb-4">شێوازی پارەدان</h3>
            <p className="text-neutral-500 mb-12 max-w-xl mx-auto font-medium text-lg leading-relaxed">
              تکایە بڕی ٢٠٠٠ دینار بنێرە بۆ یەکێک لەم هەژمارانەی خوارەوە.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12 text-right">
              {PAYMENT_METHODS.map((method) => (
                <div key={method.id} className="bg-white p-5 rounded-3xl border-2 border-neutral-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-sm border border-neutral-100 flex items-center justify-center shrink-0">
                      <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="font-black text-lg text-neutral-800">{method.name}</div>
                  </div>
                  <div className="bg-neutral-50 rounded-2xl p-2 flex items-center justify-between border border-neutral-100">
                    <div className="text-xl font-black text-neutral-700 tracking-wider pl-4 font-mono" dir="ltr">{method.number}</div>
                    <button onClick={() => handleCopy(method.number, method.id)} className={`p-3 rounded-xl transition-all ${copiedId === method.id ? 'bg-emerald-500 text-white' : 'bg-white text-neutral-500 hover:text-neutral-900 border border-neutral-200'}`}>
                      {copiedId === method.id ? <Check size={20} strokeWidth={3} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 max-w-2xl mx-auto flex flex-col items-center gap-6">
               <a href="https://t.me/KosratMama" target="_blank" rel="noopener noreferrer" className={`inline-flex px-12 py-5 text-white font-black text-xl rounded-2xl shadow-xl hover:scale-105 transition items-center gap-3 ${theme?.main || 'bg-orange-500'}`}>
                 ناردنی پسوڵە بۆ ئەدمین
               </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}