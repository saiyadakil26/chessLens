export interface DailyPuzzle {
  id: string;
  url: string;
  pgn: string;
  fen: string;
  rating: number;
  solution: string[];
  themes: string[];
  lastMove?: string;
}

export async function getDailyPuzzle(): Promise<DailyPuzzle | null> {
  try {
    const res = await fetch("https://lichess.org/api/puzzle/daily", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      id: data.puzzle.id,
      url: data.puzzle.url,
      pgn: data.game.pgn,
      fen: data.puzzle.fen,
      rating: data.puzzle.rating,
      solution: data.puzzle.solution,
      themes: data.puzzle.themes,
      lastMove: data.puzzle.lastMove,
    };
  } catch (e) {
    console.error("Failed to fetch daily puzzle", e);
    return null;
  }
}
