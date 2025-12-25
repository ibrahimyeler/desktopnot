import { Smartphone, UtensilsCrossed, Home, Package } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      icon: Smartphone,
      title: "Uygulamayı aç",
      description: "İş çıkışı, yolda veya evde. Uygulamayı aç ve günün menüsünü gör.",
    },
    {
      number: "2",
      icon: UtensilsCrossed,
      title: "Günün akşam yemeğini seç",
      description: "Her gün özenle hazırlanmış tek bir spesiyal yemek. Karar verme yok, sadece seç.",
    },
    {
      number: "3",
      icon: Home,
      title: "Eve dön",
      description: "Normal hayatına devam et. Yemeğin hazırlanıyor, sen rahatla.",
    },
    {
      number: "4",
      icon: Package,
      title: "Sıcak yemeğini teslim al",
      description: "Eve vardığında sıcak yemeğin hazır. Gel al veya teslim al, sen karar ver.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Nasıl çalışır?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dört basit adımda akşam huzurunu kapına getiriyoruz.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#00ff88] text-white flex items-center justify-center font-bold text-lg z-10 shadow-lg">
                  {step.number}
                </div>

                {/* Step Card */}
                <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-gray-100 h-full pt-12 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-[#00ff88]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0">
                    <div className="w-8 h-0.5 bg-gray-200" />
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-gray-200 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

