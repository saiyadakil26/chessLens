"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, Flag, Swords } from "lucide-react";

export default function GameStorySection() {
  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Your game has a story. <br/>
              <span className="text-accent">See the moves that mattered.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Forget scrolling through 60 moves trying to find where it all went wrong. 
              ChessLens extracts the narrative of your game, identifying the critical turning points, 
              brilliant sacrifices, and hidden blunders.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Opening Theory Boundaries</h4>
                  <p className="text-sm text-muted-foreground">See exactly where you or your opponent left book moves.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Swords className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Middlegame Transitions</h4>
                  <p className="text-sm text-muted-foreground">Understand how the pawn structure dictates the coming battle.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Turning Points</h4>
                  <p className="text-sm text-muted-foreground">Jump instantly to the move that shifted the evaluation graph.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 lg:mt-0 relative"
          >
            <div className="bg-background border border-border rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Flag className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase tracking-wider">Game Timeline</h3>
              </div>
              
              <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                <div className="relative pl-10">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-background"></div>
                  <div className="text-xs font-mono text-muted-foreground mb-1">Move 12</div>
                  <div className="font-semibold text-foreground">First Deviation</div>
                  <div className="text-sm text-muted-foreground mt-1">White plays Nd2, leaving known Ruy Lopez theory.</div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-background"></div>
                  <div className="text-xs font-mono text-muted-foreground mb-1">Move 24</div>
                  <div className="font-semibold text-foreground">Turning Point</div>
                  <div className="text-sm text-muted-foreground mt-1">Black blunders the exchange with Re8. Evaluation swings +3.2.</div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background"></div>
                  <div className="text-xs font-mono text-muted-foreground mb-1">Move 31</div>
                  <div className="font-semibold text-foreground">Brilliant Combination</div>
                  <div className="text-sm text-muted-foreground mt-1">Nf6+! forces a winning endgame sequence.</div>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-3xl rounded-full"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
