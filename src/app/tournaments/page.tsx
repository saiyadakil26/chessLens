"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import TournamentCard, { TournamentSummaryData } from "@/app/components/TournamentCard";
import BracketSimulator from "@/app/components/BracketSimulator";
import { Trophy, Search, Swords, ArrowRight, Zap, Flame } from "lucide-react";

const FEATURED_TOURNAMENTS: TournamentSummaryData[] = [
  {
    id: "titled-tuesday-blitz",
    name: "Titled Tuesday Blitz Arena",
    type: "arena",
    timeClass: "blitz",
    timeControl: "3+1",
    status: "in_progress",
    participantsCount: 650,
    featuredGrandmasters: ["Hikaru Nakamura", "Magnus Carlsen", "Jan-Krzysztof Duda"],
    dnaRequirement: {
      primary: "Speed Demon (95+ Speed)",
      secondary: "Fast Tactical Opportunism",
    },
  },
  {
    id: "bullet-brawl-weekly",
    name: "Bullet Brawl Championship",
    type: "arena",
    timeClass: "bullet",
    timeControl: "1+0",
    status: "upcoming",
    participantsCount: 420,
    featuredGrandmasters: ["Daniel Naroditsky", "Alireza Firouzja", "Andrew Tang"],
    dnaRequirement: {
      primary: "Hyper-Velocity Premove Reflexes",
      secondary: "Gambit Aggression",
    },
  },
  {
    id: "speed-chess-championship",
    name: "Speed Chess Championship Knockout",
    type: "knockout",
    timeClass: "blitz",
    timeControl: "5+1 / 3+1 / 1+1",
    status: "upcoming",
    participantsCount: 16,
    featuredGrandmasters: ["Magnus Carlsen", "Hikaru Nakamura", "Wesley So", "Nihal Sarin"],
    dnaRequirement: {
      primary: "Endurance & Multi-Time Control Versatility",
      secondary: "Clinical Defense",
    },
  },
  {
    id: "champions-chess-tour-rapid",
    name: "Champions Chess Tour Rapid Swiss",
    type: "swiss",
    timeClass: "rapid",
    timeControl: "10+0",
    status: "finished",
    participantsCount: 128,
    featuredGrandmasters: ["Fabiano Caruana", "Ian Nepomniachtchi", "Anish Giri"],
    dnaRequirement: {
      primary: "The Calculator (Deep Calculation)",
      secondary: "Endgame Conversion Precision",
    },
  },
  {
    id: "collegiate-blitz-cup",
    name: "Collegiate Blitz Invitational",
    type: "arena",
    timeClass: "blitz",
    timeControl: "3+0",
    status: "finished",
    participantsCount: 310,
    featuredGrandmasters: ["Awonder Liang", "Ray Robson", "Hans Niemann"],
    dnaRequirement: {
      primary: "Tactical Sharpness",
      secondary: "Time Scramble Composure",
    },
  },
  {
    id: "community-classical-swiss",
    name: "Weekend Classical Open Swiss",
    type: "swiss",
    timeClass: "classical",
    timeControl: "30+0",
    status: "upcoming",
    participantsCount: 94,
    featuredGrandmasters: ["Community Masters & Experts"],
    dnaRequirement: {
      primary: "The Fortress (Positional Resilience)",
      secondary: "Technical Pawn Structures",
    },
  },
];

export default function TournamentsPage() {
  const router = useRouter();
  const [searchSlug, setSearchSlug] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const clean = searchSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (clean) {
      router.push(`/tournaments/${clean}`);
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5" />
            Phase 4 Competition Layer
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
            Tournaments & <span className="text-accent">Format DNA</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyze the winning DNA requirements across different tournament formats and predict bracket outcomes.
          </p>
        </div>

        {/* Tournament Lookup */}
        <div className="max-w-2xl mx-auto bg-card border border-border p-3 sm:p-4 rounded-2xl shadow-xl">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                placeholder="Enter Chess.com tournament slug (e.g. -titled-tuesday-blitz-)..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-background font-bold rounded-xl text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Inspect
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2.5 text-[11px] text-muted-foreground px-2">
            Tip: Tournament slug can be found in the Chess.com URL: <code className="text-accent">chess.com/tournament/[slug]</code>
          </div>
        </div>

        {/* Featured Tournaments */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-accent">
                Elite Competitions
              </span>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Featured Tournaments
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_TOURNAMENTS.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        </section>

        {/* DNA Bracket Simulator */}
        <section id="simulator">
          <Suspense fallback={<div className="p-12 text-center text-accent animate-pulse">Loading Bracket Simulator...</div>}>
            <BracketSimulator />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
