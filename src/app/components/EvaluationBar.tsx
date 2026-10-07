"use client";

import { useMemo } from "react";

interface EvaluationBarProps {
  evaluation: number; // in pawns from White's perspective (e.g. +1.50)
  mate?: number | null; // e.g. 3 for +M3, -2 for -M2
  isFlipped?: boolean; // if board is flipped to Black's perspective
}

export default function EvaluationBar({
  evaluation,
  mate = null,
  isFlipped = false,
}: EvaluationBarProps) {
  // Convert pawn evaluation (-10 to +10) into white height percentage (0 to 100)
  const whitePercentage = useMemo(() => {
    if (mate !== null && mate !== undefined) {
      return mate > 0 ? 100 : 0;
    }
    // Sigmoid mapping for smooth, non-linear bar transitions
    // +5 pawns is ~85%, +10 pawns is ~95%, 0 is 50%
    const capped = Math.max(-15, Math.min(15, evaluation));
    const winChance = 1 / (1 + Math.pow(10, -capped / 4));
    return Math.max(5, Math.min(95, winChance * 100));
  }, [evaluation, mate]);

  // Formatted numerical label
  const evalLabel = useMemo(() => {
    if (mate !== null && mate !== undefined) {
      return mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`;
    }
    if (Math.abs(evaluation) < 0.05) return "0.0";
    return evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1);
  }, [evaluation, mate]);

  // The bar fills White from bottom up (or Black if flipped)
  const fillHeight = isFlipped ? 100 - whitePercentage : whitePercentage;

  return (
    <div
      className="w-8 sm:w-10 h-full min-h-[360px] max-h-[520px] bg-[#27272a] rounded-xl overflow-hidden border border-border flex flex-col justify-between relative shadow-lg select-none"
      title={`Current Engine Evaluation: ${evalLabel}`}
    >
      {/* Top Value (when Black is winning and orientation is normal, or White if flipped) */}
      <div className="absolute top-2 left-0 right-0 text-center z-10 pointer-events-none">
        <span
          className={`text-[10px] sm:text-xs font-mono font-black ${
            fillHeight < 50 ? "text-white" : "text-zinc-900"
          }`}
        >
          {!isFlipped && evaluation < 0 ? evalLabel : isFlipped && evaluation > 0 ? evalLabel : ""}
        </span>
      </div>

      {/* Dynamic Fill Level (White side) */}
      <div className="w-full h-full bg-[#18181b] flex flex-col justify-end relative">
        <div
          className="w-full bg-[#f4f4f5] transition-all duration-300 ease-out flex items-center justify-center relative shadow-inner"
          style={{ height: `${fillHeight}%` }}
        >
          {/* Subtle marker at center (50% mark = dead equal) */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-accent/40" />
        </div>
      </div>

      {/* Bottom Value (when White is winning and orientation is normal, or Black if flipped) */}
      <div className="absolute bottom-2 left-0 right-0 text-center z-10 pointer-events-none">
        <span
          className={`text-[10px] sm:text-xs font-mono font-black ${
            fillHeight >= 50 ? "text-zinc-900" : "text-white"
          }`}
        >
          {!isFlipped && evaluation >= 0 ? evalLabel : isFlipped && evaluation < 0 ? evalLabel : ""}
        </span>
      </div>
    </div>
  );
}
