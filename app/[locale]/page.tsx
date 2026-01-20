"use client"

import { PageWrapper } from "@/components/page-wrapper";
import { HeroSection } from "@/components/hero-section";
import { SportsGrid } from "@/components/sports-grid";
import { LiveResults } from "@/components/live-results";
import { MedalTable } from "@/components/medal-table";
import { HighlightsSection } from "@/components/highlights-section";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <SportsGrid />
      <LiveResults />
      <MedalTable />
      <HighlightsSection />
    </PageWrapper>
  );
}
