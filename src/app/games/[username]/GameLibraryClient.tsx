"use client";

import { useState, useMemo } from "react";
import { ChessProfile, ChessGame } from "@/lib/chessApi";
import GameCard from "@/app/components/GameCard";
import { Search, Trophy, Timer, Filter, ArrowUpDown, Gamepad2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface GameLibraryClientProps {
  profile: ChessProfile;
  initialGames: ChessGame[];
  targetUsername: string;
}

export default function GameLibraryClient({
  profile,
  initialGames,
  targetUsername,
}: GameLibraryClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState<"all" | "win" | "loss" | "draw">("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter & Search Logic
  const filteredGames = useMemo(() => {
    let result = [...initialGames];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((g) => {
        const opponent =
          g.white.username.toLowerCase() === targetUsername.toLowerCase()
            ? g.black.username
            : g.white.username;
        const pgn = g.pgn ? g.pgn.toLowerCase() : "";
        return opponent.toLowerCase().includes(term) || pgn.includes(term);
      });
    }

    // Result filter
    if (resultFilter !== "all") {
      result = result.filter((g) => {
        const isWhite = g.white.username.toLowerCase() === targetUsername.toLowerCase();
        const playerResult = isWhite ? g.white.result : g.black.result;
        const isWin = playerResult === "win";
        const isDraw = [
          "agreed",
          "repetition",
          "stalemate",
          "timevsinsufficient",
          "insufficient",
          "50move",
        ].includes(playerResult);

        if (resultFilter === "win") return isWin;
        if (resultFilter === "draw") return isDraw;
        if (resultFilter === "loss") return !isWin && !isDraw;
        return true;
      });
    }

    // Time class filter
    if (timeFilter !== "all") {
      result = result.filter((g) => g.time_class === timeFilter);
    }

    // Sort order
    if (sortOrder === "oldest") {
      result.sort((a, b) => a.end_time - b.end_time);
    } else {
      result.sort((a, b) => b.end_time - a.end_time);
    }

    return result;
  }, [initialGames, targetUsername, searchTerm, resultFilter, timeFilter, sortOrder]);

  const displayedGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  return (
    <div className="space-y-8">
      {/* Player Header Banner */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent/20 border border-accent flex items-center justify-center font-bold text-accent text-2xl flex-shrink-0 overflow-hidden shadow-md">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.username}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              profile.username.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-accent">
                Completed Game Library
              </span>
              {profile.title && (
                <span className="px-1.5 py-0.5 bg-accent/20 text-accent font-bold text-[10px] rounded">
                  {profile.title}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground">
              {profile.username}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Showing {filteredGames.length} available public completed games
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dna/${profile.username}`}
            className="px-4 py-2.5 bg-background hover:bg-muted border border-border rounded-xl text-xs font-bold text-foreground transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            View Chess DNA
          </Link>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search opponent username or opening name..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-xs font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Sort order toggle */}
          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border text-xs">
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                sortOrder === "newest"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                sortOrder === "oldest"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Oldest First
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs">
          {/* Outcome Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase mr-1">
              Result:
            </span>
            {(["all", "win", "loss", "draw"] as const).map((res) => (
              <button
                key={res}
                onClick={() => setResultFilter(res)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  resultFilter === res
                    ? "bg-accent/20 text-accent border border-accent/40"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {res === "all" ? "All" : res === "win" ? "Wins" : res === "loss" ? "Losses" : "Draws"}
              </button>
            ))}
          </div>

          {/* Time Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase mr-1">
              Format:
            </span>
            {["all", "blitz", "rapid", "bullet", "daily"].map((tc) => (
              <button
                key={tc}
                onClick={() => setTimeFilter(tc)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  timeFilter === tc
                    ? "bg-accent/20 text-accent border border-accent/40"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {displayedGames.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <Gamepad2 className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-foreground">No Matching Games</h3>
          <p className="text-xs text-muted-foreground">
            No completed games matched your current search and filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setResultFilter("all");
              setTimeFilter("all");
            }}
            className="px-4 py-2 bg-background border border-border text-xs font-bold text-foreground rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGames.map((game, idx) => (
            <GameCard
              key={game.url || game.uuid || idx}
              game={game}
              targetUsername={targetUsername}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-6 py-3 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
          >
            Load More Games ({filteredGames.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
