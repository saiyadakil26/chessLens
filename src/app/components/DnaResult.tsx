"use client";

import { motion } from "framer-motion";
import { Download, Share2, ChevronLeft, Swords, Users, ExternalLink, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { AnalysisResult } from "@/lib/chessAnalyzer";
import { ChessProfile, getPlayerClubs, ClubSummary } from "@/lib/chessApi";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";

export default function DnaResult({ result, profile }: { result: AnalysisResult, profile: ChessProfile }) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [clubs, setClubs] = useState<ClubSummary[]>([]);

  useEffect(() => {
    getPlayerClubs(profile.username).then((c) => setClubs(c.slice(0, 4)));
  }, [profile.username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const el = document.getElementById("share-card");
    if (!el) return;
    try {
      setSharing(true);
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#09090b" });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `chessdna-${profile.username}.png`;
      a.click();
    } finally {
      setSharing(false);
    }
  };

  const DnaBar = ({ label, value, color }: { label: string, value: number, color?: string }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold text-accent">{value}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2.5 rounded-full ${color || 'bg-accent'}`}
        ></motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Analyze another player
      </Link>

      {/* Shareable Card ID */}
      <div id="share-card" className="bg-card border border-border rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
              {profile.username}'s DNA
            </h1>
            <h2 className="text-4xl md:text-5xl font-black text-accent mb-6 leading-tight">
              {result.archetype.name}
            </h2>
            <p className="text-lg text-foreground/90 italic mb-8 border-l-4 border-accent pl-4">
              "{result.archetype.description}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8">
              <DnaBar label="Aggression" value={result.dna.aggression} />
              <DnaBar label="Tactics" value={result.dna.tactics} />
              <DnaBar label="Risk" value={result.dna.risk} />
              <DnaBar label="Defense" value={result.dna.defense} />
              <DnaBar label="Endgame" value={result.dna.endgame} />
              <DnaBar label="Speed" value={result.dna.speed} />
            </div>
            
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mt-4">
              Based on {result.gameCount} recent games
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Performance</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-background rounded-lg p-3">
              <div className="text-2xl font-black text-green-500">{result.wins}</div>
              <div className="text-xs text-muted-foreground uppercase">Wins</div>
            </div>
            <div className="bg-background rounded-lg p-3">
              <div className="text-2xl font-black text-red-500">{result.losses}</div>
              <div className="text-xs text-muted-foreground uppercase">Losses</div>
            </div>
            <div className="bg-background rounded-lg p-3 col-span-2">
              <div className="text-2xl font-black">{result.winRate}%</div>
              <div className="text-xs text-muted-foreground uppercase">Win Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Favorite Opening</h3>
          <div className="flex flex-col items-center justify-center h-full pb-6 text-center">
            {result.favoriteOpening ? (
              <>
                <div className="text-xl font-bold mb-2 text-accent">{result.favoriteOpening.name}</div>
                <div className="text-4xl font-black mb-1">{result.favoriteOpening.count}</div>
                <div className="text-sm text-muted-foreground uppercase">Games Played</div>
                <div className="mt-4 text-sm font-medium px-3 py-1 bg-background rounded-full">
                  {result.favoriteOpening.winRate}% Win Rate
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">No clear favorite opening detected.</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Your Signature</h3>
          <div className="flex items-center justify-center h-full pb-6">
            <p className="text-lg font-medium text-center">
              "{result.signatureHabit}"
            </p>
          </div>
        </div>
      </div>

      {/* Clubs Showcase */}
      {clubs.length > 0 && (
        <div className="mt-8 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            <Users className="w-4 h-4 text-accent" />
            Club Memberships
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {clubs.map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${club.id}`}
                className="p-3 bg-background/60 hover:bg-background border border-border/80 hover:border-accent/40 rounded-xl transition-all flex flex-col justify-between group"
              >
                <div className="text-xs font-bold text-foreground group-hover:text-accent transition-colors truncate">
                  {club.name}
                </div>
                <span className="text-[10px] text-accent mt-2 flex items-center gap-1 font-semibold">
                  Inspect Club DNA →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center mt-12">
        <Link 
          href={`/games/${profile.username}`}
          className="flex items-center px-6 py-3 bg-accent hover:bg-accent-hover text-background font-bold rounded-full transition-colors shadow-lg"
        >
          <Gamepad2 className="w-4 h-4 mr-2" />
          Analyze Completed Games
        </Link>
        <Link 
          href="/community#compare"
          className="flex items-center px-6 py-3 bg-card border border-accent/40 hover:border-accent font-bold rounded-full transition-colors text-accent shadow-sm"
        >
          <Swords className="w-4 h-4 mr-2" />
          Compare Against Rival
        </Link>
        <Link 
          href={`/graveyard/${profile.username}`}
          className="flex items-center px-6 py-3 bg-card border border-border hover:bg-muted font-bold rounded-full transition-colors text-red-400"
        >
          View Chess Graveyard
        </Link>
        <button 
          onClick={handleDownload}
          disabled={sharing}
          className="flex items-center px-6 py-3 bg-accent hover:bg-accent-hover text-background font-bold rounded-full transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          {sharing ? "Generating..." : "Download Card"}
        </button>
        <button 
          onClick={handleCopyLink}
          className="flex items-center px-6 py-3 bg-card border border-border hover:bg-muted font-bold rounded-full transition-colors"
        >
          <Share2 className="w-5 h-5 mr-2" />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
