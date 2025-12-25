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

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
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
  );
}

