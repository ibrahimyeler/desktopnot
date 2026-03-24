import { useEffect, useState } from 'react';
import { Download, X, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function UpdateChecker() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error'>('idle');
  const [version, setVersion] = useState('');
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Uygulama açıldıktan 3 saniye sonra kontrol et
    const timer = setTimeout(() => checkForUpdate(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const checkForUpdate = async () => {
    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      setStatus('checking');
      const update = await check();
      if (update) {
        setVersion(update.version);
        setStatus('available');
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  };

  const downloadAndInstall = async () => {
    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      const { relaunch } = await import('@tauri-apps/plugin-process');
      setStatus('downloading');
      const update = await check();
      if (!update) return;

      let downloaded = 0;
      let total = 0;
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started' && event.data.contentLength) {
          total = event.data.contentLength;
        } else if (event.event === 'Progress') {
          downloaded += event.data.chunkLength;
          if (total > 0) setProgress(Math.round((downloaded / total) * 100));
        } else if (event.event === 'Finished') {
          setStatus('ready');
        }
      });

      setStatus('ready');
      // 1 saniye bekle sonra yeniden başlat
      setTimeout(() => relaunch(), 1000);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'idle' || status === 'checking' || dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#E2E8F0] p-4 w-[320px]">
        {/* Üst */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${status === 'ready' ? 'bg-[#DCFCE7]' : status === 'error' ? 'bg-[#FEE2E2]' : 'bg-[#DBEAFE]'}`}>
              {status === 'ready' ? <CheckCircle2 size={18} className="text-[#16A34A]" /> :
               status === 'downloading' ? <RefreshCw size={18} className="text-[#3B82F6] animate-spin" /> :
               <Download size={18} className="text-[#3B82F6]" />}
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#0F172A]">
                {status === 'available' && 'Güncelleme Mevcut'}
                {status === 'downloading' && 'İndiriliyor...'}
                {status === 'ready' && 'Güncelleme Hazır'}
                {status === 'error' && 'Güncelleme Hatası'}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {status === 'available' && `v${version} sürümü yayınlandı`}
                {status === 'downloading' && `%${progress} tamamlandı`}
                {status === 'ready' && 'Yeniden başlatılıyor...'}
                {status === 'error' && 'Daha sonra tekrar deneyin'}
              </div>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="w-6 h-6 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* İlerleme çubuğu */}
        {status === 'downloading' && (
          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Buton */}
        {status === 'available' && (
          <div className="flex gap-2">
            <button onClick={() => setDismissed(true)} className="flex-1 py-2 text-[12px] font-semibold text-[#64748B] bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0] transition-colors cursor-pointer">
              Sonra
            </button>
            <button onClick={downloadAndInstall} className="flex-1 py-2 text-[12px] font-bold text-white bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer">
              Güncelle
            </button>
          </div>
        )}

        {status === 'error' && (
          <button onClick={checkForUpdate} className="w-full py-2 text-[12px] font-semibold text-[#3B82F6] bg-[#EFF6FF] rounded-lg hover:bg-[#DBEAFE] transition-colors cursor-pointer">
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  );
}
