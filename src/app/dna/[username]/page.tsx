"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { getProfile, getRecentGames, ChessProfile, ChessGame } from "@/lib/chessApi";
import { analyzeGames, AnalysisResult } from "@/lib/chessAnalyzer";
import DnaResult from "@/app/components/DnaResult";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const loadingStages = [
  "Finding your profile...",
  "Retrieving your public games...",
  "Importing recent games...",
  "Studying your openings...",
  "Measuring your playing style...",
  "Building your Chess DNA..."
];

function DnaContent() {
  const params = useParams();
  const username = params.username as string;

  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ChessProfile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setStage(0);
        // Step 1: Profile
        const prof = await getProfile(username);
        if (!isMounted) return;
        if (!prof) {
          setError("We couldn't find that Chess.com player.");
          return;
        }
        setProfile(prof);
        
        await new Promise(r => setTimeout(r, 800));
        setStage(1);
        
        // Step 2: Games
        const games = await getRecentGames(username, 100);
        if (!isMounted) return;
        if (games.length === 0) {
          setError("No recent public games found to analyze.");
          return;
        }

        await new Promise(r => setTimeout(r, 800));
        setStage(2);
        
        await new Promise(r => setTimeout(r, 800));
        setStage(3);

        await new Promise(r => setTimeout(r, 800));
        setStage(4);

        // Step 3: Analyze
        const analysis = analyzeGames(username, games);
        
        await new Promise(r => setTimeout(r, 800));
        setStage(5);

        await new Promise(r => setTimeout(r, 800));
        
        if (isMounted) {
          setResult(analysis);
        }
      } catch (err) {
        if (isMounted) setError("An error occurred during analysis.");
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-4 text-red-400">Analysis Failed</h2>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-hover text-background font-bold rounded-full transition-colors">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (!result || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-8 text-center animate-pulse text-accent">
            Digging through your chess history...
          </h2>
          <div className="space-y-4">
            {loadingStages.map((text, index) => {
              const isPast = index < stage;
              const isCurrent = index === stage;
              return (
                <div key={index} className={`flex items-center space-x-3 transition-opacity duration-500 ${isPast || isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isPast ? 'bg-accent border-accent text-background' : isCurrent ? 'border-accent' : 'border-muted-foreground'}`}>
                    {isPast && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`${isPast ? 'text-foreground' : isCurrent ? 'text-accent font-medium' : 'text-muted-foreground'}`}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return <DnaResult result={result} profile={profile} />;
}

export default function DnaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-accent animate-pulse">Initializing...</div>}>
      <DnaContent />
    </Suspense>
  );
}
