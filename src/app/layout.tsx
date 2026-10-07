import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ChessLens — Understand Your Chess, Not Just Your Moves",
  description: "Analyze your completed chess games, discover opening patterns, understand turning points and mistakes, and uncover the patterns that define how you play.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="absolute top-0 left-0 right-0 p-5 sm:p-6 flex justify-between items-center z-50 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-1.5 hover:text-accent transition-colors">
              <span className="text-accent">♟</span> ChessLens
            </Link>
          </div>
          <nav className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-semibold">
            <Link
              href="/daily"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Daily
            </Link>
            <Link
              href="/community"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </Link>
            <Link
              href="/clubs"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Clubs
            </Link>
            <Link
              href="/games"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Game Analysis
            </Link>
            <Link
              href="/tournaments"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Tournaments
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
