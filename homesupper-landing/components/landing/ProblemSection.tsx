import { Clock, Briefcase, Home, ChefHat } from "lucide-react";

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Şehir akşamları yorucu.
          </h2>
        </div>

        {/* Problem Flow */}
        <div className="space-y-12">
          {/* Morning */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sabah evden çıkıyoruz.</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Gün boyu iş, trafik, toplantılar, stres…
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Home className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Akşam olduğunda eve dönmek istiyoruz.</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Ama yemek hazırlama, karar verme, bekleme derdi başlıyor.
              </p>
            </div>
          </div>

          {/* Solution */}
          <div className="flex flex-col md:flex-row items-start gap-6 pt-8 border-t-2 border-gray-200">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-[#00ff88]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                HomeSupper, bu döngüyü kırmak için doğdu.
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Artık akşam yemeği için düşünmene gerek yok. Tek bir karar, sıcak bir yemek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

