import { Chess } from "chess.js";
import type { PieceSymbol, Square, Move } from "chess.js";

export type MoveClassification =
  | "brilliant"
  | "excellent"
  | "strong"
  | "solid"
  | "inaccuracy"
  | "mistake"
  | "blunder";

export interface EngineEvaluation {
  score: number; // in centipawns (+150 = +1.5 pawns for white)
  mate: number | null;
  bestMove: string; // UCI format e.g. "e2e4"
  bestMoveSan: string; // SAN format e.g. "e4"
  pv: string[];
}

export interface AnalyzedMove {
  ply: number;
  moveNumber: number;
  side: "white" | "black";
  san: string;
  uci: string;
  fenBefore: string;
  fenAfter: string;
  evalBefore: number; // in pawns (+1.50) from White's perspective
  evalAfter: number; // in pawns from White's perspective
  playerEvalBefore: number; // from the moving player's perspective
  playerEvalAfter: number;
  bestMove: string;
  bestMoveSan: string;
  bestLine: string[];
  centipawnLoss: number;
  classification: MoveClassification;
  explanation: string;
  isCheck: boolean;
  isCapture: boolean;
}

export interface GameAnalysisSummary {
  accuracyWhite: number;
  accuracyBlack: number;
  playerAccuracy: number;
  classificationCounts: {
    white: Record<MoveClassification, number>;
    black: Record<MoveClassification, number>;
  };
  turningPoint: {
    ply: number;
    moveNumber: number;
    side: "white" | "black";
    san: string;
    evalBefore: number;
    evalAfter: number;
    swing: number;
    description: string;
  } | null;
  biggestMistake: {
    ply: number;
    moveNumber: number;
    side: "white" | "black";
    playedSan: string;
    bestSan: string;
    evalBefore: number;
    evalAfter: number;
    loss: number;
  } | null;
  openingName: string;
  phasePerformance: {
    opening: number;
    middlegame: number;
    endgame: number;
  };
}

export interface FullGameAnalysis {
  gameId: string;
  engineVersion: string;
  moves: AnalyzedMove[];
  summary: GameAnalysisSummary;
  analyzedAt: number;
}

// Piece values in centipawns
const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Simplified Piece-Square Tables (White perspective, mirror for Black)
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_PST = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_PST_MID = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-20,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

/**
 * Static evaluation function in centipawns from White's perspective (+ = White advantage).
 */
export function evaluatePosition(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === "w" ? -10000 : 10000;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type];
      const squareIndex = r * 8 + c;
      const whiteSquareIndex = squareIndex;
      const blackSquareIndex = (7 - r) * 8 + c;

      let pst = 0;
      switch (piece.type) {
        case "p":
          pst = piece.color === "w" ? PAWN_PST[whiteSquareIndex] : PAWN_PST[blackSquareIndex];
          break;
        case "n":
          pst = piece.color === "w" ? KNIGHT_PST[whiteSquareIndex] : KNIGHT_PST[blackSquareIndex];
          break;
        case "b":
          pst = piece.color === "w" ? BISHOP_PST[whiteSquareIndex] : BISHOP_PST[blackSquareIndex];
          break;
        case "r":
          pst = piece.color === "w" ? ROOK_PST[whiteSquareIndex] : ROOK_PST[blackSquareIndex];
          break;
        case "q":
          pst = piece.color === "w" ? QUEEN_PST[whiteSquareIndex] : QUEEN_PST[blackSquareIndex];
          break;
        case "k":
          pst = piece.color === "w" ? KING_PST_MID[whiteSquareIndex] : KING_PST_MID[blackSquareIndex];
          break;
      }

      if (piece.color === "w") {
        score += val + pst;
      } else {
        score -= val + pst;
      }
    }
  }

  // Small mobility incentive
  const movesCount = chess.moves().length;
  score += chess.turn() === "w" ? movesCount * 2 : -movesCount * 2;

  return score;
}

/**
 * 1-ply search to find the engine's best move and evaluation from a position.
 */
export function findBestMove(chess: Chess): EngineEvaluation {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) {
    const score = evaluatePosition(chess);
    return {
      score,
      mate: chess.isCheckmate() ? (chess.turn() === "w" ? -1 : 1) : null,
      bestMove: "",
      bestMoveSan: "",
      pv: [],
    };
  }

  const isWhite = chess.turn() === "w";
  let bestScore = isWhite ? -Infinity : Infinity;
  let bestMove = moves[0];

  for (const move of moves) {
    chess.move(move);
    let evalAfter = evaluatePosition(chess);

    // If opponent is in check, bonus
    if (chess.inCheck()) {
      evalAfter += isWhite ? 20 : -20;
    }

    chess.undo();

    if (isWhite) {
      if (evalAfter > bestScore) {
        bestScore = evalAfter;
        bestMove = move;
      }
    } else {
      if (evalAfter < bestScore) {
        bestScore = evalAfter;
        bestMove = move;
      }
    }
  }

  const uci = `${bestMove.from}${bestMove.to}${bestMove.promotion || ""}`;

  return {
    score: bestScore,
    mate: null,
    bestMove: uci,
    bestMoveSan: bestMove.san,
    pv: [bestMove.san],
  };
}

/**
 * Deterministic move classification logic based on centipawn loss and tactical context.
 */
export function classifyMove(
  loss: number,
  isBestMove: boolean,
  isSacrifice: boolean,
  evalBefore: number,
  evalAfter: number,
  side: "white" | "black"
): { classification: MoveClassification; explanation: string } {
  // Brilliant: Piece sacrifice that improves or maintains strong advantage
  if (isSacrifice && loss <= 25 && (side === "white" ? evalAfter >= 150 : evalAfter <= -150)) {
    return {
      classification: "brilliant",
      explanation: "A brilliant sacrifice that creates decisive tactical momentum.",
    };
  }

  // Best/Excellent
  if (isBestMove || loss <= 15) {
    return {
      classification: "excellent",
      explanation: "The best move in the position, maintaining optimal pressure.",
    };
  }

  if (loss <= 45) {
    return {
      classification: "strong",
      explanation: "A strong, natural move that preserves the advantage.",
    };
  }

  if (loss <= 90) {
    return {
      classification: "solid",
      explanation: "A solid, playable move, though a sharper alternative existed.",
    };
  }

  if (loss <= 180) {
    return {
      classification: "inaccuracy",
      explanation: "An inaccuracy that loosens your grip on the position.",
    };
  }

  if (loss <= 320) {
    return {
      classification: "mistake",
      explanation: "A tactical mistake that gives away a significant positional advantage.",
    };
  }

  return {
    classification: "blunder",
    explanation: "A major blunder that directly shifts the game's outcome.",
  };
}

/**
 * Full game analysis engine.
 * Parses PGN, steps through all moves, evaluates positions, calculates loss, and generates summary insights.
 */
export async function analyzeCompletedGame(
  pgn: string,
  playerUsername: string,
  onProgress?: (progressPercent: number) => void
): Promise<FullGameAnalysis> {
  const chess = new Chess();
  chess.loadPgn(pgn);
  const history = chess.history({ verbose: true });

  // Extract ECO / Opening Name
  const openingMatch = pgn.match(/\[ECOUrl ".*?\/openings\/(.*?)"\]/);
  const ecoMatch = pgn.match(/\[ECO "(.*?)"\]/);
  let openingName = "Chess Opening";
  if (openingMatch && openingMatch[1]) {
    openingName = openingMatch[1].replace(/-/g, " ");
  } else if (ecoMatch && ecoMatch[1]) {
    openingName = `ECO ${ecoMatch[1]}`;
  }

  // Replay from beginning
  const replayGame = new Chess();
  const totalMoves = history.length;
  const analyzedMoves: AnalyzedMove[] = [];

  let whiteLossSum = 0;
  let blackLossSum = 0;
  let whiteMoveCount = 0;
  let blackMoveCount = 0;

  const classCounts = {
    white: {
      brilliant: 0,
      excellent: 0,
      strong: 0,
      solid: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
    },
    black: {
      brilliant: 0,
      excellent: 0,
      strong: 0,
      solid: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
    },
  };

  let maxSwing = 0;
  let turningPoint: GameAnalysisSummary["turningPoint"] = null;
  let biggestMistake: GameAnalysisSummary["biggestMistake"] = null;

  for (let i = 0; i < totalMoves; i++) {
    const move = history[i];
    const ply = i + 1;
    const moveNumber = Math.ceil(ply / 2);
    const side: "white" | "black" = move.color === "w" ? "white" : "black";
    const fenBefore = replayGame.fen();

    // 1. Evaluate position before move & find engine best move
    const engineBest = findBestMove(replayGame);
    const rawEvalBeforeCp = evaluatePosition(replayGame);

    // 2. Play the actual game move
    replayGame.move(move);
    const fenAfter = replayGame.fen();
    const rawEvalAfterCp = evaluatePosition(replayGame);

    // 3. Normalized evaluations in pawns from White's perspective (+1.50)
    const evalBeforePawns = Number((rawEvalBeforeCp / 100).toFixed(2));
    const evalAfterPawns = Number((rawEvalAfterCp / 100).toFixed(2));

    // Player perspective (+ is good for the player who just moved)
    const playerEvalBefore = side === "white" ? evalBeforePawns : -evalBeforePawns;
    const playerEvalAfter = side === "white" ? evalAfterPawns : -evalAfterPawns;

    // 4. Centipawn loss from moving player's perspective
    const expectedPlayerEvalCp = side === "white" ? engineBest.score : -engineBest.score;
    const actualPlayerEvalCp = side === "white" ? rawEvalAfterCp : -rawEvalAfterCp;
    const centipawnLoss = Math.max(0, expectedPlayerEvalCp - actualPlayerEvalCp);

    // Check if played move is best move
    const moveUci = `${move.from}${move.to}${move.promotion || ""}`;
    const isBest = moveUci === engineBest.bestMove || move.san === engineBest.bestMoveSan;

    // Check if sacrifice
    const isSacrifice =
      move.piece !== "p" &&
      move.captured !== undefined &&
      PIECE_VALUES[move.piece] > (PIECE_VALUES[move.captured] || 0);

    // 5. Classify move
    const { classification, explanation } = classifyMove(
      centipawnLoss,
      isBest,
      isSacrifice,
      rawEvalBeforeCp,
      rawEvalAfterCp,
      side
    );

    classCounts[side][classification]++;

    if (side === "white") {
      whiteLossSum += centipawnLoss;
      whiteMoveCount++;
    } else {
      blackLossSum += centipawnLoss;
      blackMoveCount++;
    }

    // 6. Detect Turning Point (largest eval swing that shifted advantage)
    const swing = Math.abs(evalAfterPawns - evalBeforePawns);
    if (swing > maxSwing && swing >= 1.5) {
      maxSwing = swing;
      turningPoint = {
        ply,
        moveNumber,
        side,
        san: move.san,
        evalBefore: evalBeforePawns,
        evalAfter: evalAfterPawns,
        swing: Number(swing.toFixed(1)),
        description: `Move ${moveNumber} was the decisive turning point. The position shifted by ${swing.toFixed(1)} pawns.`,
      };
    }

    // 7. Track biggest mistake
    if (centipawnLoss > (biggestMistake?.loss || 0) && (classification === "blunder" || classification === "mistake")) {
      biggestMistake = {
        ply,
        moveNumber,
        side,
        playedSan: move.san,
        bestSan: engineBest.bestMoveSan,
        evalBefore: evalBeforePawns,
        evalAfter: evalAfterPawns,
        loss: Math.round(centipawnLoss),
      };
    }

    analyzedMoves.push({
      ply,
      moveNumber,
      side,
      san: move.san,
      uci: moveUci,
      fenBefore,
      fenAfter,
      evalBefore: evalBeforePawns,
      evalAfter: evalAfterPawns,
      playerEvalBefore,
      playerEvalAfter,
      bestMove: engineBest.bestMove,
      bestMoveSan: engineBest.bestMoveSan,
      bestLine: engineBest.pv,
      centipawnLoss: Math.round(centipawnLoss),
      classification,
      explanation,
      isCheck: replayGame.inCheck(),
      isCapture: !!move.captured,
    });

    if (onProgress && i % 4 === 0) {
      onProgress(Math.round(((i + 1) / totalMoves) * 100));
    }
  }

  // Calculate Accuracy metrics (Sigmoid accuracy bounded 0–100)
  const avgLossWhite = whiteMoveCount ? whiteLossSum / whiteMoveCount : 0;
  const avgLossBlack = blackMoveCount ? blackLossSum / blackMoveCount : 0;

  const accuracyWhite = Math.min(100, Math.max(35, Math.round(100 * Math.exp(-0.004 * avgLossWhite))));
  const accuracyBlack = Math.min(100, Math.max(35, Math.round(100 * Math.exp(-0.004 * avgLossBlack))));

  // Phase performance
  const openingMoves = analyzedMoves.slice(0, 16);
  const middleMoves = analyzedMoves.slice(16, 40);
  const endgameMoves = analyzedMoves.slice(40);

  const calcPhaseAcc = (mvs: AnalyzedMove[]) => {
    if (mvs.length === 0) return 85;
    const avg = mvs.reduce((acc, m) => acc + m.centipawnLoss, 0) / mvs.length;
    return Math.min(100, Math.max(40, Math.round(100 * Math.exp(-0.004 * avg))));
  };

  const summary: GameAnalysisSummary = {
    accuracyWhite,
    accuracyBlack,
    playerAccuracy: accuracyWhite, // Updated by consumer depending on which side user played
    classificationCounts: classCounts,
    turningPoint,
    biggestMistake,
    openingName,
    phasePerformance: {
      opening: calcPhaseAcc(openingMoves),
      middlegame: calcPhaseAcc(middleMoves),
      endgame: calcPhaseAcc(endgameMoves),
    },
  };

  if (onProgress) onProgress(100);

  return {
    gameId: `game-${Date.now()}`,
    engineVersion: "ChessDNA-Eval-1.0",
    moves: analyzedMoves,
    summary,
    analyzedAt: Date.now(),
  };
}
