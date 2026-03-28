import { useEffect, useState } from 'react';
import { Download, X, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function UpdateChecker() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error'>('idle');
  const [version, setVersion] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Get current app version
    import('@tauri-apps/api/app').then(({ getVersion }) => {
      getVersion().then(v => setCurrentVersion(v));
    }).catch(() => {});

    // Check on mount after 3s
    const timer = setTimeout(() => checkForUpdate(), 3000);
    // Then every hour
    const interval = setInterval(() => checkForUpdate(), 60 * 60 * 1000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  const checkForUpdate = async () => {
    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      setStatus('checking');
      const update = await check();
      if (update) {
        // Check if user dismissed this version before
        const dismissedVersion = localStorage.getItem('dismissed_update_version');
        if (dismissedVersion === update.version) {
          setStatus('idle');
          return;
        }
        setVersion(update.version);
        setStatus('available');
        setDismissed(false);
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (version) {
      localStorage.setItem('dismissed_update_version', version);
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
      // Remove dismissed version since we're updating
      localStorage.removeItem('dismissed_update_version');
      setTimeout(() => relaunch(), 1000);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'idle' || status === 'checking' || dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999]" style={{ animation: 'fadeUp 0.4s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#E2E8F0] p-4 w-[340px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              status === 'ready' ? 'bg-[#DCFCE7]' :
              status === 'error' ? 'bg-[#FEE2E2]' :
              'bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/5'
            }`}>
              {status === 'ready' ? <CheckCircle2 size={20} className="text-[#16A34A]" /> :
               status === 'downloading' ? <RefreshCw size={20} className="text-[#06B6D4] animate-spin" /> :
               status === 'error' ? <X size={20} className="text-[#EF4444]" /> :
               <Download size={20} className="text-[#06B6D4]" />}
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#0F172A]">
                {status === 'available' && 'Yeni Surum Mevcut'}
                {status === 'downloading' && 'Guncelleniyor...'}
                {status === 'ready' && 'Guncelleme Hazir'}
                {status === 'error' && 'Guncelleme Hatasi'}
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {status === 'available' && (
                  <span className="flex items-center gap-1">
                    v{currentVersion || '?'} <ArrowRight size={10} className="text-[#06B6D4]" /> <span className="font-semibold text-[#06B6D4]">v{version}</span>
                  </span>
                )}
                {status === 'downloading' && `%${progress} tamamlandi`}
                {status === 'ready' && 'Uygulama yeniden baslatiliyor...'}
                {status === 'error' && 'Baglanti hatasi. Tekrar deneyin.'}
              </div>
            </div>
          </div>
          {status !== 'downloading' && status !== 'ready' && (
            <button onClick={handleDismiss} className="w-6 h-6 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {status === 'downloading' && (
          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #06B6D4, #0891B2)',
              }}
            />
          </div>
        )}

        {/* Buttons */}
        {status === 'available' && (
          <div className="flex gap-2">
            <button onClick={handleDismiss} className="flex-1 py-2.5 text-[12px] font-semibold text-[#64748B] bg-[#F1F5F9] rounded-xl hover:bg-[#E2E8F0] transition-colors cursor-pointer">
              Daha Sonra
            </button>
            <button onClick={downloadAndInstall} className="flex-1 py-2.5 text-[12px] font-bold text-white rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
              style={{ background: 'linear-gradient(135deg, #06B6D4, #0891B2)' }}>
              Guncelle
            </button>
          </div>
        )}

        {status === 'error' && (
          <button onClick={checkForUpdate} className="w-full py-2.5 text-[12px] font-semibold text-[#06B6D4] bg-[#ECFEFF] rounded-xl hover:bg-[#CFFAFE] transition-colors cursor-pointer">
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  );
}
