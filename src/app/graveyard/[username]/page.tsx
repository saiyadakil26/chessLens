"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { getProfile, getRecentGames, ChessProfile } from "@/lib/chessApi";
import { analyzeGames, AnalysisResult } from "@/lib/chessAnalyzer";
import Link from "next/link";
import { ChevronLeft, Skull, ExternalLink } from "lucide-react";

function GraveyardContent() {
  const params = useParams();
  const username = params.username as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ChessProfile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const prof = await getProfile(username);
        if (!prof) {
          if (isMounted) { setError("Profile not found"); setLoading(false); }
          return;
        }
        setProfile(prof);
        
        const games = await getRecentGames(username, 100);
        const analysis = analyzeGames(username, games);
        
        if (isMounted) {
          setResult(analysis);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) { setError("Failed to load graveyard"); setLoading(false); }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [username]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-accent">Digging up the graves...</div></div>;
  }

  if (error || !result || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const gy = result.graveyard;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto bg-background">
      <Link href={`/dna/${username}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to DNA Profile
      </Link>

      <div className="mb-12 text-center">
        <Skull className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase text-muted-foreground">
          {profile.username}'s <span className="text-foreground">Graveyard</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Every chess player has skeletons in their closet. Here are your worst blunders and fastest disasters from your recent games.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Skull className="w-6 h-6 mr-3 text-red-500" />
            The Fastest Disaster
          </h2>
          
          {gy.fastestLoss ? (
            <div>
              <p className="text-muted-foreground mb-6">
                You resigned or were mated in just <strong className="text-foreground text-xl">{gy.fastestLoss.moves} moves</strong>.
              </p>
              <div className="bg-background p-4 rounded-xl border border-border mb-6">
                <div className="text-sm text-muted-foreground uppercase mb-1">Opening</div>
                <div className="font-bold text-accent">{gy.fastestLoss.opening}</div>
              </div>
              <a href={gy.fastestLoss.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                View Game on Chess.com <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          ) : (
            <p className="text-muted-foreground">No recent fast losses found. Impressive.</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-900/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Skull className="w-6 h-6 mr-3 text-orange-500" />
            Biggest Upset
          </h2>
          
          {gy.biggestUpset ? (
            <div>
              <p className="text-muted-foreground mb-6">
                You lost to a player rated <strong className="text-foreground text-xl">{gy.biggestUpset.ratingDiff} points</strong> lower than you.
              </p>
              <div className="bg-background p-4 rounded-xl border border-border mb-6">
                <div className="text-sm text-muted-foreground uppercase mb-1">Opponent Rating</div>
                <div className="font-bold text-accent">{gy.biggestUpset.opponentRating}</div>
              </div>
              <a href={gy.biggestUpset.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                View Game on Chess.com <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          ) : (
            <p className="text-muted-foreground">You don't lose to lower-rated players often. Well done.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GraveyardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-accent animate-pulse">Initializing...</div>}>
      <GraveyardContent />
    </Suspense>
  );
}
