import { AnalysisResult, ChessDNA } from "./chessAnalyzer";

export interface TraitComparison {
  name: string;
  p1Value: number;
  p2Value: number;
  diff: number; // p1 - p2
  leader: "p1" | "p2" | "tie";
  insight: string;
}

export interface MatchupAnalysis {
  traits: TraitComparison[];
  advantages: {
    p1: string[];
    p2: string[];
  };
  keyClash: string;
  clashDescription: string;
  verdict: string;
  stylisticEdge: "p1" | "p2" | "balanced";
}

export function compareDna(
  name1: string,
  res1: AnalysisResult,
  name2: string,
  res2: AnalysisResult
): MatchupAnalysis {
  const dna1 = res1.dna;
  const dna2 = res2.dna;

  const traitKeys: (keyof ChessDNA)[] = [
    "aggression",
    "tactics",
    "risk",
    "defense",
    "endgame",
    "speed",
  ];

  const traitLabels: Record<keyof ChessDNA, string> = {
    aggression: "Aggression",
    tactics: "Tactical Vision",
    risk: "Risk Tolerance",
    defense: "Defensive Resilience",
    endgame: "Endgame Mastery",
    speed: "Time Control & Speed",
  };

  const traits: TraitComparison[] = traitKeys.map((k) => {
    const v1 = dna1[k];
    const v2 = dna2[k];
    const diff = v1 - v2;
    const leader = diff > 4 ? "p1" : diff < -4 ? "p2" : "tie";

    let insight = "";
    if (k === "aggression") {
      insight =
        leader === "p1"
          ? `${name1} plays for early initiative and piece activity.`
          : leader === "p2"
          ? `${name2} dictates forward momentum and sharp attacks.`
          : "Both players possess evenly matched offensive drive.";
    } else if (k === "tactics") {
      insight =
        leader === "p1"
          ? `${name1} spots tactical conversions and forcing combinations faster.`
          : leader === "p2"
          ? `${name2} thrives in chaotic, highly calculating positions.`
          : "Both players calculate tactical lines at similar depth.";
    } else if (k === "defense") {
      insight =
        leader === "p1"
          ? `${name1} excels under siege and defends passive squares tenaciously.`
          : leader === "p2"
          ? `${name2} builds resilient defensive fortresses.`
          : "Both players maintain comparable defensive discipline.";
    } else if (k === "risk") {
      insight =
        leader === "p1"
          ? `${name1} is willing to gamble and enter double-edged complications.`
          : leader === "p2"
          ? `${name2} embraces wild, speculative sacrifices.`
          : "Both players exhibit a similar risk profile.";
    } else if (k === "endgame") {
      insight =
        leader === "p1"
          ? `${name1} excels in technical pawn and piece endgames.`
          : leader === "p2"
          ? `${name2} converts small endgame advantages with clinical precision.`
          : "Equal technical mastery when pieces get traded down.";
    } else {
      insight =
        leader === "p1"
          ? `${name1} plays comfortably at fast blitz pace.`
          : leader === "p2"
          ? `${name2} handles intense clock scrambles with composure.`
          : "Identical speed and clock management instincts.";
    }

    return {
      name: traitLabels[k],
      p1Value: v1,
      p2Value: v2,
      diff,
      leader,
      insight,
    };
  });

  const p1Advantages: string[] = [];
  const p2Advantages: string[] = [];

  traits.forEach((t) => {
    if (t.leader === "p1") p1Advantages.push(t.name);
    if (t.leader === "p2") p2Advantages.push(t.name);
  });

  // Stylistic Clash Detection
  let keyClash = `${res1.archetype.name} vs ${res2.archetype.name}`;
  let clashDescription = "";
  let verdict = "";
  let stylisticEdge: "p1" | "p2" | "balanced" = "balanced";

  if (dna1.aggression > dna2.defense + 15) {
    clashDescription = `${name1}'s aggressive storm threatens to overwhelm ${name2}'s defensive structure early in the game.`;
    verdict = `If ${name1} can breach the position before move 30, they hold a sharp stylistic edge. However, if ${name2} weathers the storm, the counterattack will be deadly.`;
    stylisticEdge = "p1";
  } else if (dna2.aggression > dna1.defense + 15) {
    clashDescription = `${name2}'s relentless forward pressure tests ${name1}'s patience and pawn structure.`;
    verdict = `${name2} controls the tempo of the matchup, forcing ${name1} into reactive, defensive survival mode.`;
    stylisticEdge = "p2";
  } else if (Math.abs(dna1.tactics - dna2.tactics) > 15) {
    const higherTactics = dna1.tactics > dna2.tactics ? name1 : name2;
    clashDescription = `Sharp tactical imbalance — ${higherTactics} spots intermediate moves and skewers far more consistently.`;
    verdict = `In open, tactical games, ${higherTactics} is heavily favored to find the decisive winning combination.`;
    stylisticEdge = dna1.tactics > dna2.tactics ? "p1" : "p2";
  } else if (Math.abs(dna1.endgame - dna2.endgame) > 15) {
    const higherEndgame = dna1.endgame > dna2.endgame ? name1 : name2;
    clashDescription = `Endgame conversion disparity — technical simplification favors ${higherEndgame}.`;
    verdict = `Trading pieces into an equal queenless endgame gives ${higherEndgame} a decisive grinding advantage.`;
    stylisticEdge = dna1.endgame > dna2.endgame ? "p1" : "p2";
  } else {
    clashDescription = `A finely balanced clash of styles between two distinct approaches.`;
    verdict = `This is a high-tension psychological duel. The outcome will depend entirely on who successfully steers the game into their preferred opening structures.`;
    stylisticEdge = "balanced";
  }

  return {
    traits,
    advantages: {
      p1: p1Advantages,
      p2: p2Advantages,
    },
    keyClash,
    clashDescription,
    verdict,
    stylisticEdge,
  };
}
