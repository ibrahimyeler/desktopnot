import { Briefcase, Heart, Clock, Gift } from "lucide-react";

export function WhoIsItForSection() {
  const targetAudience = [
    {
      icon: Briefcase,
      title: "Gün boyu çalışan şehir insanı",
      description: "İş hayatının yoğunluğunda akşam yemeği için zaman bulamayanlar.",
    },
    {
      icon: Heart,
      title: "Akşam yemeğini düşünmek istemeyenler",
      description: "Karar verme yorgunluğundan kurtulmak isteyenler.",
    },
    {
      icon: Clock,
      title: "Ev yemeğini seven ama zaman bulamayanlar",
      description: "Lezzetli, sıcak ev yemeği isteyen ama hazırlamaya vakit olmayanlar.",
    },
    {
      icon: Gift,
      title: "Kendine akşamları küçük bir ödül vermek isteyenler",
      description: "Günün sonunda kendini ödüllendirmek isteyenler.",
    },
  ];

  return (
    <section id="who-is-it-for" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            HomeSupper kimler için?
          </h2>
        </div>

        {/* Target Audience Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {targetAudience.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-[#00ff88] bg-opacity-10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#00ff88]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

