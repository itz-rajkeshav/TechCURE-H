import { createFileRoute } from "@tanstack/react-router";

import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { NavBar } from "@/components/landing/NavBar";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="min-h-screen bg-[#030712] font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

