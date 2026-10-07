import { Suspense } from "react";
import { Metadata } from "next";
import { getLeaderboards } from "@/lib/chessApi";
import DnaCompare from "@/app/components/DnaCompare";
import ArchetypeGallery from "@/app/components/ArchetypeGallery";
import CommunityLeaderboard from "@/app/components/CommunityLeaderboard";
import { Users, Swords, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Community & DNA Clash | ChessDNA",
  description:
    "Explore playing styles, compare Chess DNA head-to-head, and discover the Hall of Legends.",
};

async function CommunityContent() {
  const leaderboards = await getLeaderboards();

  return (
    <div className="space-y-16">
      {/* 1. Head-to-Head Compare Section */}
      <section id="compare">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-accent text-xs uppercase font-bold tracking-widest mb-1.5">
            <Swords className="w-4 h-4" />
            Stylistic Showdown
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Compare Any Two Players
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Pick two rivals or compare yourself against a Grandmaster. We overlay both DNA radar charts to predict the clash.
          </p>
        </div>
        <DnaCompare initialUser1="magnuscarlsen" initialUser2="hikaru" />
      </section>

      {/* 2. Archetype Explorer */}
      <section id="archetypes">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-accent text-xs uppercase font-bold tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4" />
            The 8 Archetypes
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Chess DNA Archetype Gallery
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Every chess player has a core instinct. Which psychological style defines your board decisions?
          </p>
        </div>
        <ArchetypeGallery />
      </section>

      {/* 3. Community Hall of Legends */}
      <section id="leaderboard">
        <CommunityLeaderboard leaderboards={leaderboards} />
      </section>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            Phase 3 Community Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
            The ChessDNA <span className="text-accent">Community</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore styles across the chess ecosystem. Compare rivalries, uncover archetypes, and analyze top players.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-16 text-center text-accent animate-pulse font-medium">
              Loading Community Hub...
            </div>
          }
        >
          <CommunityContent />
        </Suspense>
      </div>
    </main>
  );
}
