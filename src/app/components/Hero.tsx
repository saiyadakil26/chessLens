"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Activity, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a Chess.com username.");
      return;
    }
    
    setError("");
    setIsLoading(true);
    // Navigate to the DNA page
    router.push(`/dna/${username.trim()}`);
  };

  return (
    <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column: Copy & CTA */}
          <div className="text-center lg:text-left lg:col-span-6 mb-16 lg:mb-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              See your chess <span className="text-accent">differently.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10"
            >
              Understand Your Chess. Not Just Your Moves. Discover opening patterns, understand turning points, and uncover the habits that define how you play.
            </motion.p>
            
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onSubmit={handleAnalyze} 
              className="max-w-md mx-auto lg:mx-0"
            >
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-32 py-4 bg-card/80 border border-border backdrop-blur-sm rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg transition-all"
                  placeholder="Enter Chess.com username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-2 right-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-2 bg-accent hover:bg-accent-hover text-background font-bold rounded-full transition-colors h-full"
                  >
                    {isLoading ? "Loading..." : "Analyze"}
                    {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <p className="mt-3 text-red-400 text-sm">{error}</p>
              )}
              
              <div className="mt-5 flex items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
                <span>No password required. Public games only.</span>
              </div>
            </motion.form>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-10 flex items-center justify-center lg:justify-start gap-6"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Evaluation Graph</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Move Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Game Plans</span>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Premium Product Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-6 relative"
          >
            {/* The actual preview card */}
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
              {/* Header */}
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-mono text-muted-foreground bg-background/50 px-3 py-1 rounded-md">Game Analysis</div>
              </div>
              
              {/* Body */}
              <div className="flex-1 p-6 flex gap-6">
                {/* Chessboard mock */}
                <div className="aspect-square h-full bg-[#1e2024] rounded-md relative overflow-hidden flex flex-col shadow-inner border border-border/50">
                  {/* Grid */}
                  <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isDark = (row + col) % 2 === 1;
                      return (
                        <div key={i} className={`w-full h-full ${isDark ? 'bg-[#739552]' : 'bg-[#ebecd0]'}`}></div>
                      );
                    })}
                  </div>
                  {/* Mock Move Badge */}
                  <div className="absolute top-[25%] left-[37.5%] w-[12.5%] h-[12.5%] flex items-center justify-center">
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 shadow-md border-2 border-white flex items-center justify-center z-10">
                      <span className="text-white text-[10px] font-bold">!!</span>
                    </div>
                  </div>
                  {/* Highlight */}
                  <div className="absolute top-[25%] left-[37.5%] w-[12.5%] h-[12.5%] bg-yellow-400/40"></div>
                </div>
                
                {/* Timeline mock */}
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded-full"></div>
                    <div className="h-4 w-32 bg-foreground rounded-full"></div>
                    <div className="h-3 w-24 bg-muted-foreground rounded-full"></div>
                  </div>
                  
                  <div className="mt-4 border-l-2 border-border pl-4 space-y-6 relative before:absolute before:left-[-5px] before:top-2 before:w-2 before:h-2 before:bg-accent before:rounded-full">
                    <div>
                      <div className="text-sm font-semibold text-accent mb-1">Brilliant Move</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        Nf5!! sacrifices the knight to open the h-file for the rook. A stunning tactical vision that leads to a forced mate.
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-muted/20 border border-border rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Evaluation</div>
                    <div className="flex items-end gap-1 h-12">
                      <div className="w-1/6 bg-border h-[40%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-border h-[50%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-border h-[45%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-accent h-[90%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-border h-[85%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-border h-[95%] rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
