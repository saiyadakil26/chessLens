"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ChessGame } from "@/lib/chessApi";
import { FullGameAnalysis, MoveClassification } from "@/lib/chessEngine";
import { getNormalizedGameState, getPositionState } from "@/lib/gameState";
import { generateFullOpeningAnalysis } from "@/lib/openingAnalyzer";
import EvaluationBar from "./EvaluationBar";
import EvaluationGraph from "./EvaluationGraph";
import MoveQualityBadge from "./MoveQualityBadge";
import PlayerIdentity from "./PlayerIdentity";
import OpeningAnalysisSection from "./OpeningAnalysisSection";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Share2,
  RefreshCcw,
  Zap,
  ArrowRight,
  ShieldAlert,
  Flag,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";

interface GameAnalysisViewProps {
  game: ChessGame;
  analysis: FullGameAnalysis;
  targetUsername: string;
  onReanalyze?: () => void;
}

const CLASSIFICATION_META: Record<
  MoveClassification,
  { label: string; icon: string; badgeClass: string; textClass: string }
> = {
  brilliant: {
    label: "Brilliant",
    icon: "!!",
    badgeClass: "bg-cyan-950/60 text-cyan-300 border-cyan-400/50 shadow-cyan-900/30",
    textClass: "text-cyan-400",
  },
  excellent: {
    label: "Best",
    icon: "★",
    badgeClass: "bg-emerald-950/60 text-emerald-300 border-emerald-400/50 shadow-emerald-900/30",
    textClass: "text-emerald-400",
  },
  strong: {
    label: "Excellent",
    icon: "✓",
    badgeClass: "bg-teal-950/60 text-teal-300 border-teal-400/50",
    textClass: "text-teal-400",
  },
  solid: {
    label: "Good",
    icon: "●",
    badgeClass: "bg-blue-950/60 text-blue-300 border-blue-400/50",
    textClass: "text-blue-400",
  },
  inaccuracy: {
    label: "Inaccuracy",
    icon: "?!",
    badgeClass: "bg-amber-950/60 text-amber-300 border-amber-400/50",
    textClass: "text-amber-400",
  },
  mistake: {
    label: "Mistake",
    icon: "?",
    badgeClass: "bg-orange-950/60 text-orange-300 border-orange-400/50",
    textClass: "text-orange-400",
  },
  blunder: {
    label: "Blunder",
    icon: "??",
    badgeClass: "bg-red-950/60 text-red-300 border-red-500/50 shadow-red-900/30",
    textClass: "text-red-400",
  },
};

export default function GameAnalysisView({
  game,
  analysis,
  targetUsername,
  onReanalyze,
}: GameAnalysisViewProps) {
  const totalPlies = analysis.moves.length;
  const lastMoveAnalysis = totalPlies > 0 ? analysis.moves[totalPlies - 1] : null;

  // 1. Centralized Normalized Game State
  const gameState = useMemo(() => {
    return getNormalizedGameState(game, targetUsername, lastMoveAnalysis?.fenAfter);
  }, [game, targetUsername, lastMoveAnalysis?.fenAfter]);

  // 1b. Full Opening & Game Plan Analysis
  const openingAnalysis = useMemo(() => {
    return generateFullOpeningAnalysis({
      moves: analysis.moves,
      pgn: game.pgn,
      userColor: gameState.userColor,
      gameWinner: gameState.winner,
      isDraw: gameState.isDraw,
    });
  }, [analysis.moves, game.pgn, gameState.userColor, gameState.winner, gameState.isDraw]);

  // Board Orientation: default to user color if recognized, else white
  const defaultOrientation = gameState.userColor === "black" ? "black" : "white";
  const [orientation, setOrientation] = useState<"white" | "black">(defaultOrientation);
  const [currentPly, setCurrentPly] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewingBest, setPreviewingBest] = useState(false);
  const [copied, setCopied] = useState(false);

  // 2. Replay board position at currentPly
  const { currentFen, lastMoveHighlight, activeMove } = useMemo(() => {
    if (currentPly === 0) {
      return {
        currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        lastMoveHighlight: null,
        activeMove: null,
      };
    }
    const move = analysis.moves[currentPly - 1];
    if (!move) {
      return {
        currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        lastMoveHighlight: null,
        activeMove: null,
      };
    }

    let fen = move.fenAfter;
    let highlight = {
      from: move.uci.slice(0, 2),
      to: move.uci.slice(2, 4),
    };

    // If previewing best move instead of the played move
    if (previewingBest && move.bestMove && move.bestMove.length >= 4) {
      try {
        const c = new Chess(move.fenBefore);
        c.move({
          from: move.bestMove.slice(0, 2),
          to: move.bestMove.slice(2, 4),
          promotion: "q",
        });
        fen = c.fen();
        highlight = {
          from: move.bestMove.slice(0, 2),
          to: move.bestMove.slice(2, 4),
        };
      } catch {}
    }

    return {
      currentFen: fen,
      lastMoveHighlight: highlight,
      activeMove: move,
    };
  }, [currentPly, analysis.moves, previewingBest]);

  // 3. Current evaluation from White perspective
  const currentWhiteEval = activeMove ? activeMove.evalAfter : 0.0;

  // 4. Position State (turn, final position, check, checkmate, user-perspective eval)
  const posState = useMemo(() => {
    return getPositionState({
      currentPly,
      totalPlies,
      currentFen,
      whiteEval: currentWhiteEval,
      userColor: gameState.userColor,
      activeMoveSan: activeMove?.san,
      gameStatus: gameState.status,
    });
  }, [currentPly, totalPlies, currentFen, currentWhiteEval, gameState.userColor, activeMove?.san, gameState.status]);

  // Navigation handlers
  const goToPly = useCallback(
    (ply: number) => {
      setPreviewingBest(false);
      setCurrentPly(Math.max(0, Math.min(totalPlies, ply)));
    },
    [totalPlies]
  );

  const nextMove = useCallback(() => goToPly(currentPly + 1), [goToPly, currentPly]);
  const prevMove = useCallback(() => goToPly(currentPly - 1), [goToPly, currentPly]);
  const firstMove = useCallback(() => goToPly(0), [goToPly]);
  const lastMove = useCallback(() => goToPly(totalPlies), [goToPly, totalPlies]);

  // Autoplay loop (800ms)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentPly >= totalPlies) {
        setIsPlaying(false);
      } else {
        timer = setTimeout(() => {
          setCurrentPly((prev) => prev + 1);
        }, 800);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentPly, totalPlies]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (["ArrowLeft", "ArrowRight", "Space", "Home", "End"].includes(e.code)) {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMove();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMove();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === "Home") {
        e.preventDefault();
        firstMove();
      } else if (e.key === "End") {
        e.preventDefault();
        lastMove();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevMove, nextMove, firstMove, lastMove]);

  // Board arrows: Played move arrow + Best move recommendation arrow
  const boardArrows = useMemo(() => {
    const arrows: { startSquare: string; endSquare: string; color: string }[] = [];

    if (activeMove) {
      arrows.push({
        startSquare: activeMove.uci.slice(0, 2),
        endSquare: activeMove.uci.slice(2, 4),
        color: "rgba(212, 175, 55, 0.75)",
      });

      if (
        ["inaccuracy", "mistake", "blunder"].includes(activeMove.classification) &&
        activeMove.bestMove &&
        activeMove.bestMove.length >= 4 &&
        !previewingBest
      ) {
        arrows.push({
          startSquare: activeMove.bestMove.slice(0, 2),
          endSquare: activeMove.bestMove.slice(2, 4),
          color: "rgba(16, 185, 129, 0.8)",
        });
      }
    }

    return arrows;
  }, [activeMove, previewingBest]);

  // Square styling for last move & king in check / checkmate
  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (lastMoveHighlight) {
      styles[lastMoveHighlight.from] = {
        backgroundColor: previewingBest
          ? "rgba(16, 185, 129, 0.35)"
          : "rgba(212, 175, 55, 0.35)",
      };
      styles[lastMoveHighlight.to] = {
        backgroundColor: previewingBest
          ? "rgba(16, 185, 129, 0.45)"
          : "rgba(212, 175, 55, 0.45)",
      };
    }

    // Checkmate highlight (intense radial crimson)
    if (posState.checkmatedKingSquare) {
      styles[posState.checkmatedKingSquare] = {
        background: "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.6) 70%, transparent 100%)",
        boxShadow: "inset 0 0 14px rgba(220, 38, 38, 0.9)",
      };
    } else if (posState.checkedKingSquare) {
      // In check highlight
      styles[posState.checkedKingSquare] = {
        background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.85) 0%, rgba(217, 119, 6, 0.5) 70%, transparent 100%)",
      };
    }

    return styles;
  }, [lastMoveHighlight, previewingBest, posState.checkmatedKingSquare, posState.checkedKingSquare]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Players arranged according to board orientation (topPlayer vs bottomPlayer)
  const isFlipped = orientation === "black";
  const topPlayerProps = isFlipped
    ? {
        username: gameState.whitePlayer.username,
        rating: gameState.whitePlayer.rating,
        color: "white" as const,
        isUser: gameState.whitePlayer.isUser,
        resultText: gameState.whitePlayer.resultText,
        isCurrentTurn: posState.currentTurn === "white",
      }
    : {
        username: gameState.blackPlayer.username,
        rating: gameState.blackPlayer.rating,
        color: "black" as const,
        isUser: gameState.blackPlayer.isUser,
        resultText: gameState.blackPlayer.resultText,
        isCurrentTurn: posState.currentTurn === "black",
      };

  const bottomPlayerProps = isFlipped
    ? {
        username: gameState.blackPlayer.username,
        rating: gameState.blackPlayer.rating,
        color: "black" as const,
        isUser: gameState.blackPlayer.isUser,
        resultText: gameState.blackPlayer.resultText,
        isCurrentTurn: posState.currentTurn === "black",
      }
    : {
        username: gameState.whitePlayer.username,
        rating: gameState.whitePlayer.rating,
        color: "white" as const,
        isUser: gameState.whitePlayer.isUser,
        resultText: gameState.whitePlayer.resultText,
        isCurrentTurn: posState.currentTurn === "white",
      };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* 1. Header Banner & Normalized Result */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-accent">
              ChessDNA Game Analysis
            </span>
            <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[11px] font-mono text-muted-foreground capitalize">
              {game.time_class} • {game.time_control}
            </span>
            {gameState.terminationReason && (
              <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[11px] font-semibold text-zinc-300">
                {gameState.terminationReason}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-lg sm:text-2xl font-black text-foreground">
            <span className={gameState.whitePlayer.isUser ? "text-accent" : "text-foreground"}>
              {gameState.whitePlayer.username}
            </span>
            <span className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-wider">
              vs
            </span>
            <span className={gameState.blackPlayer.isUser ? "text-accent" : "text-foreground"}>
              {gameState.blackPlayer.username}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-semibold text-muted-foreground">
            <span>{analysis.summary.openingName}</span>
            <span>•</span>
            <span className="font-bold text-foreground font-mono bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/60">
              {gameState.headerTitle}
            </span>
          </div>
        </div>

        {/* Accuracy Comparison Badges */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-center p-3 bg-background/80 border border-border rounded-xl min-w-[90px]">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">
              White Accuracy
            </div>
            <div className="text-xl font-black text-foreground font-mono">
              {analysis.summary.accuracyWhite}%
            </div>
          </div>

          <div className="text-center p-3 bg-background/80 border border-border rounded-xl min-w-[90px]">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">
              Black Accuracy
            </div>
            <div className="text-xl font-black text-foreground font-mono">
              {analysis.summary.accuracyBlack}%
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 bg-card hover:bg-muted border border-border text-foreground text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Share"}
            </button>
            {onReanalyze && (
              <button
                onClick={onReanalyze}
                className="px-3.5 py-1.5 bg-background hover:bg-muted border border-border text-muted-foreground hover:text-foreground text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Re-analyze
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Workspace (Evaluation Bar | Board + Player Identities | Move Analysis Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Board Column */}
        <div className="lg:col-span-7 flex flex-col items-center gap-3">
          {/* Top Player Identity (Opponent by default, or White if flipped) */}
          <div className="w-full max-w-[540px]">
            <PlayerIdentity {...topPlayerProps} />
          </div>

          {/* Board + Vertical Evaluation Bar Container */}
          <div className="w-full max-w-[540px] flex gap-3 sm:gap-4 items-center">
            <EvaluationBar
              evaluation={currentWhiteEval}
              isFlipped={isFlipped}
            />

            <div className="flex-1 aspect-square bg-[#18181b] p-2 rounded-2xl border border-border shadow-2xl relative overflow-hidden select-none">
              <Chessboard
                options={{
                  position: currentFen,
                  boardOrientation: orientation,
                  darkSquareStyle: { backgroundColor: "#769656" },
                  lightSquareStyle: { backgroundColor: "#eeeed2" },
                  animationDurationInMs: 200,
                  allowDragging: false,
                  squareStyles: squareStyles,
                  arrows: boardArrows,
                  squareRenderer: ({ square, children }) => {
                    const isTargetDestination =
                      lastMoveHighlight && lastMoveHighlight.to === square && activeMove;

                    const isCheckmateSquare = posState.checkmatedKingSquare === square;

                    return (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          ...squareStyles[square],
                        }}
                      >
                        {children}

                        {/* Visual checkmate indicator badge directly on king */}
                        {isCheckmateSquare && (
                          <div
                            aria-label="Checkmated King"
                            className="absolute bottom-0.5 left-0.5 z-20 px-1 py-0.2 bg-red-600 text-white font-black text-[9px] rounded uppercase tracking-wider shadow-md animate-pulse"
                          >
                            # MATE
                          </div>
                        )}

                        {/* Move Quality Badge on destination square piece */}
                        {isTargetDestination && (
                          <MoveQualityBadge
                            classification={activeMove.classification}
                            moveSan={activeMove.san}
                            moveNumber={activeMove.moveNumber}
                            evalBefore={activeMove.evalBefore}
                            evalAfter={activeMove.evalAfter}
                            bestMoveSan={activeMove.bestMoveSan}
                            explanation={activeMove.explanation}
                          />
                        )}
                      </div>
                    );
                  },
                }}
              />
            </div>
          </div>

          {/* Bottom Player Identity (User by default, or Black if flipped) */}
          <div className="w-full max-w-[540px]">
            <PlayerIdentity {...bottomPlayerProps} />
          </div>

          {/* Replay Controls & Position Status Bar */}
          <div className="w-full max-w-[540px] flex items-center justify-between px-3 py-2 bg-card border border-border rounded-xl text-foreground text-xs shadow-md">
            <div className="flex items-center gap-1">
              <button
                onClick={firstMove}
                title="First Move (Home)"
                aria-label="First Move"
                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={prevMove}
                title="Previous Move (←)"
                aria-label="Previous Move"
                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                title="Play/Pause (Space)"
                aria-label={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
                className="p-2 hover:bg-accent hover:text-background rounded-lg transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={nextMove}
                title="Next Move (→)"
                aria-label="Next Move"
                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={lastMove}
                title="Last Move (End)"
                aria-label="Last Move"
                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Position / Move Counter */}
            <div className="text-center font-mono font-bold text-muted-foreground text-[11px]">
              {posState.isFinalPosition ? (
                <span className="text-accent font-extrabold flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  FINAL ({currentPly}/{totalPlies})
                </span>
              ) : activeMove ? (
                <span>
                  Move {activeMove.moveNumber} ({currentPly}/{totalPlies})
                </span>
              ) : (
                <span>Start (0/{totalPlies})</span>
              )}
            </div>

            {/* Flip Board button */}
            <button
              onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}
              title="Flip Board Orientation"
              aria-label="Flip Board Orientation"
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flip</span>
            </button>
          </div>
        </div>

        {/* Right: Move Analysis Panel + Move History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Position Status & Move Analysis Card */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            {/* Context Header: Final Position vs Current Position */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                {posState.isFinalPosition ? (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 shadow-sm">
                    <Flag className="w-3 h-3" />
                    Final Position
                  </span>
                ) : (
                  <span className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                    Current Position
                  </span>
                )}

                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {posState.turnLabel}
                </span>
              </div>

              {activeMove && (
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 shadow-sm ${
                    CLASSIFICATION_META[activeMove.classification].badgeClass
                  }`}
                >
                  <span className="font-mono font-black">{CLASSIFICATION_META[activeMove.classification].icon}</span>
                  <span>{CLASSIFICATION_META[activeMove.classification].label}</span>
                </span>
              )}
            </div>

            {/* Position Evaluation Insight Bar */}
            <div className="p-3 rounded-xl bg-background/80 border border-border flex items-center justify-between text-xs">
              <div className="text-muted-foreground font-medium">
                Evaluation:
              </div>
              <div className="font-mono font-bold text-foreground flex items-center gap-2">
                <span className={posState.userPerspectiveEval.isAdvantage ? "text-emerald-400 font-extrabold" : posState.userPerspectiveEval.isDisadvantage ? "text-rose-400 font-extrabold" : "text-zinc-300"}>
                  {posState.userPerspectiveEval.label}
                </span>
              </div>
            </div>

            {/* Active Move Detail */}
            {activeMove ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {posState.isFinalPosition ? "Final Move Played:" : "Played Move:"}
                    </span>
                    <div className="text-2xl font-black text-foreground font-mono flex items-center gap-2">
                      <span>
                        {activeMove.side === "black" ? `${activeMove.moveNumber}... ` : `${activeMove.moveNumber}. `}
                        {activeMove.san}
                      </span>
                      {posState.isCheckmate && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40 uppercase font-sans font-extrabold">
                          Checkmate
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground font-medium">Eval Shift:</span>
                    <div className="text-sm font-mono font-bold text-foreground">
                      {activeMove.evalBefore > 0 ? `+${activeMove.evalBefore}` : activeMove.evalBefore} →{" "}
                      <span className={activeMove.centipawnLoss > 150 ? "text-red-400 font-extrabold" : "text-accent font-extrabold"}>
                        {activeMove.evalAfter > 0 ? `+${activeMove.evalAfter}` : activeMove.evalAfter}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeMove.explanation}
                </p>

                {/* Best Move Recommendation if inaccuracy, mistake, or blunder */}
                {["inaccuracy", "mistake", "blunder"].includes(activeMove.classification) && (
                  <div className="p-3.5 bg-background/80 border border-border rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400">
                        Engine Recommendation:
                      </div>
                      <div className="text-sm font-bold text-foreground font-mono">
                        {activeMove.bestMoveSan}
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewingBest((p) => !p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        previewingBest
                          ? "bg-emerald-500 text-black shadow-sm"
                          : "bg-card border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {previewingBest ? "Showing Best" : "Preview Best"}
                    </button>
                  </div>
                )}

                {/* Final Position Summary Box if at final ply */}
                {posState.isFinalPosition && (
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-700/80 space-y-2.5 text-xs text-zinc-300 shadow-inner">
                    <div className="flex items-center gap-1.5 text-accent font-extrabold uppercase text-[11px] tracking-wider">
                      <Award className="w-4 h-4" />
                      Final Game Result
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-sans uppercase font-bold">Outcome</span>
                        <span className="font-bold text-foreground text-sm">
                          {gameState.winner ? `${gameState.winner.toUpperCase()} WON` : gameState.isDraw ? "DRAW" : gameState.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-sans uppercase font-bold">Score</span>
                        <span className="font-bold text-foreground text-sm">{gameState.scoreText}</span>
                      </div>
                      {gameState.terminationReason && (
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-sans uppercase font-bold">Termination</span>
                          <span className="font-semibold text-zinc-200">{gameState.terminationReason}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground block text-[10px] font-sans uppercase font-bold">Final Move</span>
                        <span className="font-semibold text-zinc-200">{activeMove.san}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground italic">
                Initial starting position. Step forward or press Play to analyze moves.
              </div>
            )}
          </div>

          {/* Move History Sequence Log with End/Final Indicators */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50 text-xs">
              <span className="uppercase font-bold tracking-wider text-muted-foreground text-[11px]">
                Full Move History
              </span>
              <span className="text-muted-foreground font-mono text-[11px]">
                {Math.ceil(totalPlies / 2)} Total Moves
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-border/40 font-mono text-xs pr-1">
              {Array.from({ length: Math.ceil(totalPlies / 2) }).map((_, moveIdx) => {
                const whitePly = moveIdx * 2 + 1;
                const blackPly = moveIdx * 2 + 2;
                const whiteMove = analysis.moves[whitePly - 1];
                const blackMove = analysis.moves[blackPly - 1];
                const isFinalInWhite = whitePly === totalPlies;
                const isFinalInBlack = blackPly === totalPlies;

                return (
                  <div
                    key={moveIdx}
                    className="grid grid-cols-12 py-1.5 px-2 hover:bg-background/50 rounded-lg items-center"
                  >
                    <span className="col-span-2 text-muted-foreground opacity-60">
                      {moveIdx + 1}.
                    </span>

                    {/* White move */}
                    <button
                      onClick={() => goToPly(whitePly)}
                      className={`col-span-5 text-left py-1 px-2 rounded-md transition-all cursor-pointer flex items-center justify-between ${
                        currentPly === whitePly
                          ? "bg-accent/20 text-accent font-bold shadow-sm ring-1 ring-accent/40"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {whiteMove ? whiteMove.san : ""}
                        {isFinalInWhite && (
                          <span className="text-[9px] px-1 py-0.2 bg-zinc-800 text-zinc-400 rounded font-sans uppercase font-bold">
                            END
                          </span>
                        )}
                      </span>
                      {whiteMove && (
                        <span className="text-[10px] ml-1">
                          {CLASSIFICATION_META[whiteMove.classification].icon}
                        </span>
                      )}
                    </button>

                    {/* Black move */}
                    {blackMove ? (
                      <button
                        onClick={() => goToPly(blackPly)}
                        className={`col-span-5 text-left py-1 px-2 rounded-md transition-all cursor-pointer flex items-center justify-between ${
                          currentPly === blackPly
                            ? "bg-accent/20 text-accent font-bold shadow-sm ring-1 ring-accent/40"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {blackMove.san}
                          {isFinalInBlack && (
                            <span className="text-[9px] px-1 py-0.2 bg-zinc-800 text-zinc-400 rounded font-sans uppercase font-bold">
                              END
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] ml-1">
                          {CLASSIFICATION_META[blackMove.classification].icon}
                        </span>
                      </button>
                    ) : (
                      <div className="col-span-5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Opening & Game Plan Analysis Section */}
      <OpeningAnalysisSection
        openingAnalysis={openingAnalysis}
        userColor={gameState.userColor}
        currentPly={currentPly}
        onSelectPly={goToPly}
      />

      {/* 4. Interactive Evaluation Graph with Theory & Turning Point markers */}
      <EvaluationGraph
        moves={analysis.moves}
        currentPly={currentPly}
        onSelectPly={goToPly}
        theoryEndPly={openingAnalysis.identification.theoryPlyEnd}
        turningPointPly={openingAnalysis.turningPoint?.ply}
      />

      {/* 5. Game Summary Insights & Turning Point */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Decisive Turning Point Card */}
        {analysis.summary.turningPoint && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs uppercase font-extrabold tracking-wider mb-2">
                <Zap className="w-4 h-4" />
                Decisive Turning Point
              </div>
              <h4 className="text-lg font-black text-foreground mb-1">
                Move {analysis.summary.turningPoint.moveNumber} • {analysis.summary.turningPoint.san}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {analysis.summary.turningPoint.description}
              </p>
            </div>
            <button
              onClick={() => goToPly(analysis.summary.turningPoint!.ply)}
              className="w-full py-2 bg-background hover:bg-muted border border-border text-foreground text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Jump to Turning Point
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Biggest Mistake / Blunder Card */}
        {analysis.summary.biggestMistake && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-400 text-xs uppercase font-extrabold tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4" />
                Biggest Blunder
              </div>
              <h4 className="text-lg font-black text-foreground mb-1">
                Move {analysis.summary.biggestMistake.moveNumber} — {analysis.summary.biggestMistake.playedSan}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Lost {analysis.summary.biggestMistake.loss} centipawns. Better was{" "}
                <strong className="text-emerald-400 font-bold">
                  {analysis.summary.biggestMistake.bestSan}
                </strong>
                .
              </p>
            </div>
            <button
              onClick={() => goToPly(analysis.summary.biggestMistake!.ply)}
              className="w-full py-2 bg-background hover:bg-muted border border-border text-foreground text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Examine Blunder
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Phase Breakdown Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 text-accent text-xs uppercase font-extrabold tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            Phase Performance
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-muted-foreground">Opening</span>
                <span className="font-bold text-foreground">
                  {analysis.summary.phasePerformance.opening}%
                </span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${analysis.summary.phasePerformance.opening}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-muted-foreground">Middlegame</span>
                <span className="font-bold text-foreground">
                  {analysis.summary.phasePerformance.middlegame}%
                </span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${analysis.summary.phasePerformance.middlegame}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-muted-foreground">Endgame</span>
                <span className="font-bold text-foreground">
                  {analysis.summary.phasePerformance.endgame}%
                </span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${analysis.summary.phasePerformance.endgame}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
