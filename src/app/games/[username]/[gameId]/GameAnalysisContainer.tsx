"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChessGame } from "@/lib/chessApi";
import { FullGameAnalysis, analyzeCompletedGame } from "@/lib/chessEngine";
import GameAnalysisView from "@/app/components/GameAnalysisView";
import { ChevronLeft, Sparkles, Loader2, Play, Brain, CheckCircle2 } from "lucide-react";

interface GameAnalysisContainerProps {
  game: ChessGame;
  targetUsername: string;
  gameId: string;
}

export default function GameAnalysisContainer({
  game,
  targetUsername,
  gameId,
}: GameAnalysisContainerProps) {
  const [analysis, setAnalysis] = useState<FullGameAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check cache on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cacheKey = `chessdna_analysis_${gameId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setAnalysis(parsed);
          return;
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }
      // If not cached, trigger analysis automatically
      startAnalysis();
    }
  }, [gameId]);

  async function startAnalysis() {
    setIsAnalyzing(true);
    setProgress(5);

    try {
      const result = await analyzeCompletedGame(
        game.pgn,
        targetUsername,
        (pct) => setProgress(pct)
      );

      // Cache result in localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`chessdna_analysis_${gameId}`, JSON.stringify(result));
        } catch {
          // localStorage quota exceeded or private mode
        }
      }

      setAnalysis(result);
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleReanalyze() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`chessdna_analysis_${gameId}`);
    }
    setAnalysis(null);
    startAnalysis();
  }

  // If analysis is ready, render the full interactive analysis board
  if (analysis) {
    return (
      <div className="space-y-6">
        <Link
          href={`/games/${targetUsername}`}
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {targetUsername}'s Game Library
        </Link>

        <GameAnalysisView
          game={game}
          analysis={analysis}
          targetUsername={targetUsername}
          onReanalyze={handleReanalyze}
        />
      </div>
    );
  }

  // Otherwise, render the staged analysis progress screen
  return (
    <div className="max-w-xl mx-auto space-y-6 pt-12">
      <Link
        href={`/games/${targetUsername}`}
        className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Game Library
      </Link>

      <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mx-auto animate-pulse">
          <Brain className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent">
            ChessDNA Engine Active
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
            Analyzing Completed Game
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Evaluating every ply, identifying turning points, and calculating accuracy scores.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-muted-foreground">Analysis Progress</span>
            <span className="text-accent">{progress}%</span>
          </div>
          <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-accent transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Staged Checklist */}
        <div className="space-y-2.5 text-left text-xs bg-background/60 p-4 rounded-xl border border-border/80">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Loaded game PGN and headers</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Reconstructed full move sequence</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            {progress < 100 ? (
              <Loader2 className="w-4 h-4 text-accent animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span className={progress < 100 ? "text-accent" : "text-foreground"}>
              Evaluating candidate moves & centipawn loss ({progress}%)
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-4 text-center font-bold">○</span>
            <span>Detecting decisive turning points and blunders</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-4 text-center font-bold">○</span>
            <span>Building comprehensive ChessDNA report</span>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground italic">
          This analysis runs once and is automatically cached locally for instant future replay.
        </p>
      </div>
    </div>
  );
}
