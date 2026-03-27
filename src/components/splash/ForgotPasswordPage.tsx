import { Sparkles, ArrowLeft, Mail, Send, KeyRound, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import { authApi, ApiError } from '../../services/api';

export default function ForgotPasswordPage() {
  const setRoute = useAppStore((s) => s.setRoute);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().includes('@') && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
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
          <button onClick={() => setRoute('login')} className="flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer">
            <ArrowLeft size={15} />
            Giriş Yap
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="w-full max-w-[380px] text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#ECFEFF] flex items-center justify-center mb-5">
                <KeyRound size={22} className="text-[#06B6D4]" />
              </div>
              <h1 className="text-[32px] font-extrabold text-[#0F172A] tracking-tight mb-2">Şifremi Unuttum</h1>
              <p className="text-[14px] text-[#64748B] mb-8 leading-relaxed">
                E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
              </p>

              {error && (
                <div className="mb-4 px-3.5 py-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[12px] text-[#DC2626]">{error}</div>
              )}

              <div className="mb-6">
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#374151] mb-1.5">
                  <Mail size={13} className="text-[#94A3B8]" />
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@sirket.com"
                  autoFocus
                  className="w-full h-10 px-3.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10 transition-all"
                />
              </div>

              <button type="submit" disabled={!canSubmit}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-bold transition-all cursor-pointer active:scale-[0.97] ${
                  canSubmit
                    ? 'text-white shadow-lg shadow-[#0F2027]/15 hover:-translate-y-0.5'
                    : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
                style={canSubmit ? { background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' } : undefined}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
              </button>

              <p className="text-[13px] text-[#64748B] text-center mt-6">
                Şifrenizi hatırladınız mı?{' '}
                <span onClick={() => setRoute('login')} className="text-[#06B6D4] font-semibold hover:text-[#0891B2] cursor-pointer transition-colors">
                  Giriş Yap
                </span>
              </p>
            </form>
          ) : (
            <div className="text-center max-w-[400px]">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #06B6D4, #0891B2)' }}>
                <Mail size={28} className="text-white" />
              </div>
              <h2 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight mb-2">E-posta Gönderildi</h2>
              <p className="text-[15px] text-[#64748B] leading-relaxed mb-3">
                Şifre sıfırlama bağlantısı <strong className="text-[#0F172A]">{email}</strong> adresine gönderildi.
              </p>
              <p className="text-[13px] text-[#94A3B8] mb-8">
                E-postanızı kontrol edin. Gelen kutunuzda bulamazsanız spam klasörüne bakın.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setRoute('login')}
                  className="px-6 py-3 text-[14px] font-semibold rounded-xl cursor-pointer transition-all text-white hover:-translate-y-0.5 shadow-lg shadow-[#0F2027]/15"
                  style={{ background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' }}>
                  Giriş Sayfasına Dön
                </button>
                <button onClick={() => { setSubmitted(false); setEmail(''); }}
                  className="px-5 py-3 bg-[#F1F5F9] text-[#64748B] text-[14px] font-semibold rounded-xl hover:bg-[#E2E8F0] transition-all cursor-pointer">
                  Tekrar Gönder
                </button>
              </div>
            </div>
          )}
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
            <KeyRound size={24} className="text-[#67E8F9]" />
          </div>
          <h3 className="text-[22px] font-extrabold text-white tracking-tight mb-3">Endişelenmeyin</h3>
          <p className="text-[14px] text-[#94A3B8] leading-relaxed mb-8">
            Şifrenizi sıfırlamak yalnızca birkaç dakika sürer. E-posta adresinize güvenli bir bağlantı göndereceğiz.
          </p>

          <div className="space-y-3 text-left">
            <InfoRow text="Güvenli şifre sıfırlama bağlantısı" />
            <InfoRow text="Bağlantı 30 dakika geçerlidir" />
            <InfoRow text="Mevcut oturumlarınız etkilenmez" />
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
