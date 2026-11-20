import { useEffect, useState } from 'react';
import { Download, WifiOff, X } from 'lucide-react';

// Banner install (beforeinstallprompt) dan banner offline.
// Posisi banner install berada di atas bottom nav (lihat .banner-install di App.css)
export default function PWABadge() {
  const [prompt, setPrompt] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setPrompt(e); };
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  const install = async () => { await prompt.prompt(); setPrompt(null); };

  return (
    <>
      {!online && (
        <div className="banner banner-offline" role="status">
          <WifiOff size={16} aria-hidden="true" /> Anda sedang offline. Menampilkan data tersimpan.
        </div>
      )}
      {prompt && (
        <div className="banner banner-install" role="dialog" aria-label="Pasang aplikasi">
          <span>Pasang DieCarz di layar utama</span>
          <button className="btn btn-sm" onClick={install}><Download size={14} aria-hidden="true" /> Install DieCarz</button>
          <button className="icon-btn" aria-label="Tutup" onClick={() => setPrompt(null)}><X size={16} /></button>
        </div>
      )}
    </>
  );
}
