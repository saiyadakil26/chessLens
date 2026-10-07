"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaderboards, LeaderboardPlayer } from "@/lib/chessApi";
import { Trophy, Flame, Zap, Timer, ArrowUpRight } from "lucide-react";

const CURATED_SPOTLIGHT: Record<string, LeaderboardPlayer[]> = {
  rapid: [
    { player_id: 1, rank: 1, username: "magnuscarlsen", score: 2882, title: "GM", url: "" },
    { player_id: 2, rank: 2, username: "hikaru", score: 2875, title: "GM", url: "" },
    { player_id: 3, rank: 3, username: "firouzja2003", score: 2805, title: "GM", url: "" },
    { player_id: 4, rank: 4, username: "fabianocaruana", score: 2795, title: "GM", url: "" },
    { player_id: 5, rank: 5, username: "danielnaroditsky", score: 2680, title: "GM", url: "" },
  ],
  blitz: [
    { player_id: 6, rank: 1, username: "hikaru", score: 3240, title: "GM", url: "" },
    { player_id: 7, rank: 2, username: "magnuscarlsen", score: 3218, title: "GM", url: "" },
    { player_id: 8, rank: 3, username: "firouzja2003", score: 3180, title: "GM", url: "" },
    { player_id: 9, rank: 4, username: "nihalsarin", score: 3120, title: "GM", url: "" },
    { player_id: 10, rank: 5, username: "danielnaroditsky", score: 3090, title: "GM", url: "" },
  ],
  bullet: [
    { player_id: 11, rank: 1, username: "hikaru", score: 3380, title: "GM", url: "" },
    { player_id: 12, rank: 2, username: "danielnaroditsky", score: 3310, title: "GM", url: "" },
    { player_id: 13, rank: 3, username: "tangelo", score: 3290, title: "GM", url: "" },
    { player_id: 14, rank: 4, username: "firouzja2003", score: 3270, title: "GM", url: "" },
    { player_id: 15, rank: 5, username: "magnuscarlsen", score: 3260, title: "GM", url: "" },
  ],
};

export default function CommunityLeaderboard({
  leaderboards,
}: {
  leaderboards?: Leaderboards | null;
}) {
  const [activeTab, setActiveTab] = useState<"rapid" | "blitz" | "bullet">("blitz");

  const players =
    (activeTab === "rapid"
      ? leaderboards?.live_rapid
      : activeTab === "blitz"
      ? leaderboards?.live_blitz
      : leaderboards?.live_bullet) || CURATED_SPOTLIGHT[activeTab];

  const displayList = players.slice(0, 10);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs uppercase font-bold tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            Top Community Masters
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Hall of Legends
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center bg-background p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("rapid")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "rapid"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            Rapid
          </button>
          <button
            onClick={() => setActiveTab("blitz")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "blitz"
                ? "bg-card text-accent shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Blitz
          </button>
          <button
            onClick={() => setActiveTab("bullet")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "bullet"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Bullet
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Rows */}
      <div className="divide-y divide-border/60">
        {displayList.map((player, idx) => (
          <div
            key={player.username}
            className="py-3.5 flex items-center justify-between gap-3 hover:bg-background/40 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-6 text-center font-black text-sm ${
                  idx === 0
                    ? "text-accent"
                    : idx === 1
                    ? "text-zinc-300"
                    : idx === 2
                    ? "text-amber-600"
                    : "text-muted-foreground"
                }`}
              >
                #{idx + 1}
              </span>

              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-xs flex-shrink-0">
                {player.username.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground truncate">
                    {player.username}
                  </span>
                  {player.title && (
                    <span className="px-1.5 py-0.5 bg-accent/20 text-accent font-bold text-[9px] rounded">
                      {player.title}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Rating: <span className="text-foreground font-bold">{player.score}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/dna/${player.username}`}
              className="px-3.5 py-1.5 bg-background hover:bg-accent hover:text-background border border-border text-foreground text-xs font-semibold rounded-lg transition-all flex items-center gap-1 flex-shrink-0"
            >
              Inspect DNA
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
