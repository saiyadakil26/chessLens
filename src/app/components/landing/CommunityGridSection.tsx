"use client";

import { motion } from "framer-motion";
import { Users, Trophy, MessageSquare, Globe } from "lucide-react";

export default function CommunityGridSection() {
  const features = [
    {
      title: "Clubs & Groups",
      description: "Analyze aggregate stats for your favorite Chess.com clubs. See which openings your group struggles against.",
      icon: <Users className="w-6 h-6 text-accent" />,
      className: "md:col-span-2 md:row-span-2"
    },
    {
      title: "Tournaments",
      description: "Simulate tournament brackets based on player DNA.",
      icon: <Trophy className="w-6 h-6 text-foreground" />,
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Daily Puzzles",
      description: "Test your tactical vision with daily challenges.",
      icon: <Globe className="w-6 h-6 text-foreground" />,
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Community Insights",
      description: "Compare your playing style to global averages. Are you more aggressive than the typical 1500?",
      icon: <MessageSquare className="w-6 h-6 text-foreground" />,
      className: "md:col-span-2 md:row-span-1"
    }
  ];

  return (
    <section className="py-24 bg-card/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            More Than Just Analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore community features, clubs, and tournaments built around deeper chess intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`bg-background border border-border rounded-xl p-6 hover:border-border/80 hover:bg-card/50 transition-all ${feature.className}`}
            >
              <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
