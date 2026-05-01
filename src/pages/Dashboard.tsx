import { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import LinksManager from '../components/LinksManager';
import ProfileSettings from '../components/ProfileSettings';
import ThemeSettings from '../components/ThemeSettings';
import SecuritySettings from '../components/SecuritySettings';
import DashboardHeader from '../components/DashboardHeader'; 
import WelcomeBanner from '../components/WelcomeBanner'; 

interface Props { user: any; onLogout: () => void; theme: any; settings: any; }

export default function Dashboard({ user, onLogout, theme, settings }: Props) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/profile', { headers: { 'Authorization': `Bearer ${user.token}` } })
    .then(res => res.json())
    .then(data => { 
      const loadedProfile = {
        ...data,
        theme: data.theme || 'mockup',
        // 🌟 چارەسەری کێشەکە: نابێت لێرە بە زۆر ڕەنگ دابنێین با ڕووکارەکان دیزاینی خۆیان پیشان بدەن
        nameColor: data.nameColor || '',
        bioColor: data.bioColor || '',
        btnTextColor: data.btnTextColor || ''
      };
      setProfile(loadedProfile); 
      setLoading(false); 
    })
    .catch(() => setLoading(false));
  }, [user.token]);

  const copyProfileLink = () => {
    if(!profile?.slug) return;
    navigator.clipboard.writeText(`https://biokurd.com/${profile.slug}`);
    alert('لینکەکەت بە سەرکەوتوویی کۆپی کرا!');
  };

  const handleUpdateProfile = async (updates: any = {}) => {
    setSaving(true);
    const dataToSend = { ...profile, ...updates };
    
    try {
      await fetch('/api/profile', { 
        method: 'PUT', 
        headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, 
        body: JSON.stringify(dataToSend) 
      });
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar') => {
    const file = e.target.files?.[0]; if (!file) return;
    if (type === 'avatar') setIsUploadingAvatar(true);
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image(); img.src = event.target?.result as string;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; const MAX_HEIGHT = 400;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        if (type === 'avatar') { await handleUpdateProfile({ avatarUrl: base64String }); setProfile({ ...profile, avatarUrl: base64String }); setIsUploadingAvatar(false); } 
      };
    };
  };

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><div className={`w-10 h-10 border-[5px] ${theme?.border || 'border-orange-200'} border-t-transparent rounded-full animate-spin`}></div></div>;

  const isPro = profile?.isPro || user?.isAdmin;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 font-sans" dir="rtl">
      {showQrModal && profile?.slug && <Card profile={profile} onClose={() => setShowQrModal(false)} />}

      <DashboardHeader profile={profile} theme={theme} onLogout={onLogout} />
      <WelcomeBanner profile={profile} theme={theme} isPro={isPro} copyProfileLink={copyProfileLink} setShowQrModal={setShowQrModal} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-8">
        <ProfileSettings profile={profile} setProfile={setProfile} theme={theme} isPro={isPro} saving={saving} handleUpdateProfile={handleUpdateProfile} handleImageUpload={handleImageUpload} isUploadingAvatar={isUploadingAvatar} avatarInputRef={avatarInputRef} />
        <ThemeSettings profile={profile} setProfile={setProfile} theme={theme} settings={settings} isPro={isPro} handleUpdateProfile={handleUpdateProfile} />
        <LinksManager user={user} profile={profile} setProfile={setProfile} settings={settings} theme={theme} />
        <SecuritySettings profile={profile} setProfile={setProfile} userToken={user.token} />
      </div>
    </div>
  );
}