import { Sparkles, Moon, Home as HomeIcon } from "lucide-react";

export function BrandPhilosophySection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Bizim için akşam yemeği…
          </h2>
        </div>

        {/* Philosophy Content */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
          <div className="space-y-8">
            {/* Philosophy Statements */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  Günün sonundaki ödül,
                </p>
                <p className="text-lg text-gray-600">
                  Kendine ayırdığın küçük bir an.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  Evin sıcaklığına giriş bileti.
                </p>
                <p className="text-lg text-gray-600">
                  Her akşam, her yemek, bir huzur anı.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center">
                <Moon className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  Şehir hayatının karmaşasından,
                </p>
                <p className="text-lg text-gray-600">
                  Akşam huzuruna geçiş köprüsü.
                </p>
              </div>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 leading-relaxed">
              HomeSupper, sadece yemek değil.
              <br />
              <span className="text-[#00ff88]">Bir yaşam tarzı.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

