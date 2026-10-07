"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Chess, Square as ChessSquare, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { DailyPuzzle } from "@/lib/puzzleApi";
import { chessSound } from "@/lib/chessSound";
import {
  Trophy,
  XCircle,
  RefreshCcw,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export interface MoveEvent {
  from: string;
  to: string;
  piece: string;
  color: "w" | "b";
  captured?: string | null;
  promotion?: string | null;
  san: string;
  lan: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isCorrect?: boolean;
  timestamp: number;
}

export default function PuzzleBoard({ puzzle }: { puzzle: DailyPuzzle }) {
  // Initialize game state with puzzle FEN
  const [game, setGame] = useState(() => {
    const c = new Chess();
    if (puzzle.fen) {
      try {
        c.load(puzzle.fen);
      } catch (e) {
        console.error("Failed to load puzzle FEN", e);
      }
    }
    return c;
  });

  // State management
  const playerColor = useMemo<"white" | "black">(() => {
    // If FEN is given, the player solves for whoever's turn it is at start
    const initialChess = new Chess();
    if (puzzle.fen) {
      try {
        initialChess.load(puzzle.fen);
        return initialChess.turn() === "w" ? "white" : "black";
      } catch {}
    }
    return "black";
  }, [puzzle.fen]);

  const [orientation, setOrientation] = useState<"white" | "black">(playerColor);
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<"playing" | "success" | "failed">("playing");
  const [statusMessage, setStatusMessage] = useState<string>("Find the best move");
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Interaction states
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(() => {
    if (puzzle.lastMove && puzzle.lastMove.length >= 4) {
      return {
        from: puzzle.lastMove.slice(0, 2),
        to: puzzle.lastMove.slice(2, 4),
      };
    }
    return null;
  });
  const [movesHistory, setMovesHistory] = useState<MoveEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<MoveEvent | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Sync sound setting
  useEffect(() => {
    chessSound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Re-initialize when puzzle changes
  useEffect(() => {
    const newGame = new Chess();
    if (puzzle.fen) {
      try {
        newGame.load(puzzle.fen);
      } catch (e) {
        console.error("Failed to load puzzle FEN", e);
      }
    }
    setGame(newGame);
    setOrientation(newGame.turn() === "w" ? "white" : "black");
    setMoveIndex(0);
    setStatus("playing");
    setStatusMessage("Find the best move");
    setIsAnimating(false);
    setSelectedSquare(null);
    setMovesHistory([]);
    setLatestEvent(null);

    if (puzzle.lastMove && puzzle.lastMove.length >= 4) {
      setLastMove({
        from: puzzle.lastMove.slice(0, 2),
        to: puzzle.lastMove.slice(2, 4),
      });
    } else {
      setLastMove(null);
    }
  }, [puzzle.id, puzzle.fen, puzzle.lastMove]);

  // Calculate legal moves for selected square
  const legalMovesForSelected = useMemo<Move[]>(() => {
    if (!selectedSquare || status !== "playing" || isAnimating) return [];
    try {
      return game.moves({ square: selectedSquare as ChessSquare, verbose: true });
    } catch {
      return [];
    }
  }, [game, selectedSquare, status, isAnimating]);

  // Find king square if in check
  const inCheckKingSquare = useMemo<string | null>(() => {
    if (!game.inCheck()) return null;
    const currentTurn = game.turn();
    const board = game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === "k" && piece.color === currentTurn) {
          return piece.square;
        }
      }
    }
    return null;
  }, [game]);

  // Calculate custom square styles (selected, legal destinations, captures, last move, check)
  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // 1. Last move highlights (FROM and TO)
    if (lastMove) {
      styles[lastMove.from] = {
        backgroundColor: "rgba(212, 175, 55, 0.32)",
        transition: "background-color 200ms ease",
      };
      styles[lastMove.to] = {
        backgroundColor: "rgba(212, 175, 55, 0.42)",
        transition: "background-color 200ms ease",
      };
    }

    // 2. Selected square highlight
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(212, 175, 55, 0.6)",
        boxShadow: "inset 0 0 0 3px #d4af37",
        transition: "all 150ms ease",
      };
    }

    // 3. Legal moves preview
    legalMovesForSelected.forEach((move) => {
      if (move.captured) {
        // Capture indicator: Distinct outer ring / target indicator
        styles[move.to] = {
          background:
            "radial-gradient(circle, transparent 60%, rgba(239, 68, 68, 0.65) 64%, rgba(239, 68, 68, 0.8) 86%, transparent 90%)",
          boxShadow: "inset 0 0 0 3px rgba(239, 68, 68, 0.75)",
          borderRadius: "6px",
          cursor: "pointer",
        };
      } else {
        // Normal move: Subtle centered dot
        styles[move.to] = {
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.85) 24%, transparent 26%)",
          borderRadius: "50%",
          cursor: "pointer",
        };
      }
    });

    // 4. King under check / checkmate indicator
    if (inCheckKingSquare) {
      styles[inCheckKingSquare] = {
        background:
          "radial-gradient(circle, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.6) 55%, transparent 80%)",
        boxShadow: "inset 0 0 16px rgba(239, 68, 68, 0.9)",
        transition: "background 200ms ease",
      };
    }

    return styles;
  }, [lastMove, selectedSquare, legalMovesForSelected, inCheckKingSquare]);

  // Execute a validated chess move with animations and feedback
  const executeMove = useCallback(
    (moveObj: { from: string; to: string; promotion?: string }): boolean => {
      if (status !== "playing" || isAnimating) return false;

      try {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(moveObj);

        if (!result) return false;

        const expectedMove = puzzle.solution[moveIndex];
        const moveUci = `${result.from}${result.to}${result.promotion || ""}`;
        const isMatch =
          moveUci === expectedMove ||
          result.lan === expectedMove ||
          result.san === expectedMove;

        // Create normalized move event
        const moveEvent: MoveEvent = {
          from: result.from,
          to: result.to,
          piece: result.piece,
          color: result.color,
          captured: result.captured || null,
          promotion: result.promotion || null,
          san: result.san,
          lan: result.lan,
          isCheck: gameCopy.inCheck(),
          isCheckmate: gameCopy.isCheckmate(),
          isCorrect: isMatch,
          timestamp: Date.now(),
        };

        if (isMatch) {
          // --- CORRECT PLAYER MOVE ---
          setIsAnimating(true);
          setSelectedSquare(null);
          setGame(gameCopy);
          setLastMove({ from: result.from, to: result.to });
          setLatestEvent(moveEvent);
          setMovesHistory((prev) => [...prev, moveEvent]);

          // Play audio
          if (result.captured) {
            chessSound.playCapture();
          } else {
            chessSound.playMove();
          }
          if (gameCopy.inCheck()) {
            setTimeout(() => chessSound.playCheck(), 120);
          }

          if (moveIndex + 1 >= puzzle.solution.length) {
            // Puzzle completely solved!
            setStatus("success");
            setStatusMessage("Puzzle Solved! Masterful play.");
            setIsAnimating(false);
            setTimeout(() => chessSound.playSuccess(), 250);
          } else {
            // Move was correct, schedule opponent's response
            setStatusMessage("✓ Excellent! Opponent is responding...");
            const nextIdx = moveIndex + 1;
            setMoveIndex(nextIdx);

            // Wait for player move animation to finish, then animate opponent reply
            setTimeout(() => {
              const replyUci = puzzle.solution[nextIdx];
              const nextGame = new Chess(gameCopy.fen());
              const replyResult = nextGame.move(replyUci);

              if (replyResult) {
                const opponentEvent: MoveEvent = {
                  from: replyResult.from,
                  to: replyResult.to,
                  piece: replyResult.piece,
                  color: replyResult.color,
                  captured: replyResult.captured || null,
                  promotion: replyResult.promotion || null,
                  san: replyResult.san,
                  lan: replyResult.lan,
                  isCheck: nextGame.inCheck(),
                  isCheckmate: nextGame.isCheckmate(),
                  timestamp: Date.now(),
                };

                setGame(nextGame);
                setLastMove({ from: replyResult.from, to: replyResult.to });
                setLatestEvent(opponentEvent);
                setMovesHistory((prev) => [...prev, opponentEvent]);

                if (replyResult.captured) {
                  chessSound.playCapture();
                } else {
                  chessSound.playMove();
                }
                if (nextGame.inCheck()) {
                  setTimeout(() => chessSound.playCheck(), 120);
                }

                setMoveIndex(nextIdx + 1);

                // Check if opponent move finished the sequence
                if (nextIdx + 1 >= puzzle.solution.length) {
                  setStatus("success");
                  setStatusMessage("Puzzle Solved! Great tactical vision.");
                  setTimeout(() => chessSound.playSuccess(), 250);
                } else {
                  setStatusMessage("Your turn — find the next move");
                }
              }

              // Release animation lock after opponent move completes
              setTimeout(() => {
                setIsAnimating(false);
              }, 220);
            }, 380);
          }
          return true;
        } else {
          // --- INCORRECT MOVE ---
          // Still animate to destination so player sees what they played
          setGame(gameCopy);
          setLastMove({ from: result.from, to: result.to });
          setSelectedSquare(null);
          setStatus("failed");
          setStatusMessage("✕ Not the best move — try again");
          setLatestEvent(moveEvent);

          chessSound.playError();
          return false;
        }
      } catch {
        return false;
      }
    },
    [game, moveIndex, puzzle.solution, status, isAnimating]
  );

  // Click-to-Move handler
  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (status !== "playing" || isAnimating) return;

      const currentTurn = game.turn();
      const pieceOnSquare = game.get(square as ChessSquare);

      // 1. If no square currently selected
      if (!selectedSquare) {
        if (pieceOnSquare && pieceOnSquare.color === currentTurn) {
          setSelectedSquare(square);
        }
        return;
      }

      // 2. If clicking the already selected square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      // 3. If clicking another piece of the player's own color, switch selection
      if (pieceOnSquare && pieceOnSquare.color === currentTurn) {
        setSelectedSquare(square);
        return;
      }

      // 4. Check if clicked square is a legal destination
      const isLegal = legalMovesForSelected.some((m) => m.to === square);
      if (isLegal) {
        executeMove({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });
      } else {
        // Illegal target clicked
        setSelectedSquare(null);
        chessSound.playError();
      }
    },
    [game, selectedSquare, legalMovesForSelected, status, isAnimating, executeMove]
  );

  // Drag-and-drop handler
  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      piece?: any;
      sourceSquare: string;
      targetSquare: string | null;
    }): boolean => {
      if (!targetSquare || status !== "playing" || isAnimating) {
        setSelectedSquare(null);
        return false;
      }

      const success = executeMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      setSelectedSquare(null);
      return success;
    },
    [executeMove, status, isAnimating]
  );

  // Drag start handler to show legal moves during drag
  const handlePieceDrag = useCallback(
    ({ square }: { square: string | null }) => {
      if (square && !isAnimating && status === "playing") {
        setSelectedSquare(square);
      }
    },
    [isAnimating, status]
  );

  // Retry / Reset puzzle to initial starting position
  const handleRetry = useCallback(() => {
    const newGame = new Chess();
    if (puzzle.fen) {
      try {
        newGame.load(puzzle.fen);
      } catch (e) {
        console.error("Failed to reload FEN", e);
      }
    }
    setGame(newGame);
    setMoveIndex(0);
    setStatus("playing");
    setStatusMessage("Find the best move");
    setSelectedSquare(null);
    setIsAnimating(false);
    setMovesHistory([]);
    setLatestEvent(null);

    if (puzzle.lastMove && puzzle.lastMove.length >= 4) {
      setLastMove({
        from: puzzle.lastMove.slice(0, 2),
        to: puzzle.lastMove.slice(2, 4),
      });
    } else {
      setLastMove(null);
    }
  }, [puzzle.fen, puzzle.lastMove]);

  // Flip board orientation
  const handleFlip = useCallback(() => {
    setOrientation((prev) => (prev === "white" ? "black" : "white"));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* LEFT: Premium Chessboard Container */}
      <div className="w-full lg:w-auto flex flex-col items-center flex-shrink-0">
        <div className="w-full max-w-[480px] sm:max-w-[500px] aspect-square shadow-2xl rounded-2xl overflow-hidden border border-border bg-[#18181b] p-2 relative select-none">
          {/* Subtle check warning glow bar if in check */}
          {game.inCheck() && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse z-10" />
          )}

          <Chessboard
            options={{
              position: game.fen(),
              boardOrientation: orientation,
              onPieceDrop: handlePieceDrop,
              onSquareClick: handleSquareClick,
              onPieceClick: ({ square }) => {
                if (square) handleSquareClick({ square });
              },
              onPieceDrag: handlePieceDrag,
              onPieceDragCancel: () => setSelectedSquare(null),
              canDragPiece: ({ piece }) => {
                if (isAnimating || status !== "playing") return false;
                // piece.pieceType starts with 'w' or 'b'
                const pieceColor = piece.pieceType.charAt(0);
                return pieceColor === game.turn();
              },
              squareStyles: squareStyles,
              darkSquareStyle: { backgroundColor: "#769656" },
              lightSquareStyle: { backgroundColor: "#eeeed2" },
              animationDurationInMs: reducedMotion ? 0 : 200,
              showAnimations: !reducedMotion,
              allowDragging: !isAnimating && status === "playing",
              arrows: lastMove
                ? [
                    {
                      startSquare: lastMove.from,
                      endSquare: lastMove.to,
                      color: "rgba(212, 175, 55, 0.7)",
                    },
                  ]
                : [],
            }}
          />
        </div>

        {/* Board Action Bar */}
        <div className="w-full max-w-[500px] flex items-center justify-between mt-3 px-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="font-medium text-foreground">
              Playing as {playerColor.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFlip}
              title="Flip Board"
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-accent" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleRetry}
              title="Restart Puzzle"
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Challenge Info, Notation & Move History */}
      <div className="flex-1 w-full flex flex-col gap-5">
        {/* Main Challenge Card */}
        <div className="bg-card p-6 sm:p-7 rounded-2xl border border-border shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-accent">
                Lichess Tactical Lab
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Daily Challenge
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Rating
              </span>
              <span className="text-xl font-black text-accent">{puzzle.rating}</span>
            </div>
          </div>

          {/* Tactical Themes */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {puzzle.themes.slice(0, 5).map((theme) => (
              <span
                key={theme}
                className="px-2.5 py-1 bg-background/80 rounded-full text-xs font-semibold text-muted-foreground border border-border/60"
              >
                {theme.replace(/([A-Z])/g, " $1").trim()}
              </span>
            ))}
          </div>

          {/* Interactive Turn / Move Status Banner */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
              status === "success"
                ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-400"
                : status === "failed"
                ? "bg-red-950/30 border-red-500/50 text-red-400"
                : isAnimating
                ? "bg-accent/10 border-accent/40 text-foreground"
                : "bg-background/60 border-border text-foreground"
            }`}
          >
            {status === "success" ? (
              <Trophy className="w-7 h-7 text-emerald-400 flex-shrink-0 animate-bounce" />
            ) : status === "failed" ? (
              <XCircle className="w-7 h-7 text-red-400 flex-shrink-0" />
            ) : game.inCheck() ? (
              <ShieldAlert className="w-7 h-7 text-red-400 flex-shrink-0 animate-pulse" />
            ) : (
              <Sparkles className="w-7 h-7 text-accent flex-shrink-0" />
            )}

            <div className="flex-1">
              <div className="font-bold text-base leading-tight">
                {status === "success"
                  ? "Puzzle Completed!"
                  : status === "failed"
                  ? "Incorrect Move"
                  : game.inCheck()
                  ? "Check!"
                  : statusMessage}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {status === "success"
                  ? "You found every single top-engine continuation."
                  : status === "failed"
                  ? "That was not the best tactical line."
                  : `Your turn to play as ${playerColor}`}
              </div>
            </div>

            {status === "failed" && (
              <button
                onClick={handleRetry}
                className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}
          </div>

          {/* Latest Move Indicator */}
          {latestEvent && (
            <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Latest Move:</span>
              <div className="flex items-center gap-2 text-foreground font-mono font-semibold bg-background/80 px-2.5 py-1 rounded-md border border-border">
                <span>{latestEvent.color === "w" ? "White" : "Black"}</span>
                <span className="text-accent font-bold text-sm">
                  {latestEvent.san}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  ({latestEvent.from} → {latestEvent.to})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Move History Log */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
            <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              Move Sequence
            </h4>
            <span className="text-[11px] text-muted-foreground font-mono">
              Step {Math.min(moveIndex + 1, puzzle.solution.length)} of{" "}
              {puzzle.solution.length}
            </span>
          </div>

          {movesHistory.length === 0 ? (
            <div className="text-center py-5 text-xs text-muted-foreground italic">
              Make your first move on the board to start the line.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {movesHistory.map((mv, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition-all ${
                    idx === movesHistory.length - 1
                      ? "bg-accent/15 border-accent/50 text-foreground font-bold shadow-sm"
                      : "bg-background/50 border-border/60 text-muted-foreground"
                  }`}
                >
                  <span className="opacity-60">{idx + 1}.</span>
                  <span className="text-foreground font-semibold">{mv.san}</span>
                  <span className="text-[10px] opacity-70">
                    {mv.from}→{mv.to}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
