"use client";

import React from "react";
import { MoveClassification } from "@/lib/chessEngine";

export interface MoveQualityBadgeProps {
  classification: MoveClassification;
  moveSan: string;
  moveNumber: number;
  evalBefore: number;
  evalAfter: number;
  bestMoveSan?: string;
  explanation?: string;
}

export interface BadgeStyleConfig {
  label: string;
  symbol: string;
  bgGradient: string;
  textColor: string;
  glowColor: string;
  ariaLabel: string;
}

export const BADGE_CONFIG: Record<MoveClassification, BadgeStyleConfig> = {
  brilliant: {
    label: "Brilliant",
    symbol: "!!",
    bgGradient: "from-cyan-500 to-teal-400",
    textColor: "text-white font-black",
    glowColor: "rgba(6, 182, 212, 0.5)",
    ariaLabel: "Brilliant move",
  },
  excellent: {
    label: "Best / Excellent",
    symbol: "★",
    bgGradient: "from-emerald-500 to-green-500",
    textColor: "text-white font-black",
    glowColor: "rgba(16, 185, 129, 0.45)",
    ariaLabel: "Best move",
  },
  strong: {
    label: "Excellent",
    symbol: "✓",
    bgGradient: "from-emerald-600 to-teal-600",
    textColor: "text-white font-black",
    glowColor: "rgba(16, 185, 129, 0.35)",
    ariaLabel: "Excellent move",
  },
  solid: {
    label: "Good",
    symbol: "●",
    bgGradient: "from-blue-500 to-indigo-500",
    textColor: "text-white font-black",
    glowColor: "rgba(59, 130, 246, 0.3)",
    ariaLabel: "Good move",
  },
  inaccuracy: {
    label: "Inaccuracy",
    symbol: "?!",
    bgGradient: "from-amber-400 to-yellow-500",
    textColor: "text-black font-black",
    glowColor: "rgba(245, 158, 11, 0.4)",
    ariaLabel: "Inaccuracy",
  },
  mistake: {
    label: "Mistake",
    symbol: "?",
    bgGradient: "from-orange-500 to-amber-600",
    textColor: "text-white font-black",
    glowColor: "rgba(249, 115, 22, 0.45)",
    ariaLabel: "Mistake",
  },
  blunder: {
    label: "Blunder",
    symbol: "??",
    bgGradient: "from-red-600 to-rose-700",
    textColor: "text-white font-black",
    glowColor: "rgba(225, 29, 72, 0.55)",
    ariaLabel: "Blunder",
  },
};

export default function MoveQualityBadge({
  classification,
  moveSan,
  moveNumber,
  evalBefore,
  evalAfter,
  bestMoveSan,
  explanation,
}: MoveQualityBadgeProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const config = BADGE_CONFIG[classification] || BADGE_CONFIG.solid;

  const evalShift = (evalAfter - evalBefore).toFixed(2);
  const evalFormatted = Number(evalShift) > 0 ? `+${evalShift}` : evalShift;

  return (
    <div
      className="absolute top-0.5 right-0.5 z-30 pointer-events-auto select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShowTooltip((v) => !v);
      }}
      role="status"
      aria-label={`${config.ariaLabel}: ${moveNumber}. ${moveSan}`}
      tabIndex={0}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShowTooltip((v) => !v);
        }
      }}
    >
      {/* Badge Button on Piece */}
      <div
        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${config.bgGradient} ${config.textColor} border border-white/70 flex items-center justify-center text-[9px] sm:text-[11px] md:text-xs tracking-tighter cursor-pointer shadow-lg transform transition-transform duration-150 hover:scale-115 active:scale-95`}
        style={{
          boxShadow: `0 2px 6px ${config.glowColor}, inset 0 1px 1px rgba(255,255,255,0.4)`,
        }}
      >
        <span className="leading-none drop-shadow-sm select-none">
          {config.symbol}
        </span>
      </div>

      {/* Hover / Click Tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute right-0 top-full mt-2 w-48 sm:w-56 p-2.5 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl shadow-2xl text-white text-xs z-50 pointer-events-none"
        >
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-zinc-700/60 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${config.bgGradient} ${config.textColor}`}
              >
                {config.symbol}
              </span>
              <span className="font-bold text-[11px] tracking-wide text-zinc-100">
                {config.label}
              </span>
            </div>
            <span className="font-mono font-bold text-zinc-400 text-[11px]">
              {moveNumber}. {moveSan}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400">Eval Shift:</span>
              <span className="font-mono font-semibold">
                {evalBefore > 0 ? `+${evalBefore}` : evalBefore} →{" "}
                <span className={Number(evalShift) < -0.5 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                  {evalAfter > 0 ? `+${evalAfter}` : evalAfter} ({evalFormatted})
                </span>
              </span>
            </div>

            {bestMoveSan && ["inaccuracy", "mistake", "blunder"].includes(classification) && (
              <div className="flex items-center justify-between text-zinc-300 pt-1 border-t border-zinc-800">
                <span className="text-zinc-400">Best Move:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-500/30">
                  {bestMoveSan}
                </span>
              </div>
            )}

            {explanation && (
              <p className="text-[10px] text-zinc-400 leading-tight pt-1">
                {explanation}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
