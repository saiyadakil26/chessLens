import { Suspense } from "react";
import Link from "next/link";
import { getGameById } from "@/lib/chessApi";
import GameAnalysisContainer from "./GameAnalysisContainer";
import { ChevronLeft, Gamepad2 } from "lucide-react";

interface Props {
  params: Promise<{ username: string; gameId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username, gameId } = await params;
  return {
    title: `Game Analysis #${gameId} | ${username} | ChessDNA`,
    description: `Move-by-move interactive chess analysis and evaluation for ${username}.`,
  };
}

async function GameAnalysisContent({ params }: Props) {
  const { username, gameId } = await params;
  const decodedUsername = decodeURIComponent(username);

  const game = await getGameById(decodedUsername, gameId);

  if (!game) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-auto space-y-4">
        <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-foreground">Game Not Found</h2>
        <p className="text-sm text-muted-foreground">
          Could not locate completed game #{gameId} for "{decodedUsername}".
        </p>
        <Link
          href={`/games/${decodedUsername}`}
          className="inline-flex items-center px-5 py-2.5 bg-accent text-background font-bold rounded-xl text-xs"
        >
          Return to Game Library
        </Link>
      </div>
    );
  }

  return (
    <GameAnalysisContainer
      game={game}
      targetUsername={decodedUsername}
      gameId={gameId}
    />
  );
}

export default function GameAnalysisPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Suspense
          fallback={
            <div className="p-16 text-center text-accent animate-pulse font-medium">
              Loading Completed Game...
            </div>
          }
        >
          <GameAnalysisContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
