import { Sparkles, ArrowLeft, Send, Building2, User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import { authApi, ApiError } from '../../services/api';

export default function RegisterPage() {
  const setRoute = useAppStore((s) => s.setRoute);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', password: '', message: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));
  const canSubmit = form.name.trim() && form.email.trim() && form.password.trim().length >= 6 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await authApi.register(form.email, form.password, form.name);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409 || err.message.includes('already')) setError('Bu e-posta adresi zaten kayıtlı.');
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
          {!submitted ? (
            <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
              <h1 className="text-[32px] font-extrabold text-[#0F172A] tracking-tight mb-2">Ücretsiz Başvuru</h1>
              <p className="text-[14px] text-[#64748B] mb-8 leading-relaxed">
                Bilgilerinizi bırakın, ekibimiz en kısa sürede sizinle iletişime geçsin.
              </p>

              {error && (
                <div className="mb-4 px-3.5 py-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[12px] text-[#DC2626]">{error}</div>
              )}

              <div className="space-y-4">
                <FormField icon={User} label="Ad Soyad" required value={form.name} onChange={v => update('name', v)} placeholder="Adınız ve soyadınız" />
                <FormField icon={Mail} label="E-posta" required type="email" value={form.email} onChange={v => update('email', v)} placeholder="ornek@sirket.com" />
                <FormField icon={Phone} label="Telefon" value={form.phone} onChange={v => update('phone', v)} placeholder="0 (5XX) XXX XX XX (opsiyonel)" />
                <FormField icon={Building2} label="Şirket / Kurum" value={form.company} onChange={v => update('company', v)} placeholder="Çalıştığınız kurum (opsiyonel)" />
                <FormField icon={MessageSquare} label="Şifre" required type="password" value={form.password} onChange={v => update('password', v)} placeholder="Minimum 6 karakter" />
                <div>
                  <label className="flex items-center gap-2 text-[12px] font-semibold text-[#374151] mb-1.5">
                    <MessageSquare size={13} className="text-[#94A3B8]" />
                    Mesajınız
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Ekibinizin büyüklüğü, kullanım amacınız vb. (opsiyonel)"
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10 transition-all resize-none"
                  />
                </div>
              </div>

              <button type="submit" disabled={!canSubmit}
                className={`w-full flex items-center justify-center gap-2 mt-6 py-3.5 rounded-xl text-[15px] font-bold transition-all cursor-pointer active:scale-[0.97] ${
                  canSubmit
                    ? 'text-white shadow-lg shadow-[#0F2027]/15 hover:-translate-y-0.5'
                    : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
                style={canSubmit ? { background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' } : undefined}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? 'Gönderiliyor...' : 'Talep Oluştur'}
              </button>

              <p className="text-[11px] text-[#94A3B8] text-center mt-4">
                Zaten hesabınız var mı?{' '}
                <span onClick={() => setRoute('login')} className="text-[#06B6D4] font-semibold hover:text-[#0891B2] cursor-pointer">Giriş Yap</span>
              </p>
            </form>
          ) : (
            <div className="text-center max-w-[400px]">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #06B6D4, #0891B2)' }}>
                <Send size={28} className="text-white" />
              </div>
              <h2 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight mb-2">Talebiniz Alındı</h2>
              <p className="text-[15px] text-[#64748B] leading-relaxed mb-8">
                Ekibimiz <strong className="text-[#0F172A]">{form.email}</strong> adresine en kısa sürede dönüş yapacaktır.
              </p>
              <button onClick={() => setRoute('splash')}
                className="px-6 py-3 bg-[#F1F5F9] text-[#0F172A] text-[14px] font-semibold rounded-xl hover:bg-[#E2E8F0] transition-all cursor-pointer">
                Ana Sayfaya Dön
              </button>
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
            <Sparkles size={24} className="text-[#67E8F9]" />
          </div>
          <h3 className="text-[22px] font-extrabold text-white tracking-tight mb-3">NotApp ile tanışın</h3>
          <p className="text-[14px] text-[#94A3B8] leading-relaxed mb-8">
            Ekibiniz için güvenli, hızlı ve modern bir çalışma platformu. Tüm belgeleriniz tek çatı altında.
          </p>

          <div className="space-y-3 text-left">
            <InfoRow text="Ücretsiz kurulum, kredi kartı gerekmez" />
            <InfoRow text="14 gün içinde tam erişim" />
            <InfoRow text="Özel müşteri temsilcisi desteği" />
            <InfoRow text="İstediğiniz zaman iptal" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ icon: I, label, required, type = 'text', value, onChange, placeholder }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[12px] font-semibold text-[#374151] mb-1.5">
        <I size={13} className="text-[#94A3B8]" />
        {label}
        {required && <span className="text-[#EF4444]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10 transition-all"
      />
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
