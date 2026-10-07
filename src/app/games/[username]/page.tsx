import { Suspense } from "react";
import Link from "next/link";
import { getProfile, getRecentGames } from "@/lib/chessApi";
import GameLibraryClient from "./GameLibraryClient";
import { ChevronLeft, Gamepad2 } from "lucide-react";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  return {
    title: `${username}'s Game Library | ChessDNA`,
    description: `Browse and analyze completed games for ${username}.`,
  };
}

async function GameLibraryContent({ params }: Props) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  const [profile, games] = await Promise.all([
    getProfile(decodedUsername),
    getRecentGames(decodedUsername, 60),
  ]);

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-auto space-y-4">
        <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-foreground">Player Not Found</h2>
        <p className="text-sm text-muted-foreground">
          Could not find a public Chess.com account for "{decodedUsername}".
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-accent text-background font-bold rounded-xl text-xs"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <GameLibraryClient
      profile={profile}
      initialGames={games}
      targetUsername={decodedUsername}
    />
  );
}

export default function GameLibraryPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Suspense
          fallback={
            <div className="p-16 text-center text-accent animate-pulse font-medium">
              Loading Player's Game Library...
            </div>
          }
        >
          <GameLibraryContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
