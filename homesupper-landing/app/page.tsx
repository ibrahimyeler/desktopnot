import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { WhySingleMenuSection } from "@/components/landing/WhySingleMenuSection";
import { WhoIsItForSection } from "@/components/landing/WhoIsItForSection";
import { StartingModelSection } from "@/components/landing/StartingModelSection";
import { BrandPhilosophySection } from "@/components/landing/BrandPhilosophySection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { TopNav } from "@/components/layout/TopNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <main className="bg-gradient-to-b from-white via-slate-50 to-white">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <WhySingleMenuSection />
        <WhoIsItForSection />
        <StartingModelSection />
        <BrandPhilosophySection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
