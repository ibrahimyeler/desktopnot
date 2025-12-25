"use client";

import { Download, Mail } from "lucide-react";
import { useState } from "react";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email collection
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-[#00ff88] to-[#00cc6f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Akşamlar değişebilir.
        </h2>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
          HomeSupper ile her akşam biraz daha hafif.
        </p>

        {/* CTA Button */}
        <div className="mb-12">
          <button className="bg-white text-[#00ff88] font-bold text-lg px-10 py-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto shadow-xl">
            <span>Uygulama Çok Yakında</span>
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Email Collection (Optional) */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            Haberdar olmak ister misin?
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresin"
              className="flex-1 px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <button
              type="submit"
              className="bg-white text-[#00ff88] font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              {submitted ? (
                <>
                  <span>✓ Gönderildi</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Gönder</span>
                </>
              )}
            </button>
          </form>
          {submitted && (
            <p className="text-white/80 text-sm mt-4">
              Teşekkürler! Sana haber verdiğimizde ilk sen öğreneceksin.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

