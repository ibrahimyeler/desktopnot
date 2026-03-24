import { Sparkles, ArrowRight, Shield, Zap, Users, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function SplashPage() {
  const setRoute = useAppStore((s) => s.setRoute);
  const go = () => setRoute('home');

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Sol */}
      <div className="flex-1 flex flex-col">
        {/* Üst bar */}
        <div className="flex items-center justify-between px-10 h-[60px] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-[15px] font-bold text-[#0F172A] tracking-tight">NotApp</span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-[#64748B]">
            <span className="hover:text-[#0F172A] cursor-pointer transition-colors">Özellikler</span>
            <span className="hover:text-[#0F172A] cursor-pointer transition-colors">Güvenlik</span>
            <span className="hover:text-[#0F172A] cursor-pointer transition-colors">Fiyatlandırma</span>
            <button onClick={go} className="text-[#3B82F6] font-semibold hover:text-[#2563EB] transition-colors cursor-pointer">Giriş Yap</button>
          </div>
        </div>

        {/* Hero */}
        <div className="flex-1 flex items-center justify-center px-10">
          <div className="max-w-[520px]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#0369A1] tracking-wide">Kurumsal çalışma platformu</span>
            </div>

            <h1 className="text-[44px] font-extrabold text-[#0F172A] leading-[1.08] tracking-[-0.03em] mb-5">
              Belgelerinizi<br />
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] bg-clip-text text-transparent">tek platformda</span> yönetin.
            </h1>

            <p className="text-[16px] text-[#64748B] leading-[1.7] mb-8 max-w-[440px]">
              Notlar, tablolar, dokümanlar ve sunumlar — tüm ekibinizin ihtiyacı olan araçlar güvenli ve hızlı bir şekilde tek çatı altında.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-3 mb-10">
              <button onClick={go} className="flex items-center gap-2 px-7 py-3.5 bg-[#0F172A] text-white text-[15px] font-bold rounded-xl hover:bg-[#1E293B] hover:-translate-y-0.5 transition-all cursor-pointer active:scale-[0.97] shadow-lg shadow-slate-900/10">
                Ücretsiz Başlayın
                <ArrowRight size={17} />
              </button>
              <button onClick={go} className="flex items-center gap-1.5 px-5 py-3.5 text-[14px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer">
                Demo İncele
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Güven satırı */}
            <div className="flex items-center gap-6">
              <Trust icon={Shield} text="Güvenli altyapı" />
              <Trust icon={Zap} text="Hızlı ve kararlı" />
              <Trust icon={Users} text="Ekip çalışmasına uygun" />
            </div>
          </div>
        </div>

        {/* Alt */}
        <div className="flex items-center justify-between px-10 h-[48px] text-[11px] text-[#CBD5E1] shrink-0">
          <span>© 2026 NotApp. Tüm hakları saklıdır. — v1.1.2</span>
          <div className="flex gap-4">
            <span className="hover:text-[#94A3B8] cursor-pointer transition-colors">Gizlilik</span>
            <span className="hover:text-[#94A3B8] cursor-pointer transition-colors">Kullanım Şartları</span>
          </div>
        </div>
      </div>

      {/* Sağ */}
      <div className="hidden lg:flex w-[46%] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#C7D2FE]" />
        <div className="absolute top-[10%] left-[10%] w-[220px] h-[220px] rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-[8%] right-[5%] w-[200px] h-[200px] rounded-full bg-violet-400/15 blur-3xl" />
        <img src="/right.png" alt="NotApp" className="relative z-10 w-[82%] max-w-[480px] h-auto drop-shadow-2xl" draggable={false} />
      </div>
    </div>
  );
}

function Trust({ icon: I, text }: { icon: React.ComponentType<{ size?: number; className?: string }>; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <I size={14} className="text-[#94A3B8]" />
      <span className="text-[12px] text-[#64748B]">{text}</span>
    </div>
  );
}
