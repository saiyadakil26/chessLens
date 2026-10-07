"use client";

import { motion } from "framer-motion";
import { Zap, ShieldAlert, Target } from "lucide-react";

export default function AnalysisPreviewSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Professional-grade Move Analysis
          </h2>
          <p className="text-lg text-muted-foreground">
            Our engine classifies every move, highlighting brilliant sacrifices and critical mistakes with intuitive badges and deep engine lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-blue-400">!!</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Brilliant</h3>
            <p className="text-muted-foreground text-sm">
              Discover when you found a difficult, hidden, or sacrificial move that leads to a clear advantage.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-red-400">??</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Blunder</h3>
            <p className="text-muted-foreground text-sm">
              See exactly where the game slipped away, with engine lines showing how your opponent could capitalize.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-yellow-400">?!</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Inaccuracy</h3>
            <p className="text-muted-foreground text-sm">
              Understand subtle strategic errors where your move wasn't bad, but a better plan was available.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
