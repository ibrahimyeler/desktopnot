import { Sparkles, ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import { authApi, setTokens, ApiError } from '../../services/api';

export default function LoginPage() {
  const setRoute = useAppStore((s) => s.setRoute);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim() && password.trim() && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setTokens(data.access_token, data.refresh_token);
      setRoute('home');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403) setError('Hesabınız henüz onaylanmamış. Lütfen yönetici onayını bekleyin.');
        else if (err.status === 401) setError('E-posta veya şifre hatalı.');
        else setError(err.message);
      } else {
        setError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F1F5F9] overflow-hidden">
      {/* Sol — Form */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between px-10 h-[60px] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#06B6D4] flex items-center justify-center shadow-md shadow-cyan-500/25">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-[15px] font-bold text-[#0F172A] tracking-tight">NotApp</span>
          </div>
          <button onClick={() => setRoute('splash')} className="flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer">
            <ArrowLeft size={15} />
            Geri Dön
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-10">
          <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
            <h1 className="text-[32px] font-extrabold text-[#0F172A] tracking-tight mb-2">Giriş Yap</h1>
            <p className="text-[14px] text-[#64748B] mb-8">Hesabınıza giriş yaparak devam edin.</p>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[12px] text-[#DC2626]">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#374151] mb-1.5">
                  <Mail size={13} className="text-[#94A3B8]" />
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@sirket.com"
                  className="w-full h-10 px-3.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#374151] mb-1.5">
                  <Lock size={13} className="text-[#94A3B8]" />
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3.5 pr-10 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] cursor-pointer transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#06B6D4]" />
                <span className="text-[12px] text-[#64748B]">Beni hatırla</span>
              </label>
              <span onClick={() => setRoute('forgot-password')} className="text-[12px] text-[#06B6D4] font-semibold hover:text-[#0891B2] cursor-pointer transition-colors">Şifremi unuttum</span>
            </div>

            <button type="submit" disabled={!canSubmit}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-bold transition-all cursor-pointer active:scale-[0.97] ${
                canSubmit
                  ? 'text-white shadow-lg shadow-[#0F2027]/15 hover:-translate-y-0.5'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
              style={canSubmit ? { background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' } : undefined}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            <p className="text-[13px] text-[#64748B] text-center mt-6">
              Hesabınız yok mu?{' '}
              <span onClick={() => setRoute('register')} className="text-[#06B6D4] font-semibold hover:text-[#0891B2] cursor-pointer transition-colors">
                Başvuru Oluşturun
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Sağ — Dark panel */}
      <div className="hidden lg:flex w-[42%] flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F2027 0%, #203A43 45%, #2C5364 100%)' }}>
        <div className="absolute top-[10%] left-[10%] w-[240px] h-[240px] rounded-full bg-[#06B6D4]/8 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-[200px] h-[200px] rounded-full bg-[#67E8F9]/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #67E8F9 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10 max-w-[320px] text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#06B6D4]/15 flex items-center justify-center">
            <Sparkles size={24} className="text-[#67E8F9]" />
          </div>
          <h3 className="text-[22px] font-extrabold text-white tracking-tight mb-3">Tekrar hoş geldiniz</h3>
          <p className="text-[14px] text-[#94A3B8] leading-relaxed mb-8">
            Belgeleriniz, tablolarınız ve notlarınız sizi bekliyor. Kaldığınız yerden devam edin.
          </p>

          <div className="space-y-3 text-left">
            <InfoRow text="Tüm belgelerinize anında erişim" />
            <InfoRow text="Güvenli ve şifreli bağlantı" />
            <InfoRow text="Çoklu cihaz senkronizasyonu" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.06]">
      <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shrink-0" />
      <span className="text-[12px] text-[#CBD5E1]">{text}</span>
    </div>
  );
}
