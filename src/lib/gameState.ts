import { ChessGame } from "./chessApi";
import { FullGameAnalysis, AnalyzedMove } from "./chessEngine";

export type GameStatus =
  | "ONGOING"
  | "WHITE_WON"
  | "BLACK_WON"
  | "DRAW"
  | "ABANDONED"
  | "UNKNOWN";

export type TerminationType =
  | "CHECKMATE"
  | "RESIGNATION"
  | "TIMEOUT"
  | "STALEMATE"
  | "REPETITION"
  | "AGREEMENT"
  | "INSUFFICIENT_MATERIAL"
  | "FIFTY_MOVES"
  | "ABANDONED"
  | "UNKNOWN";

export interface NormalizedGameState {
  status: GameStatus;
  winner: "white" | "black" | null;
  loser: "white" | "black" | null;
  isDraw: boolean;
  isOngoing: boolean;
  scoreText: string; // "1–0", "0–1", "½–½", "*", "—"
  headerTitle: string; // "WHITE WINS · 1–0", "GAME OVER", etc.
  terminationType: TerminationType;
  terminationReason: string; // human readable, e.g. "Checkmate", "Resignation", etc.
  whitePlayer: {
    username: string;
    rating: number | string;
    result: "win" | "loss" | "draw" | "ongoing" | "unknown";
    resultText: string; // "WIN", "LOSS", "DRAW", ""
    isUser: boolean;
  };
  blackPlayer: {
    username: string;
    rating: number | string;
    result: "win" | "loss" | "draw" | "ongoing" | "unknown";
    resultText: string; // "WIN", "LOSS", "DRAW", ""
    isUser: boolean;
  };
  userColor: "white" | "black" | null;
}

export interface PositionState {
  isFinalPosition: boolean;
  isFinalMove: boolean;
  currentTurn: "white" | "black" | "game_over";
  turnLabel: string; // "WHITE TO MOVE", "BLACK TO MOVE", "GAME OVER"
  isCheck: boolean;
  isCheckmate: boolean;
  checkmatedKingSquare: string | null;
  checkedKingSquare: string | null;
  userPerspectiveEval: {
    score: number; // formatted score (+3.2, -2.8, etc.) from user perspective
    label: string; // "YOUR ADVANTAGE +3.2", "YOU ARE LOSING -2.8", "WHITE ADVANTAGE +3.2"
    isAdvantage: boolean;
    isDisadvantage: boolean;
    isEqual: boolean;
  };
}

/**
 * Extracts PGN header tag value
 */
export function getPgnTag(pgn: string, tag: string): string | null {
  if (!pgn) return null;
  const match = pgn.match(new RegExp(`\\[${tag}\\s+\"([^\"]+)\"\]`));
  return match ? match[1] : null;
}

/**
 * Determines normalized game termination and outcome from PGN headers and game metadata.
 * Source of truth is actual metadata/PGN, NEVER inferred from evaluation or material.
 */
export function getNormalizedGameState(
  game: ChessGame,
  targetUsername?: string,
  finalFen?: string
): NormalizedGameState {
  const pgn = game.pgn || "";
  const pgnResult = getPgnTag(pgn, "Result");
  const pgnTermination = getPgnTag(pgn, "Termination") || "";

  // White and Black usernames
  const whiteUsername = game.white?.username || getPgnTag(pgn, "White") || "White";
  const blackUsername = game.black?.username || getPgnTag(pgn, "Black") || "Black";

  const cleanTarget = (targetUsername || "").trim().toLowerCase();
  const isUserWhite = cleanTarget ? whiteUsername.toLowerCase() === cleanTarget : false;
  const isUserBlack = cleanTarget ? blackUsername.toLowerCase() === cleanTarget : false;
  const userColor: "white" | "black" | null = isUserWhite ? "white" : isUserBlack ? "black" : null;

  // Determine game result (1-0, 0-1, 1/2-1/2, *)
  let status: GameStatus = "UNKNOWN";
  let winner: "white" | "black" | null = null;
  let loser: "white" | "black" | null = null;
  let isDraw = false;
  let isOngoing = false;
  let scoreText = "—";

  const whiteResultCode = (game.white?.result || "").toLowerCase();
  const blackResultCode = (game.black?.result || "").toLowerCase();

  if (
    pgnResult === "1-0" ||
    whiteResultCode === "win" ||
    ["checkmated", "resigned", "timeout", "abandoned"].includes(blackResultCode)
  ) {
    status = "WHITE_WON";
    winner = "white";
    loser = "black";
    scoreText = "1–0";
  } else if (
    pgnResult === "0-1" ||
    blackResultCode === "win" ||
    ["checkmated", "resigned", "timeout", "abandoned"].includes(whiteResultCode)
  ) {
    status = "BLACK_WON";
    winner = "black";
    loser = "white";
    scoreText = "0–1";
  } else if (
    pgnResult === "1/2-1/2" ||
    ["agreed", "repetition", "stalemate", "insufficient", "50move", "timevsinsufficient"].includes(whiteResultCode) ||
    ["agreed", "repetition", "stalemate", "insufficient", "50move", "timevsinsufficient"].includes(blackResultCode)
  ) {
    status = "DRAW";
    isDraw = true;
    scoreText = "½–½";
  } else if (pgnResult === "*" || (!whiteResultCode && !blackResultCode)) {
    status = "ONGOING";
    isOngoing = true;
    scoreText = "*";
  }

  // Header Title
  let headerTitle = "GAME OVER";
  if (status === "WHITE_WON") {
    headerTitle = "WHITE WINS · 1–0";
  } else if (status === "BLACK_WON") {
    headerTitle = "BLACK WINS · 0–1";
  } else if (status === "DRAW") {
    headerTitle = "½–½ · DRAW";
  } else if (status === "ONGOING") {
    headerTitle = "GAME IN PROGRESS";
  } else {
    headerTitle = "RESULT UNKNOWN";
  }

  // Termination reason
  let terminationType: TerminationType = "UNKNOWN";
  let terminationReason = "";

  const termLower = pgnTermination.toLowerCase();
  const rawCodes = `${whiteResultCode} ${blackResultCode} ${termLower}`;

  if (rawCodes.includes("checkmate") || rawCodes.includes("won by checkmate")) {
    terminationType = "CHECKMATE";
    terminationReason = "Checkmate";
  } else if (rawCodes.includes("resign")) {
    terminationType = "RESIGNATION";
    terminationReason = "Resignation";
  } else if (rawCodes.includes("timeout") || rawCodes.includes("time")) {
    terminationType = "TIMEOUT";
    terminationReason = "Timeout";
  } else if (rawCodes.includes("stalemate")) {
    terminationType = "STALEMATE";
    terminationReason = "Stalemate";
  } else if (rawCodes.includes("repetition")) {
    terminationType = "REPETITION";
    terminationReason = "Threefold Repetition";
  } else if (rawCodes.includes("agreed") || rawCodes.includes("agreement")) {
    terminationType = "AGREEMENT";
    terminationReason = "Draw by Agreement";
  } else if (rawCodes.includes("insufficient")) {
    terminationType = "INSUFFICIENT_MATERIAL";
    terminationReason = "Insufficient Material";
  } else if (rawCodes.includes("50move") || rawCodes.includes("fifty")) {
    terminationType = "FIFTY_MOVES";
    terminationReason = "50-Move Rule";
  } else if (rawCodes.includes("abandon")) {
    terminationType = "ABANDONED";
    terminationReason = "Abandoned";
  }

  // If no termination tag but final position is mate
  if (!terminationReason && finalFen && finalFen.includes("#")) {
    terminationType = "CHECKMATE";
    terminationReason = "Checkmate";
  }

  // Player result texts
  const getPlayerResult = (color: "white" | "black"): { result: "win" | "loss" | "draw" | "ongoing" | "unknown"; text: string } => {
    if (status === "ONGOING") return { result: "ongoing", text: "" };
    if (status === "UNKNOWN") return { result: "unknown", text: "" };
    if (isDraw) return { result: "draw", text: "DRAW" };
    if (winner === color) return { result: "win", text: "WIN" };
    return { result: "loss", text: "LOSS" };
  };

  const whiteRes = getPlayerResult("white");
  const blackRes = getPlayerResult("black");

  return {
    status,
    winner,
    loser,
    isDraw,
    isOngoing,
    scoreText,
    headerTitle,
    terminationType,
    terminationReason,
    whitePlayer: {
      username: whiteUsername,
      rating: game.white?.rating ?? "?",
      result: whiteRes.result,
      resultText: whiteRes.text,
      isUser: isUserWhite,
    },
    blackPlayer: {
      username: blackUsername,
      rating: game.black?.rating ?? "?",
      result: blackRes.result,
      resultText: blackRes.text,
      isUser: isUserBlack,
    },
    userColor,
  };
}

/**
 * Calculates current position state, turn, user-perspective eval, and king checks/checkmates.
 */
export function getPositionState(params: {
  currentPly: number;
  totalPlies: number;
  currentFen: string;
  whiteEval: number;
  userColor: "white" | "black" | null;
  activeMoveSan?: string;
  gameStatus: GameStatus;
}): PositionState {
  const { currentPly, totalPlies, currentFen, whiteEval, userColor, activeMoveSan, gameStatus } = params;

  const isFinalPosition = currentPly === totalPlies && totalPlies > 0;
  const isFinalMove = isFinalPosition;

  // Turn from FEN
  // FEN format: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  const fenParts = currentFen.split(" ");
  const activeColorChar = fenParts[1] || "w";
  const boardTurn: "white" | "black" = activeColorChar === "w" ? "white" : "black";

  // At the actual game-ending position, turn is GAME OVER
  const isGameOverAtEnd = isFinalPosition && gameStatus !== "ONGOING" && gameStatus !== "UNKNOWN";
  const currentTurn: "white" | "black" | "game_over" = isGameOverAtEnd ? "game_over" : boardTurn;

  let turnLabel = "";
  if (currentTurn === "game_over") {
    turnLabel = "GAME OVER";
  } else if (currentTurn === "white") {
    turnLabel = "WHITE TO MOVE";
  } else {
    turnLabel = "BLACK TO MOVE";
  }

  // Check / Checkmate detection
  const isCheckmate = isFinalPosition && (activeMoveSan?.includes("#") || false);
  const isCheck = (activeMoveSan?.includes("+") || isCheckmate) || false;

  // Locate the checked or checkmated king on the board
  let checkmatedKingSquare: string | null = null;
  let checkedKingSquare: string | null = null;

  if (isCheck || isCheckmate) {
    // The king that is in check is the king whose turn it currently is (or just checkmated)
    const victimKing = isCheckmate
      ? (activeMoveSan && boardTurn === "white" ? "K" : "k") // if white is to move, white king is mated
      : (boardTurn === "white" ? "K" : "k");

    // Scan FEN board rows to find the square of victimKing
    const rows = (fenParts[0] || "").split("/");
    for (let r = 0; r < 8; r++) {
      let col = 0;
      for (const char of rows[r]) {
        if (!isNaN(Number(char))) {
          col += Number(char);
        } else {
          if (char === victimKing) {
            const file = String.fromCharCode(97 + col);
            const rank = 8 - r;
            const sq = `${file}${rank}`;
            if (isCheckmate) {
              checkmatedKingSquare = sq;
            } else {
              checkedKingSquare = sq;
            }
            break;
          }
          col++;
        }
      }
    }
  }

  // User-perspective evaluation
  // Engine eval is White-centric (+ is White, - is Black)
  let evalScore = whiteEval;
  if (userColor === "black") {
    evalScore = -whiteEval;
  }

  let evalLabel = "";
  const absEval = Math.abs(whiteEval);
  const isAdvantage = userColor ? evalScore >= 0.5 : whiteEval >= 0.5;
  const isDisadvantage = userColor ? evalScore <= -0.5 : whiteEval <= -0.5;
  const isEqual = absEval < 0.5;

  if (userColor) {
    if (isEqual) {
      evalLabel = `ROUGHLY EQUAL (${whiteEval > 0 ? `+${whiteEval.toFixed(1)}` : whiteEval.toFixed(1)})`;
    } else if (evalScore > 0) {
      evalLabel = `YOUR ADVANTAGE +${evalScore.toFixed(1)}`;
    } else {
      evalLabel = `YOU ARE LOSING ${evalScore.toFixed(1)}`;
    }
  } else {
    // Neutral viewer
    if (isEqual) {
      evalLabel = `ROUGHLY EQUAL (${whiteEval > 0 ? `+${whiteEval.toFixed(1)}` : whiteEval.toFixed(1)})`;
    } else if (whiteEval > 0) {
      evalLabel = `WHITE ADVANTAGE +${whiteEval.toFixed(1)}`;
    } else {
      evalLabel = `BLACK ADVANTAGE ${whiteEval.toFixed(1)}`;
    }
  }

  return {
    isFinalPosition,
    isFinalMove,
    currentTurn,
    turnLabel,
    isCheck,
    isCheckmate,
    checkmatedKingSquare,
    checkedKingSquare,
    userPerspectiveEval: {
      score: evalScore,
      label: evalLabel,
      isAdvantage,
      isDisadvantage,
      isEqual,
    },
  };
}
