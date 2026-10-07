import { Suspense } from "react";
import Link from "next/link";
import { getTournamentDetails } from "@/lib/tournamentApi";
import {
  Trophy,
  Timer,
  Users,
  ChevronLeft,
  ExternalLink,
  Zap,
  Shield,
  Sparkles,
  ArrowUpRight,
  Flame,
} from "lucide-react";

export const metadata = {
  title: "Tournament Format DNA | ChessDNA",
  description: "Analyze tournament requirements, participants, and winning DNA traits.",
};

interface Props {
  params: Promise<{ tournamentId: string }>;
}

async function TournamentDetailContent({ params }: Props) {
  const { tournamentId } = await params;
  const tourney = await getTournamentDetails(tournamentId);

  // If public API doesn't return (e.g. curated custom slug or private), provide rich simulated details
  const name =
    tourney?.name ||
    tournamentId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const timeClass = tourney?.settings?.time_class || "blitz";
  const timeControl = tourney?.settings?.time_control || "3+1";
  const type = tourney?.settings?.type || "Arena";
  const status = tourney?.status || "Official Event";
  const players = tourney?.players || [
    { username: "hikaru", status: "confirmed" },
    { username: "magnuscarlsen", status: "confirmed" },
    { username: "firouzja2003", status: "confirmed" },
    { username: "fabianocaruana", status: "confirmed" },
    { username: "danielnaroditsky", status: "confirmed" },
    { username: "nihalsarin", status: "confirmed" },
    { username: "gothamchess", status: "confirmed" },
    { username: "daniil_dubov", status: "confirmed" },
  ];

  const dnaReqs =
    timeClass === "bullet"
      ? {
          favoredArchetype: "The Speed Demon",
          speedReq: 98,
          aggressionReq: 90,
          tacticsReq: 92,
          defenseReq: 65,
          endgameReq: 60,
          verdict:
            "Bullet format penalizes slow calculation heavily. High-velocity premove players dominate this arena.",
        }
      : timeClass === "blitz"
      ? {
          favoredArchetype: "The Chaos Merchant / Calculator",
          speedReq: 90,
          aggressionReq: 85,
          tacticsReq: 95,
          defenseReq: 75,
          endgameReq: 75,
          verdict:
            "Blitz rewards sharp tactical vision and immediate tactical refutations under 3-minute clock pressure.",
        }
      : {
          favoredArchetype: "The Technician / Fortress",
          speedReq: 75,
          aggressionReq: 70,
          tacticsReq: 88,
          defenseReq: 92,
          endgameReq: 96,
          verdict:
            "Longer time controls favor players who avoid blunders, structure solid pawn chains, and grind micro-endgames.",
        };

  return (
    <div className="space-y-12">
      {/* Tournament Header Banner */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-accent/15 border border-accent/40 text-accent font-black text-[10px] uppercase tracking-wider">
                {type} • {timeClass}
              </span>
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Status: {status}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Timer className="w-3.5 h-3.5 text-accent" />
                Time Control: {timeControl}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {players.length} Seeded Contenders
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {tourney?.url && (
              <a
                href={tourney.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-background hover:bg-muted border border-border rounded-xl text-xs font-bold text-foreground transition-all flex items-center gap-2"
              >
                View on Chess.com
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              href="/tournaments#simulator"
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-background font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              Simulate In Bracket
            </Link>
          </div>
        </div>

        {/* Tournament Description */}
        {tourney?.description && (
          <div className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
              {tourney.description.replace(/<[^>]*>?/gm, "")}
            </p>
          </div>
        )}
      </div>

      {/* Winning DNA Requirements */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs uppercase font-bold tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              Format Winning DNA
            </div>
            <h3 className="text-2xl font-black text-foreground">
              What Style Wins This Tournament?
            </h3>
          </div>
          <div className="px-3.5 py-1.5 bg-accent/15 border border-accent/40 rounded-xl text-accent font-bold text-xs">
            Favored Archetype: {dnaReqs.favoredArchetype}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {dnaReqs.verdict}
        </p>

        {/* Trait Requirements Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { label: "Tactical Vision", val: dnaReqs.tacticsReq },
            { label: "Speed & Clock", val: dnaReqs.speedReq },
            { label: "Aggression", val: dnaReqs.aggressionReq },
            { label: "Endgame Mastery", val: dnaReqs.endgameReq },
            { label: "Defensive Resilience", val: dnaReqs.defenseReq },
          ].map((trait) => (
            <div
              key={trait.label}
              className="bg-background/60 border border-border/80 rounded-xl p-3.5 text-center"
            >
              <div className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                {trait.label}
              </div>
              <div className="text-xl font-black text-foreground">{trait.val}%</div>
              <div className="h-1 bg-border rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${trait.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seeded Contenders */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-foreground">
              Seeded Contenders
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inspect each contender's DNA to assess their style match against this tournament format.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {players.slice(0, 16).map((p) => (
            <Link
              key={p.username}
              href={`/dna/${p.username}`}
              className="p-3.5 bg-background/70 hover:bg-background border border-border/80 hover:border-accent/40 rounded-xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-xs flex-shrink-0">
                  {p.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors truncate">
                  {p.username}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TournamentDetailPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/tournaments"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Tournaments Directory
        </Link>

        <Suspense
          fallback={
            <div className="p-16 text-center text-accent animate-pulse font-medium">
              Loading Tournament Format DNA...
            </div>
          }
        >
          <TournamentDetailContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
