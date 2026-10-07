export interface ChessProfile {
  username: string;
  avatar?: string;
  name?: string;
  title?: string;
  followers: number;
  joined: number;
  status: string;
  url: string;
}

export interface ChessGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  tcn: string;
  uuid: string;
  initial_setup: string;
  fen: string;
  time_class: string;
  rules: string;
  white: {
    rating: number;
    result: string;
    "@id": string;
    username: string;
    uuid: string;
  };
  black: {
    rating: number;
    result: string;
    "@id": string;
    username: string;
    uuid: string;
  };
}

const HEADERS = {
  'User-Agent': 'ChessDNA-Phase1-App'
};

export async function getProfile(username: string): Promise<ChessProfile | null> {
  try {
    const res = await fetch(`https://api.chess.com/pub/player/${username}`, { headers: HEADERS, cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function getRecentGames(username: string, limit = 100): Promise<ChessGame[]> {
  try {
    // 1. Get archives
    const archiveRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`, { headers: HEADERS, cache: 'no-store' });
    if (!archiveRes.ok) return [];
    
    const { archives } = await archiveRes.json();
    if (!archives || archives.length === 0) return [];
    
    let allGames: ChessGame[] = [];
    
    // 2. Fetch backwards from the most recent archive until we hit the limit
    for (let i = archives.length - 1; i >= 0; i--) {
      const url = archives[i];
      const monthRes = await fetch(url, { headers: HEADERS, cache: 'no-store' });
      if (!monthRes.ok) continue;
      
      const { games } = await monthRes.json();
      allGames = allGames.concat(games);
      
      if (allGames.length >= limit) {
        break;
      }
    }
    
    // Sort games by end_time descending (newest first)
    allGames.sort((a, b) => b.end_time - a.end_time);
    
    return allGames.slice(0, limit);
  } catch (e) {
    return [];
  }
}

export async function getGameById(
  username: string,
  gameId: string
): Promise<ChessGame | null> {
  try {
    const games = await getRecentGames(username, 150);
    const found = games.find((g) => {
      const idFromUrl = g.url ? g.url.split("/").pop() : "";
      return idFromUrl === gameId || g.uuid === gameId || g.url.includes(gameId);
    });
    return found || null;
  } catch {
    return null;
  }
}

export interface ClubSummary {
  id: string;
  name: string;
  last_activity?: number;
  icon?: string;
  url: string;
  joined?: number;
}

export interface ClubDetails {
  id: string;
  name: string;
  club_id: number;
  icon?: string;
  url: string;
  members_count: number;
  created: number;
  last_activity: number;
  admin: string[];
  description: string;
}

export interface ClubMember {
  username: string;
  joined: number;
}

export interface LeaderboardPlayer {
  player_id: number;
  url: string;
  username: string;
  score: number;
  rank: number;
  title?: string;
  avatar?: string;
}

export interface Leaderboards {
  daily?: LeaderboardPlayer[];
  live_rapid?: LeaderboardPlayer[];
  live_blitz?: LeaderboardPlayer[];
  live_bullet?: LeaderboardPlayer[];
  tactics?: LeaderboardPlayer[];
}

export async function getPlayerClubs(username: string): Promise<ClubSummary[]> {
  try {
    const res = await fetch(`https://api.chess.com/pub/player/${username}/clubs`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.clubs || []).map((c: any) => ({
      id: c.url ? c.url.split("/").pop() || c.name : c.name,
      name: c.name,
      last_activity: c.last_activity,
      icon: c.icon,
      url: c.url,
      joined: c.joined,
    }));
  } catch {
    return [];
  }
}

export async function getClubDetails(clubId: string): Promise<ClubDetails | null> {
  try {
    const res = await fetch(`https://api.chess.com/pub/club/${clubId}`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: clubId,
      name: data.name,
      club_id: data.club_id,
      icon: data.icon,
      url: data.url,
      members_count: data.members_count || 0,
      created: data.created,
      last_activity: data.last_activity,
      admin: data.admin || [],
      description: data.description || "",
    };
  } catch {
    return null;
  }
}

export async function getClubMembers(clubId: string, limit = 20): Promise<ClubMember[]> {
  try {
    const res = await fetch(`https://api.chess.com/pub/club/${clubId}/members`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // weekly, monthly, and all-time members are returned
    const members: ClubMember[] = [];
    if (Array.isArray(data.weekly)) members.push(...data.weekly);
    if (Array.isArray(data.monthly)) members.push(...data.monthly);
    if (Array.isArray(data.all_time)) members.push(...data.all_time);

    // Deduplicate by username
    const unique = Array.from(new Map(members.map((m) => [m.username.toLowerCase(), m])).values());
    return unique.slice(0, limit);
  } catch {
    return [];
  }
}

export async function getLeaderboards(): Promise<Leaderboards | null> {
  try {
    const res = await fetch("https://api.chess.com/pub/leaderboards", {
      headers: HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

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


