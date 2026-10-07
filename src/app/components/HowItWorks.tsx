"use client";

import { motion } from "framer-motion";
import { UserSearch, Cpu, LineChart, Target } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "01 — Connect",
      description: "Enter your public Chess.com username. No passwords, no auth required.",
      icon: <UserSearch className="w-8 h-8 text-accent" />
    },
    {
      title: "02 — Process",
      description: "Our engine analyzes your completed games, evaluating every position.",
      icon: <Cpu className="w-8 h-8 text-accent" />
    },
    {
      title: "03 — Analyze",
      description: "We identify opening structures, mid-game plans, and turning points.",
      icon: <LineChart className="w-8 h-8 text-accent" />
    },
    {
      title: "04 — Improve",
      description: "Understand your strengths, weaknesses, and unique playing personality.",
      icon: <Target className="w-8 h-8 text-accent" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-border z-0"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-card rounded-full border border-border flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm px-4">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
