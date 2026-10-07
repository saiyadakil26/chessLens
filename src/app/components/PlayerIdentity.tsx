"use client";

import React from "react";

export interface PlayerIdentityProps {
  username: string;
  rating: number | string;
  color: "white" | "black";
  isUser: boolean;
  resultText?: string; // "WIN", "LOSS", "DRAW", or ""
  isCurrentTurn?: boolean;
}

export default function PlayerIdentity({
  username,
  rating,
  color,
  isUser,
  resultText,
  isCurrentTurn = false,
}: PlayerIdentityProps) {
  const isWhite = color === "white";
  const pieceIcon = isWhite ? "♔" : "♚";
  const colorLabel = isWhite ? "WHITE" : "BLACK";

  // Result badge styling
  let resultBadgeClass = "";
  if (resultText === "WIN") {
    resultBadgeClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
  } else if (resultText === "LOSS") {
    resultBadgeClass = "bg-red-500/15 text-red-400 border-red-500/30";
  } else if (resultText === "DRAW") {
    resultBadgeClass = "bg-zinc-700/40 text-zinc-300 border-zinc-600/50";
  }

  const ariaDescription = `${username}, ${colorLabel}${isUser ? ", you" : ""}${
    rating !== "?" ? `, rating ${rating}` : ""
  }${resultText ? `, ${resultText.toLowerCase()}` : ""}`;

  return (
    <div
      role="region"
      aria-label={ariaDescription}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all duration-200 select-none ${
        isCurrentTurn
          ? "bg-zinc-800/80 border-accent/60 shadow-md ring-1 ring-accent/30"
          : "bg-card/75 border-border/70"
      }`}
    >
      {/* Left: Piece icon + Name & Subtitle */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`text-xl sm:text-2xl leading-none flex items-center justify-center w-7 h-7 rounded-lg ${
            isWhite
              ? "text-zinc-100 bg-zinc-800/80 border border-zinc-700/60"
              : "text-zinc-300 bg-zinc-900 border border-zinc-800"
          }`}
          aria-hidden="true"
        >
          {pieceIcon}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-xs sm:text-sm text-foreground truncate">
              {username}
            </span>
            {rating && rating !== "?" && (
              <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                ({rating})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider">
            {isUser && (
              <span className="text-accent bg-accent/15 px-1.5 py-0.2 rounded font-extrabold">
                YOU
              </span>
            )}
            <span className="text-muted-foreground font-semibold">
              {isUser ? `· ${colorLabel}` : colorLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Result Tag (WIN / LOSS / DRAW) and/or Turn Indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isCurrentTurn && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            To Move
          </span>
        )}

        {resultText && (
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-widest border uppercase font-mono shadow-sm ${resultBadgeClass}`}
          >
            {resultText}
          </span>
        )}
      </div>
    </div>
  );
}
