"use client";

import { motion } from "framer-motion";
import { Book, GitMerge, Compass } from "lucide-react";

export default function OpeningInsightsSection() {
  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 gap-16 items-center flex flex-col-reverse">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full relative"
          >
            <div className="bg-background border border-border rounded-xl p-6 shadow-xl relative z-10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Book className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase tracking-wider">Opening Report</h3>
                </div>
                <div className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">ECO: C65</div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-foreground mb-1">Ruy Lopez</h4>
                <p className="text-muted-foreground">Berlin Defense</p>
              </div>

              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-sm">Strategic Goals</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Black aims for a solid endgame, often exchanging queens early. White tries to leverage the better pawn structure.
                  </p>
                </div>

                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <GitMerge className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-sm">First Deviation</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You played <span className="font-mono bg-muted px-1 rounded">5. Re1</span>, leaving book theory on move 5. The most common master move is <span className="font-mono bg-muted px-1 rounded">5. d4</span>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-3xl rounded-full"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 lg:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Master the opening. <br/>
              <span className="text-accent">Understand the plan.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              ChessLens doesn't just name the opening. It tells you the underlying plans, pawn structures, and common middlegame themes.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                </div>
                <p className="text-muted-foreground"><strong className="text-foreground">Theory Boundaries:</strong> Know exactly when you or your opponent stopped playing book moves.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                </div>
                <p className="text-muted-foreground"><strong className="text-foreground">Game Plan Comparison:</strong> See if your middlegame moves aligned with the typical plans for the opening structure.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                </div>
                <p className="text-muted-foreground"><strong className="text-foreground">ECO Database:</strong> Integrated ECO classification to categorize your repertoire.</p>
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
