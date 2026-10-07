import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import GameStorySection from './components/landing/GameStorySection';
import AnalysisPreviewSection from './components/landing/AnalysisPreviewSection';
import OpeningInsightsSection from './components/landing/OpeningInsightsSection';
import PatternsAndDNASection from './components/landing/PatternsAndDNASection';
import CommunityGridSection from './components/landing/CommunityGridSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ChessLens | Understand Your Chess, Not Just Your Moves',
  description: 'Analyze your completed chess games, discover opening patterns, understand turning points and mistakes, and uncover the patterns that define how you play.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <GameStorySection />
      <AnalysisPreviewSection />
      <OpeningInsightsSection />
      <PatternsAndDNASection />
      <HowItWorks />
      <CommunityGridSection />
      
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p className="font-semibold text-foreground mb-4 flex items-center justify-center gap-1.5">
            <span className="text-accent">♟</span> ChessLens
          </p>
          <p className="mb-6">Understand Your Chess. Not Just Your Moves.</p>
          <p className="text-sm max-w-lg mx-auto">
            ChessLens is an independent third-party project and is not affiliated with or endorsed by Chess.com.
          </p>
        </div>
      </footer>
    </main>
  );
}
