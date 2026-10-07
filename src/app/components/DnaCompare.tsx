"use client";

import { useState } from "react";
import { getProfile, getRecentGames, ChessProfile } from "@/lib/chessApi";
import { analyzeGames, AnalysisResult } from "@/lib/chessAnalyzer";
import { compareDna, MatchupAnalysis } from "@/lib/matchupAnalyzer";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Swords, ArrowRight, Loader2, Sparkles, Trophy, ShieldAlert } from "lucide-react";
import Image from "next/image";

interface CompareResultData {
  p1: {
    profile: ChessProfile;
    analysis: AnalysisResult;
  };
  p2: {
    profile: ChessProfile;
    analysis: AnalysisResult;
  };
  matchup: MatchupAnalysis;
}

export default function DnaCompare({
  initialUser1 = "",
  initialUser2 = "",
}: {
  initialUser1?: string;
  initialUser2?: string;
}) {
  const [user1, setUser1] = useState(initialUser1);
  const [user2, setUser2] = useState(initialUser2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResultData | null>(null);

  const presets = [
    { u1: "magnuscarlsen", u2: "hikaru", label: "Magnus vs Hikaru" },
    { u1: "gothamchess", u2: "danielnaroditsky", label: "Gotham vs Danya" },
    { u1: "firouzja2003", u2: "fabianocaruana", label: "Alireza vs Caruana" },
  ];

  async function handleCompare(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const u1 = user1.trim();
    const u2 = user2.trim();

    if (!u1 || !u2) {
      setError("Please provide two Chess.com usernames to compare.");
      return;
    }

    if (u1.toLowerCase() === u2.toLowerCase()) {
      setError("Please enter two different usernames for a head-to-head match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parallel fetch for both players
      const [prof1, prof2] = await Promise.all([
        getProfile(u1),
        getProfile(u2),
      ]);

      if (!prof1) {
        setError(`Could not find Chess.com player: "${u1}"`);
        setLoading(false);
        return;
      }

      if (!prof2) {
        setError(`Could not find Chess.com player: "${u2}"`);
        setLoading(false);
        return;
      }

      const [games1, games2] = await Promise.all([
        getRecentGames(u1, 60),
        getRecentGames(u2, 60),
      ]);

      if (games1.length === 0) {
        setError(`No recent public games found for ${u1}.`);
        setLoading(false);
        return;
      }

      if (games2.length === 0) {
        setError(`No recent public games found for ${u2}.`);
        setLoading(false);
        return;
      }

      const analysis1 = analyzeGames(u1, games1);
      const analysis2 = analyzeGames(u2, games2);

      const matchup = compareDna(prof1.username, analysis1, prof2.username, analysis2);

      setResult({
        p1: { profile: prof1, analysis: analysis1 },
        p2: { profile: prof2, analysis: analysis2 },
        matchup,
      });
    } catch {
      setError("Failed to fetch player data. Please check usernames and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Format data for Recharts Radar
  const radarData = result
    ? [
        {
          trait: "Aggression",
          [result.p1.profile.username]: result.p1.analysis.dna.aggression,
          [result.p2.profile.username]: result.p2.analysis.dna.aggression,
        },
        {
          trait: "Tactics",
          [result.p1.profile.username]: result.p1.analysis.dna.tactics,
          [result.p2.profile.username]: result.p2.analysis.dna.tactics,
        },
        {
          trait: "Risk",
          [result.p1.profile.username]: result.p1.analysis.dna.risk,
          [result.p2.profile.username]: result.p2.analysis.dna.risk,
        },
        {
          trait: "Defense",
          [result.p1.profile.username]: result.p1.analysis.dna.defense,
          [result.p2.profile.username]: result.p2.analysis.dna.defense,
        },
        {
          trait: "Endgame",
          [result.p1.profile.username]: result.p1.analysis.dna.endgame,
          [result.p2.profile.username]: result.p2.analysis.dna.endgame,
        },
        {
          trait: "Speed",
          [result.p1.profile.username]: result.p1.analysis.dna.speed,
          [result.p2.profile.username]: result.p2.analysis.dna.speed,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Comparison Input Form */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              DNA Head-to-Head Clash
            </h3>
            <p className="text-xs text-muted-foreground">
              Compare playing styles, radar traces, and predict the stylistic edge.
            </p>
          </div>
        </div>

        <form onSubmit={handleCompare} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                Player 1 Username
              </label>
              <input
                type="text"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                placeholder="e.g. magnuscarlsen"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                Player 2 Username
              </label>
              <input
                type="text"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                placeholder="e.g. hikaru"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-muted-foreground">Try rivalry:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setUser1(p.u1);
                  setUser2(p.u2);
                }}
                className="px-2.5 py-1 bg-background hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-7 py-3 bg-accent hover:bg-accent-hover text-background font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Both Profiles...
              </>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                Compare DNA Matchup
              </>
            )}
          </button>
        </form>
      </div>

      {/* Comparison Results Card */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Player Badges Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 Card */}
            <div className="bg-card border-2 border-accent/40 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent flex items-center justify-center font-bold text-accent text-xl flex-shrink-0 overflow-hidden">
                {result.p1.profile.avatar ? (
                  <Image
                    src={result.p1.profile.avatar}
                    alt={result.p1.profile.username}
                    width={56}
                    height={56}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  result.p1.profile.username.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-foreground truncate">
                    {result.p1.profile.username}
                  </span>
                  {result.p1.profile.title && (
                    <span className="px-1.5 py-0.5 bg-accent/20 text-accent font-bold text-[10px] rounded">
                      {result.p1.profile.title}
                    </span>
                  )}
                </div>
                <div className="text-xs text-accent font-semibold">
                  {result.p1.analysis.archetype.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Win Rate: {result.p1.analysis.winRate}% across{" "}
                  {result.p1.analysis.gameCount} games
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Trace Color
                </span>
                <div className="w-4 h-4 rounded-full bg-accent mx-auto mt-1" />
              </div>
            </div>

            {/* Player 2 Card */}
            <div className="bg-card border-2 border-emerald-500/40 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-xl flex-shrink-0 overflow-hidden">
                {result.p2.profile.avatar ? (
                  <Image
                    src={result.p2.profile.avatar}
                    alt={result.p2.profile.username}
                    width={56}
                    height={56}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  result.p2.profile.username.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-foreground truncate">
                    {result.p2.profile.username}
                  </span>
                  {result.p2.profile.title && (
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded">
                      {result.p2.profile.title}
                    </span>
                  )}
                </div>
                <div className="text-xs text-emerald-400 font-semibold">
                  {result.p2.analysis.archetype.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Win Rate: {result.p2.analysis.winRate}% across{" "}
                  {result.p2.analysis.gameCount} games
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Trace Color
                </span>
                <div className="w-4 h-4 rounded-full bg-emerald-400 mx-auto mt-1" />
              </div>
            </div>
          </div>

          {/* Radar Chart & Stylistic Verdict Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Radar Overlay */}
            <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col items-center">
              <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">
                Overlaid DNA Radar Spectrum
              </h4>
              <div className="w-full h-[320px] sm:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis
                      dataKey="trait"
                      stroke="#a1a1aa"
                      tick={{ fill: "#d4d4d8", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke="#3f3f46"
                      tick={{ fill: "#71717a", fontSize: 10 }}
                    />
                    <Radar
                      name={result.p1.profile.username}
                      dataKey={result.p1.profile.username}
                      stroke="#D4AF37"
                      fill="#D4AF37"
                      fillOpacity={0.35}
                    />
                    <Radar
                      name={result.p2.profile.username}
                      dataKey={result.p2.profile.username}
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.35}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#27272a",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Matchup Breakdown Card */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 text-accent mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">
                    Stylistic Clash Analysis
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-foreground mb-2">
                  {result.matchup.keyClash}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {result.matchup.clashDescription}
                </p>

                <div className="p-4 rounded-xl bg-background border border-border/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Trophy className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold uppercase text-foreground">
                      Matchup Verdict
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {result.matchup.verdict}
                  </p>
                </div>
              </div>

              {/* Trait Leaders */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-1">
                  Trait Differentials
                </h4>
                {result.matchup.traits.map((t) => (
                  <div key={t.name} className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground font-medium">
                        {t.name}
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {t.leader === "p1" ? (
                          <span className="text-accent">
                            +{Math.abs(t.diff)} ({result.p1.profile.username})
                          </span>
                        ) : t.leader === "p2" ? (
                          <span className="text-emerald-400">
                            +{Math.abs(t.diff)} ({result.p2.profile.username})
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Tied</span>
                        )}
                      </span>
                    </div>
                    {/* Comparison bar */}
                    <div className="h-1.5 bg-background rounded-full overflow-hidden flex">
                      <div
                        className="bg-accent transition-all duration-300"
                        style={{
                          width: `${(t.p1Value / (t.p1Value + t.p2Value || 1)) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-emerald-400 transition-all duration-300"
                        style={{
                          width: `${(t.p2Value / (t.p1Value + t.p2Value || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
