import { Sparkles, ArrowRight, Shield, Zap, Users, CheckCircle2, Lock, Table, BarChart3 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function SplashPage() {
  const setRoute = useAppStore((s) => s.setRoute);
  const go = () => setRoute('login');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F1F5F9] overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 h-[60px] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#06B6D4] flex items-center justify-center shadow-md shadow-cyan-500/25">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-[15px] font-bold text-[#0F172A] tracking-tight">NotApp</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1">
        {/* Sol */}
        <div className="flex-1 flex items-center justify-center px-10">
          <div className="max-w-[540px] text-center flex flex-col items-center">
            {/* Badge */}
            <div className="anim-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFEFF] border border-[#A5F3FC] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#0E7490] tracking-wide">Yeni surum — v1.2.2</span>
            </div>

            <h1 className="anim-fade-up-d1 text-[48px] font-extrabold text-[#0F172A] leading-[1.06] tracking-[-0.03em] mb-5">
              Belgelerinizi<br />
              <span className="shimmer-cyan">tek platformda</span> yönetin.
            </h1>

            <p className="anim-fade-up-d2 text-[16px] text-[#64748B] leading-[1.75] mb-8 max-w-[440px]">
              Notlar, tablolar, dokümanlar ve sunumlar — tüm ekibinizin ihtiyacı olan araçlar güvenli ve hızlı bir şekilde tek çatı altında.
            </p>

            {/* CTA */}
            <div className="anim-fade-up-d3 flex items-center gap-3 mb-8">
              <button onClick={go} className="group flex items-center gap-2 px-7 py-3.5 text-white text-[15px] font-bold rounded-xl hover:-translate-y-0.5 transition-all cursor-pointer active:scale-[0.97] shadow-lg shadow-[#0F2027]/15"
                style={{ background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' }}>
                Giriş Yap
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Güven satırı */}
            <div className="anim-fade-up-d4 flex items-center gap-6">
              <Trust icon={Shield} text="Güvenli altyapı" />
              <Trust icon={Zap} text="Hızlı ve kararlı" />
              <Trust icon={Users} text="Ekip çalışmasına uygun" />
            </div>
          </div>
        </div>

        {/* Sağ — Dark teal panel with floating UI */}
        <div className="hidden lg:flex w-[48%] items-center justify-center relative overflow-hidden rounded-tl-[40px]"
          style={{ background: 'linear-gradient(160deg, #0F2027 0%, #203A43 45%, #2C5364 100%)' }}>

          {/* Glow orbs */}
          <div className="absolute top-[8%] left-[8%] w-[260px] h-[260px] rounded-full bg-[#06B6D4]/8 blur-3xl" />
          <div className="absolute bottom-[6%] right-[3%] w-[240px] h-[240px] rounded-full bg-[#06B6D4]/10 blur-3xl" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#67E8F9]/5 blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, #67E8F9 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          {/* Main card — note editor mockup */}
          <div className="anim-scale-in relative z-10 w-[320px] rounded-2xl shadow-2xl shadow-black/30 border border-white/[0.08] overflow-hidden anim-float-slow"
            style={{ background: 'linear-gradient(180deg, #1a3a4a 0%, #162d3a 100%)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.03]">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
              </div>
              <span className="text-[11px] text-[#94A3B8] ml-2">Proje Notları.note</span>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="h-2.5 bg-white/20 rounded w-[70%]" />
              <div className="h-2 bg-white/8 rounded w-full" />
              <div className="h-2 bg-white/8 rounded w-[85%]" />
              <div className="h-2 bg-white/5 rounded w-[60%]" />
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-0.5 bg-[#06B6D4]/15 text-[#67E8F9] text-[9px] font-medium rounded">Tasarım</span>
                <span className="px-2 py-0.5 bg-[#22C55E]/15 text-[#4ADE80] text-[9px] font-medium rounded">Sprint 4</span>
              </div>
            </div>
          </div>

          {/* Floating card — spreadsheet */}
          <div className="anim-scale-in-d1 absolute top-[12%] right-[8%] z-20 w-[200px] rounded-xl shadow-xl shadow-black/20 border border-white/[0.08] overflow-hidden anim-float"
            style={{ background: 'linear-gradient(180deg, #1a3a4a 0%, #162d3a 100%)' }}>
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]">
              <Table size={11} className="text-[#06B6D4]" />
              <span className="text-[10px] text-[#94A3B8] font-medium">Bütçe Tablosu</span>
            </div>
            <div className="p-2.5 space-y-1.5">
              <div className="flex gap-1.5">
                <div className="h-5 flex-1 bg-[#06B6D4]/10 rounded text-[8px] text-[#67E8F9] flex items-center justify-center font-mono">12,450</div>
                <div className="h-5 flex-1 bg-[#22C55E]/10 rounded text-[8px] text-[#4ADE80] flex items-center justify-center font-mono">8,200</div>
              </div>
              <div className="flex gap-1.5">
                <div className="h-5 flex-1 bg-white/5 rounded text-[8px] text-[#94A3B8] flex items-center justify-center font-mono">5,780</div>
                <div className="h-5 flex-1 bg-white/5 rounded text-[8px] text-[#94A3B8] flex items-center justify-center font-mono">3,100</div>
              </div>
            </div>
          </div>

          {/* Floating card — chart */}
          <div className="anim-scale-in-d2 absolute bottom-[14%] left-[6%] z-20 w-[180px] rounded-xl shadow-xl shadow-black/20 border border-white/[0.08] overflow-hidden anim-float-d1"
            style={{ background: 'linear-gradient(180deg, #1a3a4a 0%, #162d3a 100%)' }}>
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]">
              <BarChart3 size={11} className="text-[#06B6D4]" />
              <span className="text-[10px] text-[#94A3B8] font-medium">Analiz</span>
            </div>
            <div className="p-3 flex items-end gap-1.5 h-[60px]">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[#06B6D4] to-[#67E8F9]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Floating — success badge */}
          <div className="anim-scale-in-d2 absolute bottom-[32%] right-[5%] z-20 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg shadow-black/15 border border-white/[0.08] anim-float-slow"
            style={{ background: 'linear-gradient(180deg, #1a3a4a 0%, #162d3a 100%)' }}>
            <CheckCircle2 size={14} className="text-[#22C55E]" />
            <span className="text-[10px] font-medium text-[#CBD5E1]">Otomatik kaydedildi</span>
          </div>

          {/* Floating — lock badge */}
          <div className="anim-scale-in-d1 absolute top-[22%] left-[5%] z-20 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg shadow-black/15 border border-white/[0.08] anim-float-d1"
            style={{ background: 'linear-gradient(180deg, #1a3a4a 0%, #162d3a 100%)' }}>
            <Lock size={12} className="text-[#06B6D4]" />
            <span className="text-[10px] font-medium text-[#CBD5E1]">Uçtan uca şifreleme</span>
          </div>

          {/* Floating — team avatar */}
          <div className="anim-scale-in-d2 absolute top-[8%] left-[35%] z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-lg shadow-black/15 border border-white/[0.08] anim-float"
            style={{ background: 'linear-gradient(180deg, #1a3a4a 0%, #162d3a 100%)' }}>
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-[#06B6D4] flex items-center justify-center text-[7px] font-bold text-white ring-1 ring-[#162d3a]">AY</div>
              <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center text-[7px] font-bold text-white ring-1 ring-[#162d3a]">MK</div>
              <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center text-[7px] font-bold text-white ring-1 ring-[#162d3a]">EO</div>
            </div>
            <span className="text-[10px] font-medium text-[#CBD5E1]">3 aktif</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-between px-10 h-[44px] text-[11px] text-[#94A3B8] shrink-0">
        <span>© 2026 NotApp. Tum haklari saklidir. — v1.2.2</span>
        <div className="flex gap-4">
          <span className="hover:text-[#64748B] cursor-pointer transition-colors">Gizlilik</span>
          <span className="hover:text-[#64748B] cursor-pointer transition-colors">Kullanım Şartları</span>
        </div>
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
