import { Target, MapPin, TrendingUp, Shield } from "lucide-react";

export function StartingModelSection() {
  const phases = [
    {
      icon: Target,
      title: "Tek merkez mutfak",
      description: "İlk etapta tek bir merkez mutfak ile başlıyoruz. Amacımız hızlı büyümek değil, doğru yapmak.",
    },
    {
      icon: TrendingUp,
      title: "Kanıtlanmış model",
      description: "Bu model kanıtlandıkça kontrollü şekilde büyüyeceğiz.",
    },
    {
      icon: MapPin,
      title: "Yeni şehirler ve mutfaklar",
      description: "Başarılı model sonrası yeni şehirler ve mutfaklar ekleyeceğiz.",
    },
    {
      icon: Shield,
      title: "Franchise modeli",
      description: "Uzun vadede franchise modeli ile genişleyeceğiz.",
    },
  ];

  return (
    <section id="starting-model" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Nasıl başlıyoruz?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            HomeSupper, ilk etapta tek bir merkez mutfak ile başlar.
            <br />
            Amacımız hızlı büyümek değil, doğru yapmak.
          </p>
        </div>

        {/* Phases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#00ff88]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {phase.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Investor Note */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-blue-50 rounded-2xl px-8 py-6 border-2 border-blue-100">
            <p className="text-lg text-gray-700 italic">
              📌 Bu bölüm yatırımcı için çok değerli.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Kontrollü büyüme, kanıtlanmış model, ölçeklenebilir yapı.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

