"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Gamepad2, ArrowRight, Sparkles, Brain, ShieldAlert } from "lucide-react";

export default function GamesLandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.trim().toLowerCase();
    if (clean) {
      router.push(`/games/${clean}`);
    }
  }

  const quickPlayers = [
    { name: "Magnus Carlsen", user: "magnuscarlsen" },
    { name: "Hikaru Nakamura", user: "hikaru" },
    { name: "GothamChess", user: "gothamchess" },
    { name: "Eric Rosen", user: "im-eric-rosen" },
    { name: "Daniel Naroditsky", user: "danielnaroditsky" },
  ];

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            Professional Game Analysis
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Understand Every Move <span className="text-accent">You Played</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Import your public completed Chess.com games and analyze them move by move — including evaluation, best moves, inaccuracies, mistakes, blunders, brilliant moments, and the turning points that decided the game.
          </p>
        </div>

        {/* Username Lookup Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">
                Chess.com Username
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (e.g. magnuscarlsen)..."
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-accent hover:bg-accent-hover text-background font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Browse Completed Games</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
            <span className="font-medium mr-2">Try a master:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickPlayers.map((p) => (
                <button
                  key={p.user}
                  type="button"
                  onClick={() => router.push(`/games/${p.user}`)}
                  className="px-2.5 py-1 bg-background hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Strict Historical Compliance Disclaimer */}
        <div className="max-w-xl mx-auto p-4 bg-background/60 border border-border/80 rounded-2xl flex items-start gap-3 text-xs text-muted-foreground">
          <ShieldAlert className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-foreground">Historical Game Analysis Only.</strong> This tool analyzes finished, archived public games to help players learn and improve. Never use this tool for engine assistance during active competitive games.
          </p>
        </div>
      </div>
    </main>
  );
}
