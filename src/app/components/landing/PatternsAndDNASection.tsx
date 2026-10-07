"use client";

import { motion } from "framer-motion";
import { Dna, Target, Activity } from "lucide-react";

export default function PatternsAndDNASection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
            <Dna className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Discover Your Chess DNA
          </h2>
          <p className="text-lg text-muted-foreground">
            Analyze hundreds of games to uncover your unique player profile. Are you a tactical aggressor, a solid positional player, or a chaotic brawler?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-8 text-left hover:border-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-foreground">Cross-Game Patterns</h3>
              <Target className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              ChessLens identifies recurring mistakes and habitual strong points across your entire game history. Stop blundering in the same pawn structures.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Tactical Vision</span>
                <span className="text-accent">85%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[85%]"></div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Endgame Technique</span>
                <span className="text-blue-400">42%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[42%]"></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-8 text-left hover:border-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-foreground">Performance Trends</h3>
              <Activity className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Track how your accuracy and move quality changes over time, by opening, or even by time of day. Find out when you play your best chess.
            </p>
            <div className="h-16 flex items-end gap-2 mt-auto">
              {[30, 45, 25, 60, 75, 50, 85, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-accent/20 rounded-t-sm relative group hover:bg-accent transition-colors" style={{ height: `${h}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-background border border-border text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
