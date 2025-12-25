"use client";

import { Download, Smartphone } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[80vh] items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-16 pt-10 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        {/* Left: Text */}
        <div className="flex-1 text-left">
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-slate-200/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
            Akşam huzuru servisi
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Akşam yemeğini
            <br />
            <span className="bg-gradient-to-r from-[#00ff88] to-emerald-400 bg-clip-text text-transparent">
              düşünmeyi bırak.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-xl text-base text-gray-600 sm:text-lg leading-relaxed">
            Şehir hayatının yorgunluğunda, her akşam tek bir sıcak karar.
            <br />
            <span className="font-semibold text-gray-800">
              HomeSupper
            </span>
            , akşam huzurunu kapına getirir.
          </p>

          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-black">
              <span>Uygulama Çok Yakında</span>
              <Download className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50">
              <Smartphone className="h-4 w-4 text-gray-500" />
              <span>Demo akşam menüsünü gör</span>
            </button>
          </div>

          {/* App Store Badges (Placeholder) */}
          <div className="flex flex-wrap items-center gap-3 opacity-70">
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-xs text-gray-500 ring-1 ring-gray-200">
              <Smartphone className="h-4 w-4 text-gray-400" />
              <span>App Store • Çok Yakında</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-xs text-gray-500 ring-1 ring-gray-200">
              <Smartphone className="h-4 w-4 text-gray-400" />
              <span>Google Play • Çok Yakında</span>
            </div>
          </div>
        </div>

        {/* Right: Phone Card Mockup */}
        <div className="flex-1">
          <div className="mx-auto w-full max-w-xs rounded-3xl bg-white/90 p-4 shadow-2xl ring-1 ring-slate-200/80 backdrop-blur">
            {/* Status bar */}
            <div className="mb-4 flex items-center justify-between text-[10px] text-gray-500">
              <span>18:45</span>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-6 rounded-full bg-gray-200" />
                <span className="h-2 w-2 rounded-full bg-gray-400" />
              </div>
            </div>

            {/* Card content */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#00ff88] text-[10px] font-black text-gray-900">
                    HS
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-semibold">HomeSupper</span>
                    <span className="text-[10px] text-slate-300">
                      Kadıköy • Bugünün menüsü
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  Sıcak
                </span>
              </div>

              <div className="mb-3 rounded-2xl bg-black/20 p-3">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-emerald-200">
                  Bu akşam
                </p>
                <p className="mb-1 text-sm font-semibold">
                  Fırınlanmış tavuk & sebze
                </p>
                <p className="text-[11px] text-slate-300">
                  Eve döndüğünde ısıtılmış ve hazır.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-200">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">
                    Teslim saati
                  </span>
                  <span className="font-semibold">19:15 - 19:30</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400">
                    Akşam huzuru
                  </span>
                  <span className="font-semibold text-emerald-300">
                    Tek dokunuş
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

