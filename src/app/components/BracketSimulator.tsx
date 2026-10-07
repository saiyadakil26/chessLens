"use client";

import { useState } from "react";
import {
  Competitor,
  BracketSimulation,
  FAMOUS_COMPETITORS,
  simulateBracket,
} from "@/lib/tournamentSimulator";
import { Trophy, Swords, Zap, Timer, Sparkles, RefreshCcw, Crown } from "lucide-react";

export default function BracketSimulator() {
  const [timeClass, setTimeClass] = useState<"bullet" | "blitz" | "rapid" | "classical">("blitz");
  const [bracketSize, setBracketSize] = useState<4 | 8>(8);
  const [simulation, setSimulation] = useState<BracketSimulation>(() =>
    simulateBracket(FAMOUS_COMPETITORS.slice(0, 8), "Super Grandmaster Arena", "blitz")
  );

  function handleSimulate() {
    const pool = FAMOUS_COMPETITORS.slice(0, bracketSize);
    const result = simulateBracket(
      pool,
      `${timeClass.toUpperCase()} Masters Championship`,
      timeClass
    );
    setSimulation(result);
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
      {/* Simulator Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs uppercase font-bold tracking-wider mb-1">
            <Swords className="w-4 h-4" />
            Competitive Simulator
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground">
            DNA Bracket Predictor
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simulate knockout tournaments where match outcomes are weighted by player Archetype and time control.
          </p>
        </div>

        {/* Format Selector & Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-background p-1 rounded-xl border border-border">
            {(["bullet", "blitz", "rapid", "classical"] as const).map((tc) => (
              <button
                key={tc}
                onClick={() => setTimeClass(tc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  timeClass === tc
                    ? "bg-card text-accent shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tc}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-background p-1 rounded-xl border border-border">
            <button
              onClick={() => setBracketSize(4)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                bracketSize === 4
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Top 4
            </button>
            <button
              onClick={() => setBracketSize(8)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                bracketSize === 8
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Top 8
            </button>
          </div>

          <button
            onClick={handleSimulate}
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-background font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Simulate Bracket
          </button>
        </div>
      </div>

      {/* Champion Podium Spotlight */}
      <div className="bg-gradient-to-r from-accent/15 via-background to-accent/15 border border-accent/40 rounded-2xl p-6 text-center relative overflow-hidden shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-black text-xs uppercase tracking-wider mb-2">
          <Crown className="w-4 h-4 text-accent" />
          Projected Champion
        </div>
        <h4 className="text-3xl font-black text-foreground">
          {simulation.champion.name}
        </h4>
        <div className="text-sm font-semibold text-accent mt-0.5">
          {simulation.champion.archetype}
        </div>
        <p className="text-xs text-muted-foreground mt-2 max-w-lg mx-auto">
          Stylistic edge in {simulation.timeClass} enabled {simulation.champion.name} to defeat {simulation.runnerUp.name} in the finals.
        </p>
      </div>

      {/* Visual Bracket Flow */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {simulation.rounds.map((round) => (
            <div key={round.name} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                  {round.name}
                </span>
                <span className="text-[10px] text-accent font-mono font-bold">
                  {round.matches.length} Match{round.matches.length > 1 ? "es" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {round.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-background/80 border border-border/80 hover:border-accent/40 rounded-xl p-3.5 shadow-sm space-y-2 transition-all"
                  >
                    {/* Player 1 Row */}
                    <div
                      className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                        m.winner.id === m.player1.id
                          ? "bg-accent/15 font-bold text-foreground"
                          : "text-muted-foreground opacity-75"
                      }`}
                    >
                      <span className="truncate">
                        {m.player1.name}{" "}
                        <span className="text-[10px] opacity-70">
                          ({m.player1.archetype})
                        </span>
                      </span>
                      <span className="font-mono text-sm">{m.score1}</span>
                    </div>

                    {/* Player 2 Row */}
                    <div
                      className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                        m.winner.id === m.player2.id
                          ? "bg-accent/15 font-bold text-foreground"
                          : "text-muted-foreground opacity-75"
                      }`}
                    >
                      <span className="truncate">
                        {m.player2.name}{" "}
                        <span className="text-[10px] opacity-70">
                          ({m.player2.archetype})
                        </span>
                      </span>
                      <span className="font-mono text-sm">{m.score2}</span>
                    </div>

                    <div className="text-[10px] text-muted-foreground italic pt-1 border-t border-border/40">
                      {m.decidingFactor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
