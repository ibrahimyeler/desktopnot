import { SectorsHero } from "@/components/sectors/hero-section";
import { SectorsGrid } from "@/components/sectors/sectors-grid";
import { SectorsCTA } from "@/components/sectors/cta-section";

export default function IndustriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SectorsHero />
      <SectorsGrid />
      <SectorsCTA />
    </div>
  );
}
