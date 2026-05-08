import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, CalendarDays, KeyRound, User, Mail, Phone, Lock } from 'lucide-react';

interface Props { onLogin: (user: any) => void; theme: any; }

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = ['کانونی ٢', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمموز', 'ئاب', 'ئەیلول', 'تشرینی ١', 'تشرینی ٢', 'کانونی ١'];
const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

export default function Auth({ onLogin, theme }: Props) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({ 
    identifier: '', username: '', email: '', phone: '', displayName: '', 
    password: '', confirmPassword: '', 
    dobDay: '', dobMonth: '', dobYear: '' 
  });

  const isStrongPassword = (pass: string) => pass.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccessMsg('');

    if (mode === 'register') {
      if (!isStrongPassword(formData.password)) return setError('تێپەڕەوشە دەبێت لانی کەم ٨ پیت یان ژمارە بێت.');
      if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) return setError('تکایە ڕۆژی لەدایکبوون بەتەواوی هەڵبژێرە.');
    }

    if (mode === 'forgot') {
      if (formData.password !== formData.confirmPassword) return setError('تێپەڕەوشە نوێیەکان وەک یەک نین!');
      if (!isStrongPassword(formData.password)) return setError('تێپەڕەوشەی نوێ دەبێت لانی کەم ٨ پیت یان ژمارە بێت.');
      if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) return setError('تکایە ڕۆژی لەدایکبوون بنووسە.');
    }

    setLoading(true);
    
    const endpoint = mode === 'login' ? '/api/auth/login' : mode === 'register' ? '/api/auth/register' : '/api/public/reset-password';
    
    const dob = `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`;
    const body = mode === 'login' 
      ? { identifier: formData.identifier, password: formData.password } 
      : mode === 'forgot'
      ? { identifier: formData.identifier, dob, newPassword: formData.password }
      : { 
          name: formData.displayName, 
          username: formData.username, 
          email: formData.email, 
          phone: formData.phone, 
          password: formData.password,
          dob 
        };
    
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'هەڵەیەک ڕوویدا');
      
      if (mode === 'login' || mode === 'register') { 
        localStorage.setItem('biokurd_token', data.token);
        onLogin(data); 
      } else {
        setSuccessMsg('تێپەڕەوشەکەت بە سەرکەوتوویی گۆڕدرا! ئێستا بچۆ ژوورەوە.');
        setMode('login');
        setFormData({ ...formData, password: '', confirmPassword: '' });
      }
    } catch (err: any) { 
      if (err.message.includes('ڕوویدا') || err.message.includes('Not Found')) {
         const oldEndpoint = mode === 'login' ? '/api/login' : mode === 'register' ? '/api/register' : '/api/public/reset-password';
         try {
            const res2 = await fetch(oldEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data2 = await res2.json();
            if (!res2.ok) throw new Error(data2.error || 'هەڵەیەک ڕوویدا');
            
            if (mode === 'login' || mode === 'register') { 
               localStorage.setItem('biokurd_token', data2.token);
               onLogin(data2); 
            } else {
               setSuccessMsg('تێپەڕەوشەکەت بە سەرکەوتوویی گۆڕدرا! ئێستا بچۆ ژوورەوە.');
               setMode('login');
               setFormData({ ...formData, password: '', confirmPassword: '' });
            }
         } catch(err2: any) {
             setError(err2.message);
         }
      } else {
         setError(err.message); 
      }
    } finally { 
      setLoading(false); 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    // 🌟 بۆشایی پارێزراو درا بە تەواوی پەڕەکە 🌟
    <div className="min-h-[100dvh] bg-neutral-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-y-auto scrollbar-hide" dir="rtl" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className={`absolute -top-[20%] -right-[10%] w-[70%] h-[60%] ${theme?.main || 'bg-orange-500'} rounded-full blur-[120px] opacity-20 animate-pulse`}></div>
         <div className={`absolute top-[40%] -left-[10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px] opacity-10`}></div>
      </div>

      {/* 🌟 دوگمەی گەڕانەوە پارێزرا لە چوونە ژێر کامێرا 🌟 */}
      <Link to="/" className="absolute left-6 z-20 bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl font-black text-neutral-600 hover:text-neutral-900 border border-neutral-200 shadow-sm transition-all active:scale-95" style={{ top: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
        گەڕانەوە
      </Link>

      <div className="w-full max-w-[460px] relative z-10 perspective-1000 my-auto py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={cardVariants}
            initial="hidden" animate="visible" exit="exit"
            className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white"
          >
            <div className="text-center mb-8">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white shadow-lg ${theme?.main || 'bg-orange-500'} bg-gradient-to-br ${theme?.grad || 'from-orange-400 to-orange-600'}`}>
                {mode === 'login' ? <KeyRound size={32} /> : mode === 'register' ? <User size={32} /> : <Lock size={32} />}
              </div>
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                {mode === 'login' ? 'چوونەژوورەوە' : mode === 'register' ? 'دروستکردنی هەژمار' : 'گۆڕینی تێپەڕەوشە'}
              </h2>
              <p className="text-neutral-500 font-bold text-sm mt-2">
                {mode === 'login' ? 'زانیارییەکانت بنووسە بۆ چوونە ناو داشبۆرد' : mode === 'register' ? 'بەخۆڕایی و خێرا پرۆفایلی خۆت دروست بکە' : 'ناوی خۆت و ڕۆژی لەدایکبوونت بنووسە'}
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border border-red-100">
                <AlertCircle size={20} className="shrink-0" /> <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}
            
            {successMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border border-emerald-100">
                <CheckCircle size={20} className="shrink-0" /> <span className="leading-relaxed">{successMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'login' && (
                <>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><User size={20} /></div>
                    <input type="text" placeholder="یوزەرنەیم، ئیمێڵ، یان ژمارە مۆبایل" required value={formData.identifier} onChange={e => setFormData({...formData, identifier: e.target.value})} className="w-full pl-4 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 focus:shadow-sm outline-none font-bold text-sm transition-all" dir="ltr" />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Lock size={20} /></div>
                    <input type={showPassword ? "text" : "password"} placeholder="تێپەڕەوشە (Password)" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 focus:shadow-sm outline-none font-bold text-sm transition-all" dir="ltr" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-4 flex items-center text-neutral-400 hover:text-neutral-700 transition">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="text-right">
                    <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }} className={`text-xs font-black ${theme?.text || 'text-orange-500'} hover:underline`}>
                      تێپەڕەوشەت لەبیرچووە؟
                    </button>
                  </div>
                </>
              )}

              {mode === 'register' && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1 pb-2 scrollbar-hide">
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><User size={20} /></div>
                    <input type="text" placeholder="ناوی تەواو" required value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="w-full pl-4 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 focus:shadow-sm outline-none font-bold text-sm transition-all" />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><User size={20} /></div>
                    <input type="text" placeholder="ناوی بەکارهێنەر (بۆ نمونە: kosrat99)" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')})} className="w-full pl-4 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 focus:shadow-sm outline-none font-bold text-sm transition-all" dir="ltr" />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Mail size={20} /></div>
                    <input type="email" placeholder="ئیمێڵی ڕاستەقینە" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-4 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 focus:shadow-sm outline-none font-bold text-sm transition-all" dir="ltr" />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Phone size={20} /></div>
                    <input type="tel" placeholder="ژمارە مۆبایل" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-4 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 focus:shadow-sm outline-none font-bold text-sm transition-all" dir="ltr" />
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                    <label className="text-xs font-black text-blue-800 mb-2 flex items-center gap-2"><CalendarDays size={16}/> ڕۆژی لەدایکبوون (بۆ گەڕاندنەوەی پاسوۆرد گرنگە!)</label>
                    <div className="flex gap-2" dir="ltr">
                      <select required value={formData.dobDay} onChange={e => setFormData({...formData, dobDay: e.target.value})} className="flex-1 p-3 bg-white border border-blue-200 rounded-xl outline-none font-bold text-sm text-center">
                        <option value="">ڕۆژ</option>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select required value={formData.dobMonth} onChange={e => setFormData({...formData, dobMonth: e.target.value})} className="flex-1 p-3 bg-white border border-blue-200 rounded-xl outline-none font-bold text-sm text-center" dir="rtl">
                        <option value="">مانگ</option>
                        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                      </select>
                      <select required value={formData.dobYear} onChange={e => setFormData({...formData, dobYear: e.target.value})} className="flex-1 p-3 bg-white border border-blue-200 rounded-xl outline-none font-bold text-sm text-center">
                        <option value="">ساڵ</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Lock size={20} /></div>
                      <input type={showPassword ? "text" : "password"} placeholder="تێپەڕەوشەی نوێ (لانی کەم ٨ پیت)" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 focus:shadow-sm outline-none font-bold text-sm transition-all" dir="ltr" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-4 flex items-center text-neutral-400 hover:text-neutral-700 transition">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'forgot' && (
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><User size={20} /></div>
                    <input type="text" placeholder="ناوی بەکارهێنەر، ئیمێڵ، یان ژمارە مۆبایل" required value={formData.identifier} onChange={e => setFormData({...formData, identifier: e.target.value})} className="w-full pl-4 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 outline-none font-bold text-sm transition-all" dir="ltr" />
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                    <label className="text-xs font-black text-neutral-600 mb-2 block"><CalendarDays size={16} className="inline ml-1"/> ڕۆژی لەدایکبوونت بنووسە بۆ دڵنیابوونەوە</label>
                    <div className="flex gap-2" dir="ltr">
                      <select required value={formData.dobDay} onChange={e => setFormData({...formData, dobDay: e.target.value})} className="flex-1 p-3 bg-white border border-neutral-200 rounded-xl outline-none font-bold text-sm text-center">
                        <option value="">ڕۆژ</option>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select required value={formData.dobMonth} onChange={e => setFormData({...formData, dobMonth: e.target.value})} className="flex-1 p-3 bg-white border border-neutral-200 rounded-xl outline-none font-bold text-sm text-center" dir="rtl">
                        <option value="">مانگ</option>
                        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                      </select>
                      <select required value={formData.dobYear} onChange={e => setFormData({...formData, dobYear: e.target.value})} className="flex-1 p-3 bg-white border border-neutral-200 rounded-xl outline-none font-bold text-sm text-center">
                        <option value="">ساڵ</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Lock size={20} /></div>
                    <input type={showPassword ? "text" : "password"} placeholder="تێپەڕەوشەی نوێ (لانی کەم ٨ پیت)" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 outline-none font-bold text-sm transition-all" dir="ltr" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-4 flex items-center text-neutral-400"><Eye size={20} /></button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Lock size={20} /></div>
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="تێپەڕەوشەی نوێ دووبارە بکەرەوە" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:border-neutral-400 outline-none font-bold text-sm transition-all" dir="ltr" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 left-4 flex items-center text-neutral-400"><Eye size={20} /></button>
                  </div>
                </div>
              )}

              <button disabled={loading} className={`w-full py-4 mt-2 text-white rounded-2xl font-black text-[15px] sm:text-base transition-all shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-95 disabled:opacity-70 ${theme?.main || 'bg-orange-500'} ${theme?.hover || 'hover:bg-orange-600'}`}>
                {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : (mode === 'login' ? 'چوونەژوورەوە' : mode === 'register' ? 'دروستکردنی هەژمار' : 'گۆڕینی تێپەڕەوشە')}
              </button>
            </form>

            <div className="text-center pt-8 mt-6 border-t border-neutral-100 flex flex-col gap-3">
              {mode === 'login' ? (
                <button onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }} className="text-neutral-500 font-bold hover:text-neutral-900 transition-colors text-sm">
                  هێشتا هەژمارت نییە؟ <span className={`${theme?.text || 'text-orange-500'} font-black`}>تۆماربە لێرە</span>
                </button>
              ) : (
                <button onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }} className="text-neutral-500 font-bold hover:text-neutral-900 transition-colors text-sm">
                  پێشتر هەژمارت هەیە؟ <span className={`${theme?.text || 'text-orange-500'} font-black`}>بچۆ ژوورەوە</span>
                </button>
              )}
            </div>
            
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}