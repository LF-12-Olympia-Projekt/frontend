"use client"

import { Header } from "@/components/header";
import { ScrollSections } from "@/components/scroll-sections";
import { HeroSection } from "@/components/hero-section";
import { SportsGrid } from "@/components/sports-grid";
import { LiveResults } from "@/components/live-results";
import { MedalTable } from "@/components/medal-table";
import { HighlightsSection } from "@/components/highlights-section";

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden">
      <Header />
      <ScrollSections>
        <HeroSection />
        <SportsGrid />
        <LiveResults />
        <MedalTable />
        <HighlightsSection />
      </ScrollSections>
    </div>
  );
}
