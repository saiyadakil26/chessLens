export interface TournamentPlayer {
  username: string;
  status?: string;
}

export interface TournamentDetails {
  name: string;
  url: string;
  description?: string;
  creator?: string;
  status: string;
  finish_time?: number;
  settings: {
    type: string;
    rules: string;
    time_class: string;
    time_control: string;
    is_rated: boolean;
    is_official?: boolean;
    rounds?: number;
    min_rating?: number;
    max_rating?: number;
  };
  players: TournamentPlayer[];
  rounds: string[];
}

const HEADERS = {
  "User-Agent": "ChessDNA-Tournaments",
};

export async function getTournamentDetails(
  tournamentId: string
): Promise<TournamentDetails | null> {
  try {
    const res = await fetch(`https://api.chess.com/pub/tournament/${tournamentId}`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
