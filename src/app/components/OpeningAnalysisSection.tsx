"use client";

import React from "react";
import { FullOpeningAnalysis } from "@/lib/openingAnalyzer";
import {
  BookOpen,
  Compass,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Swords,
  Clock,
  Sparkles,
} from "lucide-react";

export interface OpeningAnalysisSectionProps {
  openingAnalysis: FullOpeningAnalysis;
  userColor: "white" | "black" | null;
  currentPly: number;
  onSelectPly: (ply: number) => void;
}

export default function OpeningAnalysisSection({
  openingAnalysis,
  userColor,
  currentPly,
  onSelectPly,
}: OpeningAnalysisSectionProps) {
  const {
    identification,
    phases,
    userPlan,
    opponentPlan,
    assessment,
    turningPoint,
    decisions,
    openingVsResult,
  } = openingAnalysis;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-accent/15 text-accent">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-accent">
              Opening & Game Plan Analysis
            </span>
            {identification.eco && (
              <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[11px] font-mono font-bold text-foreground">
                ECO {identification.eco}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-foreground">
            {identification.name}
          </h3>

          {identification.variation && (
            <p className="text-sm font-semibold text-muted-foreground mt-0.5">
              {identification.variation}
            </p>
          )}

          <div className="text-xs text-muted-foreground font-medium mt-1">
            Opening Family:{" "}
            <span className="text-foreground font-semibold">{identification.family}</span>
          </div>
        </div>

        {/* Assessment Badge */}
        <div className="flex flex-col md:items-end gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Opening Outcome
          </span>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-background border border-border shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                assessment.status === "comfortable" || assessment.status === "slightly_better"
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  : assessment.status === "equal"
                  ? "bg-blue-400"
                  : "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]"
              }`}
            />
            <span className="text-xs font-black text-foreground capitalize">
              {assessment.headline}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              ({assessment.evaluationAtTransition > 0 ? `+${assessment.evaluationAtTransition}` : assessment.evaluationAtTransition})
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Phase Timeline */}
      <div className="p-4 rounded-xl bg-background/70 border border-border space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-muted-foreground text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent" />
            Game Phase Progression
          </span>
          <span className="text-muted-foreground text-[11px] font-mono">
            Theory to Move {identification.theoryMoveEnd}
          </span>
        </div>

        {/* Clickable Timeline Bar */}
        <div className="grid grid-cols-12 gap-1.5 pt-1">
          {/* Opening Phase */}
          <button
            onClick={() => onSelectPly(1)}
            title="Jump to Start of Opening"
            className="col-span-4 p-2 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700 text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-accent flex items-center justify-between">
              <span>Opening</span>
              <span className="font-mono">M1–{phases.openingEndMove}</span>
            </div>
            <div className="text-xs font-bold text-foreground truncate mt-0.5">
              Theory: Moves 1–{identification.theoryMoveEnd}
            </div>
          </button>

          {/* Theory End / Deviation Point */}
          <button
            onClick={() => onSelectPly(identification.theoryPlyEnd)}
            title={`Jump to Theory End (${identification.theoryEndedText})`}
            className={`col-span-4 p-2 rounded-lg border text-left transition-all cursor-pointer group ${
              currentPly === identification.theoryPlyEnd
                ? "bg-accent/20 border-accent text-accent shadow-sm"
                : "bg-zinc-800/90 hover:bg-zinc-700/90 border-zinc-700 text-foreground"
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-accent flex items-center justify-between">
              <span>First Deviation</span>
              <span className="font-mono">
                {identification.firstDeviationMove ? `M${identification.firstDeviationMove}` : `M${identification.theoryMoveEnd}`}
              </span>
            </div>
            <div className="text-xs font-bold text-accent truncate mt-0.5 flex items-center gap-1">
              <span>{identification.firstDeviationSan ? `${identification.firstDeviationSan}` : "In Theory"}</span>
              <span className="text-[10px] text-muted-foreground">({identification.whoDeviatedFirstText.includes("White") ? "White" : identification.whoDeviatedFirstText.includes("Black") ? "Black" : "Theory"})</span>
            </div>
          </button>

          {/* Middlegame Start */}
          <button
            onClick={() => onSelectPly(phases.middlegameStartPly)}
            title={`Jump to Middlegame (Move ${phases.middlegameStartMove})`}
            className={`col-span-4 p-2 rounded-lg border text-left transition-all cursor-pointer group ${
              currentPly >= phases.middlegameStartPly
                ? "bg-zinc-800/90 hover:bg-zinc-700/90 border-zinc-700"
                : "bg-zinc-900/60 border-zinc-800/80"
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-accent flex items-center justify-between">
              <span>Middlegame</span>
              <span className="font-mono">M{phases.middlegameStartMove}+</span>
            </div>
            <div className="text-xs font-bold text-foreground truncate mt-0.5">
              Strategic Clash
            </div>
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
          {identification.theoryEndedText}. {identification.whoDeviatedFirstText}.
        </p>
      </div>

      {/* 3. Opening Battle: Your Apparent Plan vs Opponent's Apparent Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your Plan Card */}
        <div className="p-4 rounded-xl bg-background border border-border shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-accent text-xs font-extrabold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                {userColor ? "Your Opening Setup" : "White's Opening Setup"}
              </div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800/90 px-2 py-0.5 rounded border border-zinc-700">
                {userPlan.executionLabel}
              </span>
            </div>

            <h4 className="text-sm font-black text-foreground mb-1">
              {userPlan.title}
            </h4>

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {userPlan.summary}
            </p>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                Observed Strategic Themes:
              </span>
              {userPlan.themes.map((theme, i) => (
                <div key={i} className="flex items-start gap-1.5 text-foreground text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{theme}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opponent's Plan Card */}
        <div className="p-4 rounded-xl bg-background border border-border shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-extrabold uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5" />
                {userColor ? "Opponent's Opening Response" : "Black's Opening Response"}
              </div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800/90 px-2 py-0.5 rounded border border-zinc-700">
                {opponentPlan.executionLabel}
              </span>
            </div>

            <h4 className="text-sm font-black text-foreground mb-1">
              {opponentPlan.title}
            </h4>

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {opponentPlan.summary}
            </p>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                Observed Strategic Themes:
              </span>
              {opponentPlan.themes.map((theme, i) => (
                <div key={i} className="flex items-start gap-1.5 text-foreground text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{theme}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Opening Turning Point & Key Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Turning Point */}
        {turningPoint ? (
          <div className="p-4 rounded-xl bg-background border border-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-accent text-xs font-extrabold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5" />
                Opening Turning Point
              </div>
              <div className="text-base font-black text-foreground font-mono mb-1">
                Move {turningPoint.moveNumber} • {turningPoint.san}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {turningPoint.description}
              </p>
              <div className="text-[11px] font-mono text-zinc-300">
                Shift: {turningPoint.evalBefore > 0 ? `+${turningPoint.evalBefore}` : turningPoint.evalBefore} →{" "}
                <span className="text-accent font-bold">
                  {turningPoint.evalAfter > 0 ? `+${turningPoint.evalAfter}` : turningPoint.evalAfter}
                </span>{" "}
                (±{turningPoint.swing} pawns)
              </div>
            </div>
            <button
              onClick={() => onSelectPly(turningPoint.ply)}
              className="mt-3 py-1.5 px-3 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              Jump to Move {turningPoint.moveNumber}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-background border border-border shadow-sm flex flex-col justify-center text-center">
            <span className="text-xs text-muted-foreground italic">
              Opening remained steady without dramatic evaluation swings.
            </span>
          </div>
        )}

        {/* Best / Worst Opening Move */}
        <div className="p-4 rounded-xl bg-background border border-border shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Key Opening Decisions
            </div>

            {decisions.bestMove && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground font-mono">
                    {decisions.bestMove.moveNumber}. {decisions.bestMove.san}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">
                    {decisions.bestMove.classification}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {decisions.bestMove.description}
                </p>
                <button
                  onClick={() => onSelectPly(decisions.bestMove!.ply)}
                  className="text-[10px] text-accent font-bold hover:underline mt-1 cursor-pointer"
                >
                  Inspect move →
                </button>
              </div>
            )}

            {decisions.worstMove && (
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400 font-mono">
                    {decisions.worstMove.moveNumber}. {decisions.worstMove.san}
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold uppercase">
                    {decisions.worstMove.classification}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {decisions.worstMove.description}
                </p>
                <button
                  onClick={() => onSelectPly(decisions.worstMove!.ply)}
                  className="text-[10px] text-rose-400 font-bold hover:underline mt-1 cursor-pointer"
                >
                  Inspect move →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Opening Outcome vs Final Game Result */}
      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-700/60 flex items-start gap-3">
        <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
        <div className="text-xs text-zinc-300 leading-relaxed">
          <span className="font-bold text-foreground block mb-0.5">
            Opening Impact on the Game:
          </span>
          {openingVsResult}
        </div>
      </div>
    </div>
  );
}
