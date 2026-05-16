import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, AtSign, ArrowRight, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FontStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @font-face {
      font-family: 'Kosrat';
      src: url('/font/kosrat.ttf') format('truetype');
      font-display: swap;
    }
    .font-kosrat { 
      font-family: 'Kosrat', 'Noto Sans Arabic', sans-serif !important; 
    }
  `}} />
);

interface Props { onLogin: (data: any) => void; }

export default function Auth({ onLogin }: Props) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    identifier: '', // بۆ ئیمێڵ یان مۆبایل
    password: ''
  });

  const showNotif = (msg: string, type = 'error') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!formData.identifier || !formData.password) return showNotif('تکایە سەرجەم خانەکان پڕبکەرەوە');
    } else {
      if (!formData.name || !formData.username || !formData.identifier || !formData.password) return showNotif('تکایە سەرجەم خانەکان پڕبکەرەوە');
      if (formData.password.length < 6) return showNotif('پاسوۆرد دەبێت لانی کەم ٦ پیت یان ژمارە بێت');
      if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) return showNotif('نازناو (Username) تەنها دەبێت ئینگلیزی و ژمارە بێت');
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      // ڕێکخستنی داتا بۆ باکێند
      const payload = isLogin 
        ? { identifier: formData.identifier, password: formData.password }
        : { 
            name: formData.name, 
            username: formData.username, 
            identifier: formData.identifier, // ئیمێڵ یان مۆبایل
            password: formData.password 
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        onLogin(data);
        showNotif(isLogin ? 'بە سەرکەوتوویی چوویتە ژوورەوە!' : 'هەژمارەکەت سەرکەوتووانە دروستکرا!', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        throw new Error(data.error || 'هەڵەیەک ڕوویدا');
      }
    } catch (err: any) {
      showNotif(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 relative font-kosrat selection:bg-orange-200" dir="rtl">
      <FontStyle />
      
      {/* باکگراوندی دیزاین */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-orange-400/20 to-rose-400/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-400/20 to-amber-400/20 rounded-full blur-[100px]"></div>
      </div>

      <AnimatePresence>
        {notification.show && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className={`fixed top-[calc(env(safe-area-inset-top)+1.5rem)] left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-black text-sm shadow-xl flex items-center gap-3 backdrop-blur-md border ${notification.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-green-500/90 text-white border-green-400'}`}>
            {notification.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>} {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* هێدەر و لۆگۆ */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[1.25rem] text-white font-black text-3xl shadow-lg shadow-orange-500/30 mb-4 hover:scale-105 transition-transform">
            B
          </Link>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">BioKurd</h1>
          <p className="text-sm font-bold text-neutral-500 mt-2">
            {isLogin ? 'بەخێربێیتەوە بۆ هەژمارەکەت' : 'هەژمارێکی نوێ بۆ خۆت دروست بکە'}
          </p>
        </div>

        {/* فۆرمی سەرەکی */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }} 
           animate={{ opacity: 1, scale: 1 }} 
           transition={{ duration: 0.3 }}
           className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-white"
        >
          {/* گۆڕینی نێوان چوونە ژوورەوە و خۆتۆمارکردن */}
          <div className="flex p-1.5 bg-neutral-100 rounded-2xl mb-8 relative">
             <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${isLogin ? 'right-1.5' : 'right-[calc(50%+4.5px)]'}`}></div>
             <button onClick={() => { setIsLogin(true); setFormData({...formData, password: ''}); }} className={`flex-1 py-3 text-sm font-black z-10 transition-colors ${isLogin ? 'text-neutral-900' : 'text-neutral-500'}`}>چوونە ژوورەوە</button>
             <button onClick={() => { setIsLogin(false); setFormData({...formData, password: ''}); }} className={`flex-1 py-3 text-sm font-black z-10 transition-colors ${!isLogin ? 'text-neutral-900' : 'text-neutral-500'}`}>خۆتۆمارکردن</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  
                  {/* ناوی تەواو - dir="auto" وا دەکات کوردی ڕاست و ئینگلیزی چەپ بێت */}
                  <div>
                    <label className="text-xs font-black text-neutral-600 block mb-1.5 px-1">ناوی تەواو</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 group-focus-within:text-orange-500 transition-colors"><User size={18} /></div>
                      <input type="text" dir="auto" placeholder="ناوی سیانیت..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm font-bold rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] transition-all py-3.5 pr-11 pl-4" />
                    </div>
                  </div>

                  {/* نازناو - تەنها ئینگلیزی */}
                  <div>
                    <label className="text-xs font-black text-neutral-600 block mb-1.5 px-1">نازناو (Username)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 group-focus-within:text-orange-500 transition-colors"><AtSign size={18} /></div>
                      <input type="text" dir="ltr" placeholder="kosrat123" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '')})} className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm font-bold rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] transition-all py-3.5 pr-11 pl-4 text-left" />
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* ئیمێڵ یان مۆبایل */}
            <div>
              <label className="text-xs font-black text-neutral-600 block mb-1.5 px-1">
                {isLogin ? 'ئیمێڵ، مۆبایل یان نازناو' : 'ئیمێڵ یان ژمارە مۆبایل'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Mail size={18} /></div>
                <input 
                  type="text" 
                  dir="ltr" 
                  name="username" 
                  autoComplete="username"
                  placeholder={isLogin ? 'kosrat@example.com' : '0750... یان name@email.com'} 
                  value={formData.identifier} 
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})} 
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm font-bold rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] transition-all py-3.5 pr-11 pl-4 text-left" 
                />
              </div>
            </div>

            {/* پاسوۆرد */}
            <div>
              <label className="text-xs font-black text-neutral-600 block mb-1.5 px-1">وشەی نهێنی</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 group-focus-within:text-orange-500 transition-colors"><Lock size={18} /></div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  dir="ltr" 
                  name="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder={isLogin ? "••••••••" : "لانی کەم ٦ پیت یان ژمارە"} 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm font-bold rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] transition-all py-3.5 pr-11 pl-12 text-left tracking-widest" 
                />
                {/* دوگمەی پیشاندان و شاردنەوەی پاسوۆرد */}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400 hover:text-neutral-700 transition-colors outline-none">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* دوگمەی چوونە ژوورەوە */}
            <button disabled={loading} type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-black text-base shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? (
                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                 <>
                   {isLogin ? 'چوونە ژوورەوە' : 'دروستکردنی هەژمار'}
                   <ArrowRight size={20} className="rotate-180" />
                 </>
              )}
            </button>
            
          </form>
          
          {/* بەشی پارێزراوی لە خوارەوە */}
          <div className="mt-6 flex items-center justify-center gap-2 text-neutral-400 opacity-80">
            <Shield size={14} />
            <span className="text-[10px] font-black tracking-wider">١٠٠٪ پارێزراو و نهێنی</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
}