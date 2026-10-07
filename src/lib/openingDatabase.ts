/**
 * Chess Openings Database
 * High-frequency ECO and opening lines for deterministic detection
 */

export interface OpeningEntry {
  eco: string;
  name: string;
  variation?: string;
  moves: string[]; // sequence of SAN moves, e.g. ["e4", "e5", "Nf3", "Nc6", "Bc4"]
  family: string;
}

export const OPENINGS_DATABASE: OpeningEntry[] = [
  // Italian Game & Bishop Opening
  { eco: "C50", name: "Italian Game", variation: "Giuoco Piano", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"], family: "King's Pawn Opening" },
  { eco: "C55", name: "Italian Game", variation: "Two Knights Defense", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6"], family: "King's Pawn Opening" },
  { eco: "C50", name: "Italian Game", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"], family: "King's Pawn Opening" },
  { eco: "C23", name: "Bishop's Opening", variation: "Berlin Defense", moves: ["e4", "e5", "Bc4", "Nf6"], family: "King's Pawn Opening" },
  { eco: "C24", name: "Bishop's Opening", variation: "Berlin Defense, Ponziani", moves: ["e4", "e5", "Bc4", "Nf6", "d3"], family: "King's Pawn Opening" },
  { eco: "C23", name: "Bishop's Opening", moves: ["e4", "e5", "Bc4"], family: "King's Pawn Opening" },

  // Ruy Lopez
  { eco: "C60", name: "Ruy Lopez", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"], family: "King's Pawn Opening" },
  { eco: "C65", name: "Ruy Lopez", variation: "Berlin Defense", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"], family: "King's Pawn Opening" },
  { eco: "C70", name: "Ruy Lopez", variation: "Morphy Defense", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"], family: "King's Pawn Opening" },
  { eco: "C78", name: "Ruy Lopez", variation: "Closed Defense", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7"], family: "King's Pawn Opening" },

  // Scotch Game
  { eco: "C45", name: "Scotch Game", moves: ["e4", "e5", "Nf3", "Nc6", "d4"], family: "King's Pawn Opening" },
  { eco: "C45", name: "Scotch Game", variation: "Classical Variation", moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Bc5"], family: "King's Pawn Opening" },

  // Vienna Game & King's Gambit
  { eco: "C25", name: "Vienna Game", moves: ["e4", "e5", "Nc3"], family: "King's Pawn Opening" },
  { eco: "C30", name: "King's Gambit", moves: ["e4", "e5", "f4"], family: "King's Pawn Opening" },
  { eco: "C33", name: "King's Gambit Accepted", moves: ["e4", "e5", "f4", "exf4"], family: "King's Pawn Opening" },
  { eco: "C40", name: "King's Knight Opening", moves: ["e4", "e5", "Nf3"], family: "King's Pawn Opening" },

  // Sicilian Defense
  { eco: "B20", name: "Sicilian Defense", moves: ["e4", "c5"], family: "Sicilian Defense" },
  { eco: "B21", name: "Sicilian Defense", variation: "Grand Prix Attack", moves: ["e4", "c5", "f4"], family: "Sicilian Defense" },
  { eco: "B22", name: "Sicilian Defense", variation: "Alapin Variation", moves: ["e4", "c5", "c3"], family: "Sicilian Defense" },
  { eco: "B23", name: "Sicilian Defense", variation: "Closed", moves: ["e4", "c5", "Nc3"], family: "Sicilian Defense" },
  { eco: "B27", name: "Sicilian Defense", variation: "Open Sicilian", moves: ["e4", "c5", "Nf3"], family: "Sicilian Defense" },
  { eco: "B30", name: "Sicilian Defense", variation: "Old Sicilian", moves: ["e4", "c5", "Nf3", "Nc6"], family: "Sicilian Defense" },
  { eco: "B32", name: "Sicilian Defense", variation: "Open, d4", moves: ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4"], family: "Sicilian Defense" },
  { eco: "B50", name: "Sicilian Defense", variation: "Modern", moves: ["e4", "c5", "Nf3", "d6"], family: "Sicilian Defense" },
  { eco: "B90", name: "Sicilian Defense", variation: "Najdorf Variation", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"], family: "Sicilian Defense" },
  { eco: "B70", name: "Sicilian Defense", variation: "Dragon Variation", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"], family: "Sicilian Defense" },
  { eco: "B40", name: "Sicilian Defense", variation: "French Variation", moves: ["e4", "c5", "Nf3", "e6"], family: "Sicilian Defense" },

  // French Defense
  { eco: "C00", name: "French Defense", moves: ["e4", "e6"], family: "French Defense" },
  { eco: "C02", name: "French Defense", variation: "Advance Variation", moves: ["e4", "e6", "d4", "d5", "e5"], family: "French Defense" },
  { eco: "C01", name: "French Defense", variation: "Exchange Variation", moves: ["e4", "e6", "d4", "d5", "exd5", "exd5"], family: "French Defense" },
  { eco: "C05", name: "French Defense", variation: "Tarrasch Variation", moves: ["e4", "e6", "d4", "d5", "Nd2"], family: "French Defense" },
  { eco: "C10", name: "French Defense", variation: "Classical Variation", moves: ["e4", "e6", "d4", "d5", "Nc3"], family: "French Defense" },

  // Caro-Kann Defense
  { eco: "B10", name: "Caro-Kann Defense", moves: ["e4", "c6"], family: "Caro-Kann Defense" },
  { eco: "B12", name: "Caro-Kann Defense", variation: "Advance Variation", moves: ["e4", "c6", "d4", "d5", "e5"], family: "Caro-Kann Defense" },
  { eco: "B13", name: "Caro-Kann Defense", variation: "Exchange Variation", moves: ["e4", "c6", "d4", "d5", "exd5", "cxd5"], family: "Caro-Kann Defense" },
  { eco: "B15", name: "Caro-Kann Defense", variation: "Main Line", moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4"], family: "Caro-Kann Defense" },

  // Scandinavian, Pirc, Modern
  { eco: "B01", name: "Scandinavian Defense", moves: ["e4", "d5"], family: "King's Pawn Opening" },
  { eco: "B01", name: "Scandinavian Defense", variation: "Mieses-Kotroc Variation", moves: ["e4", "d5", "exd5", "Qxd5"], family: "King's Pawn Opening" },
  { eco: "B07", name: "Pirc Defense", moves: ["e4", "d6", "d4", "Nf6"], family: "King's Pawn Opening" },
  { eco: "B06", name: "Modern Defense", moves: ["e4", "g6"], family: "King's Pawn Opening" },
  { eco: "B02", name: "Alekhine Defense", moves: ["e4", "Nf6"], family: "King's Pawn Opening" },

  // Queen's Pawn Opening / Queen's Gambit
  { eco: "D00", name: "Queen's Pawn Game", moves: ["d4", "d5"], family: "Queen's Pawn Opening" },
  { eco: "D02", name: "London System", moves: ["d4", "d5", "Nf3", "Nf6", "Bf4"], family: "Queen's Pawn Opening" },
  { eco: "D00", name: "London System", moves: ["d4", "d5", "Bf4"], family: "Queen's Pawn Opening" },
  { eco: "D06", name: "Queen's Gambit", moves: ["d4", "d5", "c4"], family: "Queen's Gambit" },
  { eco: "D20", name: "Queen's Gambit Accepted", moves: ["d4", "d5", "c4", "dxc4"], family: "Queen's Gambit" },
  { eco: "D30", name: "Queen's Gambit Declined", moves: ["d4", "d5", "c4", "e6"], family: "Queen's Gambit" },
  { eco: "D35", name: "Queen's Gambit Declined", variation: "Exchange Variation", moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "cxd5", "exd5"], family: "Queen's Gambit" },
  { eco: "D10", name: "Slav Defense", moves: ["d4", "d5", "c4", "c6"], family: "Queen's Gambit" },
  { eco: "D11", name: "Slav Defense", variation: "Modern Line", moves: ["d4", "d5", "c4", "c6", "Nf3", "Nf6"], family: "Queen's Gambit" },
  { eco: "D43", name: "Semi-Slav Defense", moves: ["d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "e6"], family: "Queen's Gambit" },

  // Indian Defenses
  { eco: "A45", name: "Queen's Pawn Game", moves: ["d4", "Nf6"], family: "Queen's Pawn Opening" },
  { eco: "A46", name: "Torre Attack", moves: ["d4", "Nf6", "Nf3", "e6", "Bg5"], family: "Queen's Pawn Opening" },
  { eco: "A48", name: "King's Indian Attack", moves: ["d4", "Nf6", "Nf3", "g6"], family: "Queen's Pawn Opening" },
  { eco: "E60", name: "King's Indian Defense", moves: ["d4", "Nf6", "c4", "g6"], family: "Indian Defense" },
  { eco: "E61", name: "King's Indian Defense", variation: "Classical Setup", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6"], family: "Indian Defense" },
  { eco: "E20", name: "Nimzo-Indian Defense", moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"], family: "Indian Defense" },
  { eco: "E00", name: "Catalan Opening", moves: ["d4", "Nf6", "c4", "e6", "g3"], family: "Queen's Pawn Opening" },
  { eco: "E11", name: "Bogo-Indian Defense", moves: ["d4", "Nf6", "c4", "e6", "Nf3", "Bb4+"], family: "Indian Defense" },
  { eco: "E12", name: "Queen's Indian Defense", moves: ["d4", "Nf6", "c4", "e6", "Nf3", "b6"], family: "Indian Defense" },
  { eco: "A80", name: "Dutch Defense", moves: ["d4", "f5"], family: "Dutch Defense" },
  { eco: "A56", name: "Benoni Defense", moves: ["d4", "Nf6", "c4", "c5", "d5"], family: "Benoni Defense" },
  { eco: "D70", name: "Grunfeld Defense", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "d5"], family: "Grunfeld Defense" },

  // Flank Openings
  { eco: "A10", name: "English Opening", moves: ["c4"], family: "English Opening" },
  { eco: "A20", name: "English Opening", variation: "King's English", moves: ["c4", "e5"], family: "English Opening" },
  { eco: "A30", name: "English Opening", variation: "Symmetrical", moves: ["c4", "c5"], family: "English Opening" },
  { eco: "A15", name: "English Opening", variation: "Anglo-Indian", moves: ["c4", "Nf6"], family: "English Opening" },
  { eco: "A04", name: "Réti Opening", moves: ["Nf3"], family: "Flank Opening" },
  { eco: "A05", name: "Réti Opening", variation: "King's Indian Attack", moves: ["Nf3", "Nf6", "g3"], family: "Flank Opening" },
  { eco: "A02", name: "Bird's Opening", moves: ["f4"], family: "Flank Opening" },
  { eco: "B00", name: "King's Pawn Opening", moves: ["e4"], family: "King's Pawn Opening" },
  { eco: "D00", name: "Queen's Pawn Opening", moves: ["d4"], family: "Queen's Pawn Opening" },
];
