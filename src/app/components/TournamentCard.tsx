"use client";

import Link from "next/link";
import { Trophy, Timer, Users, Zap, Shield, Flame, ArrowUpRight } from "lucide-react";

export interface TournamentSummaryData {
  id: string;
  name: string;
  type: "arena" | "swiss" | "knockout";
  timeClass: "bullet" | "blitz" | "rapid" | "classical";
  timeControl: string;
  status: "upcoming" | "in_progress" | "finished";
  participantsCount: number;
  featuredGrandmasters: string[];
  dnaRequirement: {
    primary: string;
    secondary: string;
  };
}

export default function TournamentCard({
  tournament,
}: {
  tournament: TournamentSummaryData;
}) {
  const isBullet = tournament.timeClass === "bullet";
  const isBlitz = tournament.timeClass === "blitz";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isBullet
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : isBlitz
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {tournament.type} • {tournament.timeClass}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[11px] font-mono text-muted-foreground flex items-center gap-1">
              <Timer className="w-3 h-3 text-accent" />
              {tournament.timeControl}
            </span>
          </div>

          <span
            className={`w-2 h-2 rounded-full ${
              tournament.status === "in_progress"
                ? "bg-emerald-500 animate-ping"
                : tournament.status === "upcoming"
                ? "bg-accent"
                : "bg-muted-foreground/40"
            }`}
          />
        </div>

        <h4 className="font-extrabold text-xl text-foreground group-hover:text-accent transition-colors leading-snug mb-2">
          {tournament.name}
        </h4>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {tournament.participantsCount.toLocaleString()} Contenders
          </span>
        </div>

        {/* Format DNA Profile tags */}
        <div className="p-3 bg-background/70 border border-border/80 rounded-xl mb-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-accent" />
            Format Winning Traits
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="px-2 py-0.5 bg-accent/15 text-accent font-semibold rounded-md border border-accent/20">
              {tournament.dnaRequirement.primary}
            </span>
            <span className="px-2 py-0.5 bg-background text-foreground font-semibold rounded-md border border-border">
              {tournament.dnaRequirement.secondary}
            </span>
          </div>
        </div>

        {/* Featured GMs */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Featured Seeds: </span>
          {tournament.featuredGrandmasters.join(", ")}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
        <Link
          href={`/tournaments/${tournament.id}`}
          className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
        >
          Inspect Format DNA & Bracket →
        </Link>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
    </div>
  );
}
