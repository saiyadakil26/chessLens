import { ChessDNA } from "./chessAnalyzer";

export interface Competitor {
  id: string;
  name: string;
  title?: string;
  rating: number;
  archetype: string;
  dna: ChessDNA;
}

export interface MatchResult {
  roundName: string;
  player1: Competitor;
  player2: Competitor;
  score1: number;
  score2: number;
  winner: Competitor;
  decidingFactor: string;
}

export interface BracketSimulation {
  tournamentName: string;
  timeClass: "bullet" | "blitz" | "rapid" | "classical";
  rounds: {
    name: string;
    matches: MatchResult[];
  }[];
  champion: Competitor;
  runnerUp: Competitor;
}

// Built-in famous competitors with archetypes and DNA profiles for fast simulation
export const FAMOUS_COMPETITORS: Competitor[] = [
  {
    id: "magnus",
    name: "Magnus Carlsen",
    title: "GM",
    rating: 2882,
    archetype: "The Technician",
    dna: { aggression: 78, tactics: 92, risk: 45, defense: 95, endgame: 99, speed: 94 },
  },
  {
    id: "hikaru",
    name: "Hikaru Nakamura",
    title: "GM",
    rating: 2875,
    archetype: "The Speed Demon",
    dna: { aggression: 88, tactics: 94, risk: 78, defense: 88, endgame: 91, speed: 100 },
  },
  {
    id: "alireza",
    name: "Alireza Firouzja",
    title: "GM",
    rating: 2805,
    archetype: "The Chaos Merchant",
    dna: { aggression: 96, tactics: 95, risk: 89, defense: 75, endgame: 82, speed: 96 },
  },
  {
    id: "fabiano",
    name: "Fabiano Caruana",
    title: "GM",
    rating: 2795,
    archetype: "The Calculator",
    dna: { aggression: 75, tactics: 98, risk: 50, defense: 90, endgame: 89, speed: 79 },
  },
  {
    id: "danya",
    name: "Daniel Naroditsky",
    title: "GM",
    rating: 2680,
    archetype: "The Speed Demon",
    dna: { aggression: 90, tactics: 91, risk: 70, defense: 78, endgame: 85, speed: 98 },
  },
  {
    id: "gotham",
    name: "Levy Rozman",
    title: "IM",
    rating: 2360,
    archetype: "The Gambit Goblin",
    dna: { aggression: 92, tactics: 82, risk: 88, defense: 60, endgame: 68, speed: 85 },
  },
  {
    id: "rosen",
    name: "Eric Rosen",
    title: "IM",
    rating: 2380,
    archetype: "The Swindler",
    dna: { aggression: 65, tactics: 84, risk: 80, defense: 86, endgame: 78, speed: 80 },
  },
  {
    id: "dubov",
    name: "Daniil Dubov",
    title: "GM",
    rating: 2710,
    archetype: "The Wildcard",
    dna: { aggression: 98, tactics: 92, risk: 95, defense: 68, endgame: 79, speed: 90 },
  },
];

export function simulateMatch(
  p1: Competitor,
  p2: Competitor,
  roundName: string,
  timeClass: "bullet" | "blitz" | "rapid" | "classical"
): MatchResult {
  // Calculate weighted combat power based on tournament time class
  let p1Power = 0;
  let p2Power = 0;
  let decidingFactor = "";

  if (timeClass === "bullet") {
    p1Power = p1.dna.speed * 0.45 + p1.dna.tactics * 0.35 + p1.dna.aggression * 0.2;
    p2Power = p2.dna.speed * 0.45 + p2.dna.tactics * 0.35 + p2.dna.aggression * 0.2;
    decidingFactor = "Flagging velocity and premove tactics decided the armageddon game.";
  } else if (timeClass === "blitz") {
    p1Power = p1.dna.speed * 0.35 + p1.dna.tactics * 0.35 + p1.dna.aggression * 0.3;
    p2Power = p2.dna.speed * 0.35 + p2.dna.tactics * 0.35 + p2.dna.aggression * 0.3;
    decidingFactor = "Sharp tactical awareness under extreme 3-minute time pressure.";
  } else if (timeClass === "rapid") {
    p1Power = p1.dna.tactics * 0.3 + p1.dna.endgame * 0.3 + p1.dna.defense * 0.25 + p1.dna.speed * 0.15;
    p2Power = p2.dna.tactics * 0.3 + p2.dna.endgame * 0.3 + p2.dna.defense * 0.25 + p2.dna.speed * 0.15;
    decidingFactor = "Superior middle-game strategy and technical endgame conversion.";
  } else {
    // Classical
    p1Power = p1.dna.endgame * 0.4 + p1.dna.defense * 0.35 + p1.dna.tactics * 0.25;
    p2Power = p2.dna.endgame * 0.4 + p2.dna.defense * 0.35 + p2.dna.tactics * 0.25;
    decidingFactor = "Deep calculation, prophylaxis, and master-level positional strangulation.";
  }

  // Factor in rating difference (slight edge to higher rating)
  const ratingDelta = (p1.rating - p2.rating) * 0.05;
  p1Power += ratingDelta;

  // Deterministic seed variance based on player IDs to prevent prerender Math.random errors
  const seedString = `${p1.id}-${p2.id}-${roundName}-${timeClass}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const variance = ((Math.abs(hash) % 100) / 100 - 0.5) * 6;
  const winner = p1Power + variance >= p2Power ? p1 : p2;

  const score1 = winner === p1 ? 2.5 : 1.5;
  const score2 = winner === p1 ? 1.5 : 2.5;

  return {
    roundName,
    player1: p1,
    player2: p2,
    score1,
    score2,
    winner,
    decidingFactor: `${winner.name} capitalized through ${winner.archetype.toLowerCase()} style. ${decidingFactor}`,
  };
}

export function simulateBracket(
  competitors: Competitor[],
  tournamentName: string,
  timeClass: "bullet" | "blitz" | "rapid" | "classical" = "blitz"
): BracketSimulation {
  const is8 = competitors.length >= 8;
  const selected = competitors.slice(0, is8 ? 8 : 4);

  const rounds: { name: string; matches: MatchResult[] }[] = [];

  let currentPool = [...selected];

  if (is8) {
    // Quarterfinals
    const qfMatches: MatchResult[] = [];
    const nextPool: Competitor[] = [];
    for (let i = 0; i < 4; i++) {
      const match = simulateMatch(currentPool[i * 2], currentPool[i * 2 + 1], "Quarterfinals", timeClass);
      qfMatches.push(match);
      nextPool.push(match.winner);
    }
    rounds.push({ name: "Quarterfinals", matches: qfMatches });
    currentPool = nextPool;
  }

  // Semifinals
  const sfMatches: MatchResult[] = [];
  const finalistPool: Competitor[] = [];
  for (let i = 0; i < 2; i++) {
    const match = simulateMatch(currentPool[i * 2], currentPool[i * 2 + 1], "Semifinals", timeClass);
    sfMatches.push(match);
    finalistPool.push(match.winner);
  }
  rounds.push({ name: "Semifinals", matches: sfMatches });

  // Grand Finals
  const finalMatch = simulateMatch(finalistPool[0], finalistPool[1], "Grand Finals", timeClass);
  rounds.push({ name: "Grand Finals", matches: [finalMatch] });

  const champion = finalMatch.winner;
  const runnerUp = champion === finalistPool[0] ? finalistPool[1] : finalistPool[0];

  return {
    tournamentName,
    timeClass,
    rounds,
    champion,
    runnerUp,
  };
}
