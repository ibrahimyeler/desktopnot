import { CheckCircle2, Calendar, Clock, Sparkles } from "lucide-react";

export function SolutionSection() {
  const features = [
    {
      icon: Calendar,
      title: "Her gün tek bir spesiyal akşam yemeği",
      description: "Uzun menüler yok, karar yorgunluğu yok. Her gün özenle seçilmiş tek bir yemek.",
    },
    {
      icon: Clock,
      title: "Yoldayken seç, eve geldiğinde hazır olsun",
      description: "İş çıkışı uygulamayı aç, yemeğini seç. Eve vardığında sıcak yemeğin hazır.",
    },
    {
      icon: Sparkles,
      title: "Ne düşün, ne hazırla, ne bekle",
      description: "Karar verme stresi yok. Hazırlama yorgunluğu yok. Sadece rahatla ve tadını çıkar.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            HomeSupper nedir?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#00ff88]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Emphasis Statement */}
        <div className="text-center mt-16">
          <div className="inline-block bg-[#00ff88] bg-opacity-10 rounded-2xl px-8 py-6 border-2 border-[#00ff88] border-opacity-20">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-relaxed">
              Bu sadece yemek değil.
              <br />
              <span className="text-[#00ff88]">Bu bir akşam huzuru hizmeti.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

