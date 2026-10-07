"use client";

import Link from "next/link";
import { ChessGame } from "@/lib/chessApi";
import { Trophy, Skull, Handshake, Timer, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface GameCardProps {
  game: ChessGame;
  targetUsername: string;
}

export default function GameCard({ game, targetUsername }: GameCardProps) {
  const isWhite = game.white.username.toLowerCase() === targetUsername.toLowerCase();
  const player = isWhite ? game.white : game.black;
  const opponent = isWhite ? game.black : game.white;

  // Extract game ID from URL or UUID
  const gameId = game.url ? game.url.split("/").pop() || game.uuid : game.uuid;

  // Determine game outcome from player's perspective
  const playerResult = player.result;
  const isWin = playerResult === "win";
  const isDraw = [
    "agreed",
    "repetition",
    "stalemate",
    "timevsinsufficient",
    "insufficient",
    "50move",
  ].includes(playerResult);

  // Extract Opening Name from PGN
  const openingMatch = game.pgn ? game.pgn.match(/\[ECOUrl ".*?\/openings\/(.*?)"\]/) : null;
  const openingName = openingMatch && openingMatch[1]
    ? openingMatch[1].replace(/-/g, " ")
    : "Standard Opening";

  // Check if analysis is already cached in localStorage
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(`chessdna_analysis_${gameId}`);
      if (cached) setIsAnalyzed(true);
    }
  }, [gameId]);

  const dateStr = game.end_time
    ? new Date(game.end_time * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-md hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Result Banner */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isWin
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : isDraw
                  ? "bg-zinc-500/15 text-zinc-300 border border-zinc-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
              }`}
            >
              {isWin ? (
                <>
                  <Trophy className="w-3.5 h-3.5" /> WIN
                </>
              ) : isDraw ? (
                <>
                  <Handshake className="w-3.5 h-3.5" /> DRAW
                </>
              ) : (
                <>
                  <Skull className="w-3.5 h-3.5" /> LOSS
                </>
              )}
            </span>

            <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[11px] font-mono text-muted-foreground capitalize">
              {game.time_class} • {game.time_control}
            </span>
          </div>

          {isAnalyzed ? (
            <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-accent/30">
              <Sparkles className="w-3 h-3" /> Analyzed
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Ready
            </span>
          )}
        </div>

        {/* Players Matchup */}
        <div className="space-y-2 mb-4">
          {/* Player Row */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border/70">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${
                  isWhite ? "bg-white border-zinc-400" : "bg-zinc-900 border-zinc-600"
                }`}
                title={isWhite ? "White" : "Black"}
              />
              <span className="font-extrabold text-sm text-foreground truncate">
                {player.username}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-accent">
              {player.rating}
            </span>
          </div>

          {/* Opponent Row */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-background/30 border border-border/50 text-muted-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${
                  !isWhite ? "bg-white border-zinc-400" : "bg-zinc-900 border-zinc-600"
                }`}
                title={!isWhite ? "White" : "Black"}
              />
              <span className="font-semibold text-sm truncate">
                {opponent.username}
              </span>
            </div>
            <span className="font-mono text-xs">
              {opponent.rating}
            </span>
          </div>
        </div>

        {/* Game Details Metadata */}
        <div className="text-xs text-muted-foreground space-y-1 mb-5">
          <div className="font-medium text-foreground truncate capitalize">
            {openingName}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {dateStr}
            </span>
            <span>•</span>
            <span className="capitalize">{playerResult}</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href={`/games/${targetUsername}/${gameId}`}
        className="w-full py-2.5 px-4 bg-background hover:bg-accent hover:text-background border border-border group-hover:border-accent text-foreground text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        <span>Analyze Game</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
