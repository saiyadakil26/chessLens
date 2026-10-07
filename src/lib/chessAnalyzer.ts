import { Chess } from 'chess.js';
import { ChessGame } from './chessApi';

export interface ChessDNA {
  aggression: number;
  tactics: number;
  risk: number;
  defense: number;
  endgame: number;
  speed: number;
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
}

export interface OpeningStats {
  name: string;
  count: number;
  winRate: number;
}

export interface GraveyardStats {
  fastestLoss: { moves: number; opening: string; url: string } | null;
  biggestUpset: { ratingDiff: number; opponentRating: number; url: string } | null;
}

export interface AnalysisResult {
  gameCount: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  dna: ChessDNA;
  archetype: Archetype;
  favoriteOpening: OpeningStats | null;
  signatureHabit: string;
  whiteGames: number;
  whiteWinRate: number;
  blackGames: number;
  blackWinRate: number;
  graveyard: GraveyardStats;
}

export function analyzeGames(username: string, games: ChessGame[]): AnalysisResult {
  let wins = 0;
  let losses = 0;
  let draws = 0;
  
  let whiteGames = 0;
  let whiteWins = 0;
  let blackGames = 0;
  let blackWins = 0;

  const openings: Record<string, { count: number; wins: number }> = {};
  
  // DNA Signals
  let totalMoves = 0;
  let gamesWithSacrifices = 0;
  let totalChecks = 0;
  let endgameCount = 0;
  let fastGames = 0;
  let forcingMoves = 0; // heuristic: captures and checks
  
  const graveyard: GraveyardStats = {
    fastestLoss: null,
    biggestUpset: null
  };
  
  games.forEach(g => {
    if (!g.pgn) return;
    
    const isWhite = g.white.username.toLowerCase() === username.toLowerCase();
    const myRating = isWhite ? g.white.rating : g.black.rating;
    const opponentRating = isWhite ? g.black.rating : g.white.rating;
    
    // Parse result
    const resultString = isWhite ? g.white.result : g.black.result;
    const isWin = resultString === 'win';
    const isDraw = ['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'].includes(resultString);
    const isLoss = !isWin && !isDraw;
    
    if (isWin) wins++;
    if (isDraw) draws++;
    if (isLoss) losses++;
    
    if (isWhite) {
      whiteGames++;
      if (isWin) whiteWins++;
    } else {
      blackGames++;
      if (isWin) blackWins++;
    }
    
    // Parse PGN to get ECO / Opening
    const ecoMatch = g.pgn.match(/\[ECO "(.*?)"\]/);
    const eco = ecoMatch ? ecoMatch[1] : null;
    
    // Simple opening grouping by ECO or just name if available.
    const urlMatch = g.pgn.match(/\[ECOUrl ".*?\/openings\/(.*?)"\]/);
    let openingName = "Unknown";
    if (urlMatch && urlMatch[1]) {
      openingName = urlMatch[1].replace(/-/g, ' ');
    } else if (eco) {
      openingName = `ECO ${eco}`;
    }
    
    if (!openings[openingName]) openings[openingName] = { count: 0, wins: 0 };
    openings[openingName].count++;
    if (isWin) openings[openingName].wins++;
    
    // Minimal game parsing with chess.js for basic DNA heuristics
    try {
      const chess = new Chess();
      chess.loadPgn(g.pgn);
      const history = chess.history({ verbose: true });
      const moveCount = history.length;
      totalMoves += moveCount;
      
      if (moveCount > 60) endgameCount++;
      if (g.time_class === 'blitz' || g.time_class === 'bullet') fastGames++;
      
      // Look for checks and captures
      history.forEach(move => {
        if (move.san.includes('+') || move.san.includes('#')) totalChecks++;
        if (move.san.includes('x')) forcingMoves++;
      });
      
      // Graveyard tracking
      if (isLoss) {
        // Fastest loss
        if (!graveyard.fastestLoss || moveCount < graveyard.fastestLoss.moves) {
          graveyard.fastestLoss = {
            moves: moveCount,
            opening: openingName,
            url: g.url
          };
        }
        
        // Biggest upset (lost to lower rated player)
        const ratingDiff = myRating - opponentRating;
        if (ratingDiff > 0 && (!graveyard.biggestUpset || ratingDiff > graveyard.biggestUpset.ratingDiff)) {
          graveyard.biggestUpset = {
            ratingDiff,
            opponentRating,
            url: g.url
          };
        }
      }
      
    } catch (e) {
      // ignore parse errors
    }
  });

  const gameCount = games.length || 1;
  
  // Calculate DNA (normalize to 0-100)
  // This is entirely heuristic and for entertainment.
  
  // Aggression: based on checks and forcing moves per game
  const avgChecks = totalChecks / gameCount; // normal maybe 2-4
  let aggression = Math.min(100, Math.round((avgChecks / 4) * 100));
  
  // Tactics: based on captures and forcing moves
  const avgForcing = forcingMoves / gameCount; // normal maybe 10-20
  let tactics = Math.min(100, Math.round((avgForcing / 20) * 100));
  
  // Risk: heuristic
  let risk = Math.min(100, Math.round((aggression * 0.6 + tactics * 0.4) * (Math.random() * 0.4 + 0.8)));
  
  // Defense: inverse of risk loosely, plus some randomness
  let defense = Math.max(0, 100 - risk + Math.floor(Math.random() * 20 - 10));
  
  // Endgame: games reaching high move counts
  let endgame = Math.min(100, Math.round((endgameCount / gameCount) * 200)); 
  
  // Speed: proportion of fast games
  let speed = Math.round((fastGames / gameCount) * 100);

  const dna = { aggression, tactics, risk, defense, endgame, speed };

  // Archetype matching
  const archetypes: Archetype[] = [
    { id: 'chaos_merchant', name: 'The Chaos Merchant', description: "You don't just play chess. You create problems and hope your opponent runs out of answers first." },
    { id: 'calculator', name: 'The Calculator', description: "You love positions where every move feels like a puzzle." },
    { id: 'fortress', name: 'The Fortress', description: "Your opponents may attack. They may sacrifice. They may scream. You are still there." },
    { id: 'technician', name: 'The Technician', description: "You are happiest when the fireworks are over and there is a technical position left to convert." },
    { id: 'speed_demon', name: 'The Speed Demon', description: "Thinking is optional. Clock management is not." },
    { id: 'gambit_goblin', name: 'The Gambit Goblin', description: "Material is temporary. Initiative is forever." },
    { id: 'strategist', name: 'The Strategist', description: "While everyone else is attacking, you are quietly improving your pieces." },
    { id: 'wildcard', name: 'The Wildcard', description: "Your games refuse to fit into a category. Even the algorithm gave up." },
  ];

  let archetype = archetypes[7]; // default wildcard
  if (speed > 80) archetype = archetypes[4];
  else if (aggression > 80 && risk > 80) archetype = archetypes[0]; // chaos
  else if (tactics > 80) archetype = archetypes[1]; // calculator
  else if (defense > 70) archetype = archetypes[2]; // fortress
  else if (endgame > 60) archetype = archetypes[3]; // technician
  else if (aggression > 70 && risk > 90) archetype = archetypes[5]; // gambit goblin
  else if (defense > 50 && endgame > 50) archetype = archetypes[6]; // strategist
  
  // Find favorite opening
  let favoriteOpening: OpeningStats | null = null;
  let maxCount = 0;
  for (const [name, stats] of Object.entries(openings)) {
    if (name !== 'Unknown' && stats.count > maxCount) {
      maxCount = stats.count;
      favoriteOpening = {
        name: name.split('/').pop() || name, // cleanup name
        count: stats.count,
        winRate: Math.round((stats.wins / stats.count) * 100)
      };
    }
  }
  
  // Signature habit
  let signatureHabit = "Not enough games to identify a strong pattern yet.";
  if (whiteGames > 5 && blackGames > 5) {
    const whiteWinRate = whiteWins / whiteGames;
    const blackWinRate = blackWins / blackGames;
    if (whiteWinRate > blackWinRate + 0.15) signatureHabit = "You play significantly more successfully with White.";
    else if (blackWinRate > whiteWinRate + 0.15) signatureHabit = "You are a counter-attacking specialist, winning more with Black.";
    else if (speed > 80) signatureHabit = "You thrive in fast time controls.";
    else if (endgame > 60) signatureHabit = "You regularly drag opponents into deep endgames.";
    else if (favoriteOpening && favoriteOpening.count > 10) signatureHabit = `Your ${favoriteOpening.name} games are your most common battles.`;
  }

  return {
    gameCount,
    wins,
    losses,
    draws,
    winRate: Math.round((wins / gameCount) * 100),
    dna,
    archetype,
    favoriteOpening,
    signatureHabit,
    whiteGames,
    whiteWinRate: whiteGames ? Math.round((whiteWins / whiteGames) * 100) : 0,
    blackGames,
    blackWinRate: blackGames ? Math.round((blackWins / blackGames) * 100) : 0,
    graveyard
  };
}
