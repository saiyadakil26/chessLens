import { AnalyzedMove } from "./chessEngine";
import { OPENINGS_DATABASE, OpeningEntry } from "./openingDatabase";

export interface OpeningIdentification {
  family: string;
  name: string;
  variation?: string;
  eco: string;
  matchedLine: string[];
  theoryPlyEnd: number; // last ply matching known theory
  theoryMoveEnd: number; // move number
  firstDeviationPly: number | null; // ply that deviated
  firstDeviationMove: number | null; // move number
  firstDeviationSan: string | null;
  firstDeviationPlayer: "white" | "black" | null;
  theoryEndedText: string;
  whoDeviatedFirstText: string;
}

export interface PhaseTransition {
  openingEndMove: number;
  openingEndPly: number;
  transitionStartMove: number;
  transitionEndMove: number;
  middlegameStartMove: number;
  middlegameStartPly: number;
  endgameStartMove: number | null;
  endgameStartPly: number | null;
}

export interface PlayerPlanAnalysis {
  title: string;
  summary: string;
  themes: string[];
  execution: "successfully" | "mostly" | "partially" | "disrupted" | "unclear";
  executionLabel: string;
  executionScore: number;
}

export interface OpeningAssessment {
  evaluationAtTransition: number;
  perspectiveScore: number;
  status: "comfortable" | "slightly_better" | "equal" | "slightly_worse" | "difficult";
  headline: string;
  summary: string;
}

export interface OpeningTurningPoint {
  ply: number;
  moveNumber: number;
  side: "white" | "black";
  san: string;
  evalBefore: number;
  evalAfter: number;
  swing: number;
  description: string;
}

export interface BestWorstOpeningDecision {
  bestMove: {
    ply: number;
    moveNumber: number;
    side: "white" | "black";
    san: string;
    classification: string;
    description: string;
  } | null;
  worstMove: {
    ply: number;
    moveNumber: number;
    side: "white" | "black";
    san: string;
    classification: string;
    evalBefore: number;
    evalAfter: number;
    loss: number;
    bestSan: string;
    description: string;
  } | null;
}

export interface FullOpeningAnalysis {
  identification: OpeningIdentification;
  phases: PhaseTransition;
  whitePlan: PlayerPlanAnalysis;
  blackPlan: PlayerPlanAnalysis;
  userPlan: PlayerPlanAnalysis;
  opponentPlan: PlayerPlanAnalysis;
  assessment: OpeningAssessment;
  turningPoint: OpeningTurningPoint | null;
  decisions: BestWorstOpeningDecision;
  openingVsResult: string;
}

function cleanSan(san: string): string {
  return san.replace(/[+#?!]/g, "");
}

/**
 * 1. Identify opening from moves and PGN metadata
 */
export function identifyOpening(
  moves: AnalyzedMove[],
  pgn: string = ""
): OpeningIdentification {
  const moveSans = moves.map((m) => cleanSan(m.san));

  const pgnEcoMatch = pgn.match(/\[ECO "(.*?)"\]/);
  const pgnOpeningMatch = pgn.match(/\[Opening "(.*?)"\]/);
  const pgnEcoUrlMatch = pgn.match(/\[ECOUrl ".*?\/openings\/(.*?)"\]/);
  const pgnVariationMatch = pgn.match(/\[Variation "(.*?)"\]/);

  let pgnName = pgnOpeningMatch ? pgnOpeningMatch[1] : "";
  if (!pgnName && pgnEcoUrlMatch && pgnEcoUrlMatch[1]) {
    pgnName = pgnEcoUrlMatch[1].replace(/-/g, " ");
  }
  const pgnEco = pgnEcoMatch ? pgnEcoMatch[1] : "";
  const pgnVariation = pgnVariationMatch ? pgnVariationMatch[1] : undefined;

  let bestMatch: OpeningEntry | null = null;
  let maxMatchedMoves = 0;

  for (const entry of OPENINGS_DATABASE) {
    let matchCount = 0;
    for (let i = 0; i < entry.moves.length; i++) {
      if (i < moveSans.length && cleanSan(entry.moves[i]) === moveSans[i]) {
        matchCount++;
      } else {
        break;
      }
    }

    if (matchCount === entry.moves.length && matchCount > maxMatchedMoves) {
      bestMatch = entry;
      maxMatchedMoves = matchCount;
    }
  }

  const name = bestMatch?.name || pgnName || "Unclassified Opening";
  const eco = bestMatch?.eco || pgnEco || "A00";
  const family =
    bestMatch?.family ||
    (name.includes("Pawn") ? "Pawn Opening" : name.split(" ")[0] || "General Opening");
  const variation = bestMatch?.variation || pgnVariation;

  const theoryPlyEnd = Math.max(2, maxMatchedMoves);
  const theoryMoveEnd = Math.ceil(theoryPlyEnd / 2);

  let firstDeviationPly: number | null = null;
  let firstDeviationMove: number | null = null;
  let firstDeviationSan: string | null = null;
  let firstDeviationPlayer: "white" | "black" | null = null;

  if (moves.length > theoryPlyEnd) {
    firstDeviationPly = theoryPlyEnd + 1;
    const devMove = moves[theoryPlyEnd];
    if (devMove) {
      firstDeviationMove = devMove.moveNumber;
      firstDeviationSan = devMove.san;
      firstDeviationPlayer = devMove.side;
    }
  }

  const theoryEndedText = `Theory ended at Move ${theoryMoveEnd}${
    firstDeviationSan ? ` (${firstDeviationMove}. ${firstDeviationSan})` : ""
  }`;

  const whoDeviatedFirstText = firstDeviationPlayer
    ? `${firstDeviationPlayer === "white" ? "White" : "Black"} left known theory first`
    : "Both players followed known theory throughout";

  return {
    family,
    name,
    variation,
    eco,
    matchedLine: bestMatch ? bestMatch.moves : moveSans.slice(0, theoryPlyEnd),
    theoryPlyEnd,
    theoryMoveEnd,
    firstDeviationPly,
    firstDeviationMove,
    firstDeviationSan,
    firstDeviationPlayer,
    theoryEndedText,
    whoDeviatedFirstText,
  };
}

/**
 * 2. Detect game phase transitions (Opening, Transition, Middlegame, Endgame)
 */
export function detectPhases(
  moves: AnalyzedMove[],
  theoryMoveEnd: number
): PhaseTransition {
  const totalMoves = Math.ceil(moves.length / 2);

  const openingEndMove = Math.min(totalMoves, Math.max(theoryMoveEnd, 8));
  const openingEndPly = Math.min(moves.length, openingEndMove * 2);

  const transitionStartMove = openingEndMove + 1;
  const transitionEndMove = Math.min(totalMoves, transitionStartMove + 2);

  const middlegameStartMove = Math.min(totalMoves, transitionEndMove + 1);
  const middlegameStartPly = Math.min(moves.length, (middlegameStartMove - 1) * 2 + 1);

  let endgameStartMove: number | null = null;
  let endgameStartPly: number | null = null;

  if (totalMoves >= 32) {
    endgameStartMove = 30;
    endgameStartPly = 60;
  }

  return {
    openingEndMove,
    openingEndPly,
    transitionStartMove,
    transitionEndMove,
    middlegameStartMove,
    middlegameStartPly,
    endgameStartMove,
    endgameStartPly,
  };
}

/**
 * 3. Infer Strategic Opening Plans from move and position features
 */
export function inferPlayerPlan(
  moves: AnalyzedMove[],
  side: "white" | "black",
  theoryEndMove: number,
  evaluationAfterOpening: number
): PlayerPlanAnalysis {
  const openingMoves = moves
    .slice(0, Math.min(moves.length, theoryEndMove * 2 + 4))
    .filter((m) => m.side === side);

  const themes: string[] = [];
  const sans = openingMoves.map((m) => m.san);

  let hasCastled = false;
  let hasCentralPawnBreak = false;
  let hasQueensideDevelopment = false;
  let hasKingsidePressure = false;
  let minorPieceMoves = 0;

  for (const san of sans) {
    if (san.includes("O-O")) hasCastled = true;
    if (
      san.includes("d4") ||
      san.includes("d5") ||
      san.includes("e4") ||
      san.includes("e5") ||
      san.includes("c4") ||
      san.includes("c5")
    ) {
      hasCentralPawnBreak = true;
    }
    if (san.startsWith("N") || san.startsWith("B")) minorPieceMoves++;
    if (san.includes("c") || san.includes("b") || san.includes("a")) hasQueensideDevelopment = true;
    if (san.includes("f") || san.includes("g") || san.includes("h")) hasKingsidePressure = true;
  }

  if (hasCentralPawnBreak) themes.push("Controlling & contesting the center");
  if (minorPieceMoves >= 2) themes.push("Rapid minor piece development");
  if (hasCastled) themes.push("Securing early king safety with castling");
  if (hasKingsidePressure) themes.push("Preparing flexible kingside activity");
  if (hasQueensideDevelopment) themes.push("Queenside harmonic piece coordination");

  if (themes.length === 0) {
    themes.push("Standard opening development");
  }

  let title =
    side === "white"
      ? "Kingside development & central space"
      : "Central counterplay & piece activity";
  if (!hasCastled && minorPieceMoves >= 3) {
    title = "Aggressive piece mobilization without early castling";
  } else if (hasCentralPawnBreak && hasCastled) {
    title =
      side === "white"
        ? "Harmonious central control & early king safety"
        : "Solid central counter-strike & rapid castling";
  }

  const summary = `${side === "white" ? "White" : "Black"}'s moves suggest an emphasis on ${themes
    .slice(0, 2)
    .join(" and ")
    .toLowerCase()}.`;

  const playerEval = side === "white" ? evaluationAfterOpening : -evaluationAfterOpening;
  let execution: PlayerPlanAnalysis["execution"] = "mostly";
  let executionLabel = "Mostly executed";
  let executionScore = 7;

  if (playerEval >= 1.0) {
    execution = "successfully";
    executionLabel = "Successfully executed";
    executionScore = 9;
  } else if (playerEval >= 0.0) {
    execution = "mostly";
    executionLabel = "Mostly executed";
    executionScore = 7;
  } else if (playerEval >= -0.8) {
    execution = "partially";
    executionLabel = "Partially executed";
    executionScore = 5;
  } else {
    execution = "disrupted";
    executionLabel = "Plan disrupted by opponent";
    executionScore = 3;
  }

  return {
    title,
    summary,
    themes,
    execution,
    executionLabel,
    executionScore,
  };
}

/**
 * 4. Opening Assessment around transition
 */
export function assessOpeningOutcome(
  evalAtTransition: number,
  userColor: "white" | "black" | null
): OpeningAssessment {
  const perspectiveScore = userColor === "black" ? -evalAtTransition : evalAtTransition;

  let status: OpeningAssessment["status"] = "equal";
  let headline = "Roughly Equal";
  let summary = "Both sides reached an evenly balanced middlegame.";

  if (perspectiveScore >= 1.2) {
    status = "comfortable";
    headline = userColor ? "Comfortable advantage" : "White gained clear advantage";
    summary = userColor
      ? "You transitioned out of the opening with strong piece activity and a comfortable initiative."
      : "White established solid control and exited the opening comfortably ahead.";
  } else if (perspectiveScore >= 0.4) {
    status = "slightly_better";
    headline = userColor ? "Slightly better position" : "White holds a slight edge";
    summary = userColor
      ? "You achieved a pleasant position with active piece play and solid structure."
      : "White holds a modest strategic edge moving into the middlegame.";
  } else if (perspectiveScore <= -1.2) {
    status = "difficult";
    headline = userColor ? "Difficult position" : "Black seized a major advantage";
    summary = userColor
      ? "Opponent found active counterplay early, putting your setup under pressure."
      : "Black punished inaccuracies to take control of the opening battle.";
  } else if (perspectiveScore <= -0.4) {
    status = "slightly_worse";
    headline = userColor ? "Slightly worse position" : "Black holds a slight edge";
    summary = userColor
      ? "Opponent gained slightly better piece coordination going into the middlegame."
      : "Black created slightly better central pressure exiting the opening.";
  }

  return {
    evaluationAtTransition: evalAtTransition,
    perspectiveScore,
    status,
    headline,
    summary,
  };
}

/**
 * 5. Detect Opening Turning Point & Key Decisions
 */
export function analyzeOpeningDecisions(
  moves: AnalyzedMove[],
  openingEndPly: number
): {
  turningPoint: OpeningTurningPoint | null;
  decisions: BestWorstOpeningDecision;
} {
  const openingMoves = moves.slice(0, openingEndPly);

  let turningPoint: OpeningTurningPoint | null = null;
  let maxSwing = 0;

  let bestMove: BestWorstOpeningDecision["bestMove"] = null;
  let worstMove: BestWorstOpeningDecision["worstMove"] = null;
  let maxLoss = 0;

  for (const m of openingMoves) {
    const swing = Math.abs(m.evalAfter - m.evalBefore);
    if (swing > maxSwing && swing >= 0.8) {
      maxSwing = swing;
      turningPoint = {
        ply: m.ply,
        moveNumber: m.moveNumber,
        side: m.side,
        san: m.san,
        evalBefore: m.evalBefore,
        evalAfter: m.evalAfter,
        swing: Number(swing.toFixed(1)),
        description: `Move ${m.moveNumber} (${m.san}) was the decisive moment in the opening, swinging the evaluation by ${swing.toFixed(1)} pawns.`,
      };
    }

    if (["brilliant", "excellent"].includes(m.classification) && !bestMove) {
      bestMove = {
        ply: m.ply,
        moveNumber: m.moveNumber,
        side: m.side,
        san: m.san,
        classification: m.classification,
        description: "Preserved harmonic development and consolidated the opening position.",
      };
    }

    if (
      m.centipawnLoss > maxLoss &&
      ["blunder", "mistake", "inaccuracy"].includes(m.classification)
    ) {
      maxLoss = m.centipawnLoss;
      worstMove = {
        ply: m.ply,
        moveNumber: m.moveNumber,
        side: m.side,
        san: m.san,
        classification: m.classification,
        evalBefore: m.evalBefore,
        evalAfter: m.evalAfter,
        loss: m.centipawnLoss,
        bestSan: m.bestMoveSan,
        description: `Conceded tempo or central control; engine preferred ${m.bestMoveSan}.`,
      };
    }
  }

  return {
    turningPoint,
    decisions: {
      bestMove,
      worstMove,
    },
  };
}

/**
 * 6. Full Opening & Game Plan Analysis Pipeline
 */
export function generateFullOpeningAnalysis(params: {
  moves: AnalyzedMove[];
  pgn: string;
  userColor: "white" | "black" | null;
  gameWinner: "white" | "black" | null;
  isDraw: boolean;
}): FullOpeningAnalysis {
  const { moves, pgn, userColor, gameWinner, isDraw } = params;

  const identification = identifyOpening(moves, pgn);
  const phases = detectPhases(moves, identification.theoryMoveEnd);

  const transitionMoveIndex = Math.min(moves.length - 1, phases.openingEndPly - 1);
  const evalAtTransition = moves[transitionMoveIndex]?.evalAfter ?? 0;

  const whitePlan = inferPlayerPlan(moves, "white", identification.theoryMoveEnd, evalAtTransition);
  const blackPlan = inferPlayerPlan(moves, "black", identification.theoryMoveEnd, evalAtTransition);

  const userPlan = userColor === "black" ? blackPlan : whitePlan;
  const opponentPlan = userColor === "black" ? whitePlan : blackPlan;

  const assessment = assessOpeningOutcome(evalAtTransition, userColor);
  const { turningPoint, decisions } = analyzeOpeningDecisions(moves, phases.openingEndPly);

  let openingVsResult = "";
  const userWon = userColor && gameWinner === userColor;
  const userLost = userColor && gameWinner && gameWinner !== userColor;

  if (userWon) {
    if (assessment.status === "comfortable" || assessment.status === "slightly_better") {
      openingVsResult =
        "You built a solid opening foundation and successfully converted the initiative into victory.";
    } else {
      openingVsResult =
        "Despite a challenging opening phase, you mounted an effective comeback in the middlegame to secure the win.";
    }
  } else if (userLost) {
    if (assessment.status === "comfortable" || assessment.status === "slightly_better") {
      openingVsResult =
        "You left the opening with a comfortable position, but later conceded the advantage during middlegame tactical complications.";
    } else {
      openingVsResult =
        "Opponent capitalized on early opening pressure and maintained the initiative to the end.";
    }
  } else if (isDraw) {
    openingVsResult = "A closely contested opening phase led to a balanced, hard-fought draw.";
  } else {
    openingVsResult = "The opening set the stage for an intense strategic clash between both sides.";
  }

  return {
    identification,
    phases,
    whitePlan,
    blackPlan,
    userPlan,
    opponentPlan,
    assessment,
    turningPoint,
    decisions,
    openingVsResult,
  };
}
