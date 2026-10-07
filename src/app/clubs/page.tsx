"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClubCard from "@/app/components/ClubCard";
import { Users, Search, Shield, Sparkles, ArrowRight } from "lucide-react";

const FEATURED_CLUBS = [
  {
    id: "chessbrah",
    name: "Chessbrah",
    url: "https://www.chess.com/club/chessbrah",
    icon: "https://images.chesscomfiles.com/uploads/v1/group/45148.d19128f7.160x160o.png",
    members_count: 72000,
    description:
      "Home of the Chessbrah grandmasters Eric Hansen and Aman Hambleton. High energy, aggressive blitz, and techno vibes.",
  },
  {
    id: "team-usa",
    name: "Team USA",
    url: "https://www.chess.com/club/team-usa",
    icon: "https://images.chesscomfiles.com/uploads/v1/group/2544.bc5fe028.160x160o.gif",
    members_count: 48000,
    description:
      "The official Team USA community competing in international matches and team vote chess championships.",
  },
  {
    id: "botez-live",
    name: "BotezLive",
    url: "https://www.chess.com/club/botezlive",
    icon: "https://images.chesscomfiles.com/uploads/v1/group/80388.5e1564f3.160x160o.png",
    members_count: 51000,
    description:
      "Official community for Alexandra and Andrea Botez. Lively community games, tactical challenges, and streaming events.",
  },
  {
    id: "im-eric-rosen-fan-club",
    name: "IM Eric Rosen Fan Club",
    url: "https://www.chess.com/club/im-eric-rosen-fan-club",
    icon: "https://images.chesscomfiles.com/uploads/v1/group/73030.13aeebfa.160x160o.png",
    members_count: 36000,
    description:
      "For fans of the Stafford Gambit, sneaky stalemates, and 'Oh no my queen!' tactics led by International Master Eric Rosen.",
  },
  {
    id: "road-to-grandmaster",
    name: "Road to Grandmaster",
    url: "https://www.chess.com/club/road-to-grandmaster",
    icon: "https://images.chesscomfiles.com/uploads/v1/group/4576.b93cf4f2.160x160o.png",
    members_count: 14000,
    description:
      "Serious training club focused on opening theory, classical endgames, and mutual tournament preparation.",
  },
  {
    id: "chess-com-developer-community",
    name: "Chess.com Developer Community",
    url: "https://www.chess.com/club/chess-com-developer-community",
    icon: "https://images.chesscomfiles.com/uploads/v1/group/38150.3a216d29.160x160o.png",
    members_count: 8500,
    description:
      "Builders, data scientists, and engineers utilizing the Chess.com public API to craft next-generation chess tools.",
  },
];

export default function ClubsPage() {
  const router = useRouter();
  const [searchSlug, setSearchSlug] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const clean = searchSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (clean) {
      router.push(`/clubs/${clean}`);
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Club Collectives
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
            Chess Clubs & <span className="text-accent">Club DNA</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Just like individual players, chess clubs develop a shared identity. Search any Chess.com club or explore featured communities.
          </p>
        </div>

        {/* Club Search Bar */}
        <div className="max-w-2xl mx-auto bg-card border border-border p-3 sm:p-4 rounded-2xl shadow-xl">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                placeholder="Enter Chess.com club slug (e.g. chessbrah, team-usa)..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-background font-bold rounded-xl text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Inspect Club
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2.5 text-[11px] text-muted-foreground px-2">
            Tip: Club slug is found in the Chess.com club URL: <code className="text-accent">chess.com/club/[slug]</code>
          </div>
        </div>

        {/* Featured Clubs Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-accent">
                Curated
              </span>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Featured Communities
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_CLUBS.map((c) => (
              <ClubCard
                key={c.id}
                club={{
                  id: c.id,
                  name: c.name,
                  icon: c.icon,
                  url: c.url,
                }}
                memberCount={c.members_count}
                description={c.description}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
