import { X, Check, Brain } from "lucide-react";

export function WhySingleMenuSection() {
  const problems = [
    { icon: X, text: "Uzun listeler yok" },
    { icon: X, text: "Karşılaştırma yok" },
    { icon: X, text: "Stres yok" },
  ];

  return (
    <section id="why-single-menu" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Neden tek menü?
          </h2>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
          {/* Opening Statement */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <Brain className="w-16 h-16 text-[#00ff88] mx-auto" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-relaxed">
              Çünkü karar yorgunluğu gerçek.
            </p>
          </div>

          {/* What We Don't Have */}
          <div className="mb-12">
            <div className="grid sm:grid-cols-3 gap-6">
              {problems.map((problem, index) => {
                const Icon = problem.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100"
                  >
                    <Icon className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{problem.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What We Have */}
          <div className="text-center">
            <div className="inline-block bg-[#00ff88] bg-opacity-10 rounded-2xl px-8 py-6 border-2 border-[#00ff88] border-opacity-30">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Check className="w-8 h-8 text-[#00ff88]" />
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Her gün tek bir özenli seçim var.
                </p>
              </div>
              <p className="text-xl text-gray-700 mt-4">
                Biz karar verdik, sen rahatladın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

