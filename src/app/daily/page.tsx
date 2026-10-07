import { getDailyPuzzle } from "@/lib/puzzleApi";
import PuzzleBoard from "@/app/components/PuzzleBoard";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Daily Challenge | ChessDNA',
  description: 'Test your tactical vision with the daily chess puzzle.',
};

async function PuzzleLoader() {
  const puzzle = await getDailyPuzzle();
  
  if (puzzle) {
    return <PuzzleBoard puzzle={puzzle} />;
  }
  
  return (
    <div className="p-8 text-center bg-card rounded-2xl border border-border">
      <p className="text-muted-foreground">Failed to load the daily puzzle. Please try again later.</p>
    </div>
  );
}

export default function DailyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Daily <span className="text-accent">Challenge</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Solve the puzzle of the day and sharpen your tactical instincts.
          </p>
        </div>

        <Suspense fallback={
          <div className="p-12 text-center bg-card/50 rounded-2xl border border-border">
            <p className="text-accent animate-pulse font-medium text-lg">Loading today's puzzle...</p>
          </div>
        }>
          <PuzzleLoader />
        </Suspense>
      </div>
    </main>
  );
}
