"use client";

import { useState } from "react";
import { Sparkles, Swords, Brain, Shield, Clock, Zap, Castle, Shuffle } from "lucide-react";

export interface ArchetypeDetail {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: any;
  definingStat: string;
  historicalInspiration: string;
  strength: string;
  vulnerability: string;
}

export const ARCHETYPES_LIST: ArchetypeDetail[] = [
  {
    id: "chaos_merchant",
    name: "The Chaos Merchant",
    tagline: "Material is a suggestion. Complications are mandatory.",
    description: "You don't just play chess. You create wild tactical problems and pray your opponent runs out of answers before you do.",
    icon: Swords,
    definingStat: "Aggression (85+) & High Risk",
    historicalInspiration: "Mikhail Tal",
    strength: "Overwhelming opponents in complex tactical clouds.",
    vulnerability: "Overpressing in completely dry, quiet endgames.",
  },
  {
    id: "calculator",
    name: "The Calculator",
    tagline: "Cold, surgical tactical accuracy.",
    description: "You love positions where every move feels like a sharp calculation. You see forks, skewers, and pins before your opponent even makes their move.",
    icon: Brain,
    definingStat: "Tactical Vision (80+)",
    historicalInspiration: "Garry Kasparov",
    strength: "Finding forcing tactical refutations and punishing blunders instantly.",
    vulnerability: "Can get impatient when positions require quiet maneuvering.",
  },
  {
    id: "fortress",
    name: "The Fortress",
    tagline: "Your opponent may attack. You will still be there.",
    description: "Attacking players despise playing you. You absorb sacrifice after sacrifice, consolidate your pieces, and win by remaining unshakeable.",
    icon: Castle,
    definingStat: "Defense (75+)",
    historicalInspiration: "Tigran Petrosian",
    strength: "Impenetrable defensive coordination and counterpunching.",
    vulnerability: "Occasionally overly passive if initiative is surrendered.",
  },
  {
    id: "technician",
    name: "The Technician",
    tagline: "Master of the 60-move grinding conversion.",
    description: "You are happiest when the tactical fireworks are cleared off the board and a clean, technical endgame advantage is left to squeeze.",
    icon: Shield,
    definingStat: "Endgame Mastery (65+)",
    historicalInspiration: "Magnus Carlsen & Anatoly Karpov",
    strength: "Converting microscopic pawn edges into clinical wins.",
    vulnerability: "Surviving sudden early-game tactical ambushes.",
  },
  {
    id: "speed_demon",
    name: "The Speed Demon",
    tagline: "Thinking is optional. Clock pressure is king.",
    description: "You play on instinct, premoving with lethal velocity and winning lost positions purely on clock pressure and flag warfare.",
    icon: Clock,
    definingStat: "Speed & Time Pressure (85+)",
    historicalInspiration: "Hikaru Nakamura",
    strength: "Dominating time scrambles and rapid intuitive tactical strikes.",
    vulnerability: "Playing too fast in classical positions that require deep reflection.",
  },
  {
    id: "gambit_goblin",
    name: "The Gambit Goblin",
    tagline: "Pawns exist to be sacrificed for open files.",
    description: "You open your king, throw pawns forward, and bet everything on a raging attack on your opponent's king. Pure romantic aggression.",
    icon: Zap,
    definingStat: "High Risk (90+) & Hyper-Aggression",
    historicalInspiration: "Paul Morphy",
    strength: "Devastating kingside attacks and rapid developmental initiative.",
    vulnerability: "Down three pawns with zero counterplay if the attack fizzles.",
  },
  {
    id: "strategist",
    name: "The Strategist",
    tagline: "Quiet positional strangulation.",
    description: "While your opponent searches for flashy tactics, you quietly restrict their bishop, take the open file, and starve their counterplay.",
    icon: Sparkles,
    definingStat: "High Defense & Solid Endgame",
    historicalInspiration: "Bobby Fischer",
    strength: "Outplaying opponents systematically without allowing any tactical counterchances.",
    vulnerability: "Reluctance to enter messy, unpredictable positions.",
  },
  {
    id: "wildcard",
    name: "The Wildcard",
    tagline: "Even the engine cannot predict your next move.",
    description: "Your style refuses to fit neatly into any box. One game you play like a 19th-century romantic, the next you grind a 90-move rook endgame.",
    icon: Shuffle,
    definingStat: "Dynamic, Uncategorized Balance",
    historicalInspiration: "Daniil Dubov",
    strength: "Utter unpredictability across opening choices and middlegames.",
    vulnerability: "Inconsistency across different time controls.",
  },
];

export default function ArchetypeGallery() {
  const [selected, setSelected] = useState<ArchetypeDetail>(ARCHETYPES_LIST[0]);

  return (
    <div className="space-y-8">
      {/* Archetype Selector Tabs/Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ARCHETYPES_LIST.map((arch) => {
          const Icon = arch.icon;
          const isSelected = selected.id === arch.id;
          return (
            <button
              key={arch.id}
              onClick={() => setSelected(arch)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-accent/15 border-accent text-foreground shadow-lg shadow-accent/5"
                  : "bg-card border-border hover:border-accent/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <Icon
                  className={`w-5 h-5 ${
                    isSelected ? "text-accent" : "text-muted-foreground"
                  }`}
                />
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              <div className="font-bold text-sm leading-tight text-foreground">
                {arch.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Archetype Deep Dive Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center flex-shrink-0 text-accent">
              <selected.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-accent">
                Archetype Profile
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {selected.name}
              </h3>
            </div>
          </div>

          <div className="px-4 py-2 bg-background/80 border border-border rounded-xl text-xs font-mono">
            <span className="text-muted-foreground">Historical Vibe: </span>
            <span className="text-accent font-bold">
              {selected.historicalInspiration}
            </span>
          </div>
        </div>

        <p className="text-lg text-foreground font-medium mb-2 italic">
          "{selected.tagline}"
        </p>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {selected.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-background/60 p-4 rounded-xl border border-border/70">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">
              Defining Trait
            </div>
            <div className="text-sm font-bold text-foreground">
              {selected.definingStat}
            </div>
          </div>

          <div className="bg-background/60 p-4 rounded-xl border border-border/70">
            <div className="text-xs font-semibold uppercase text-emerald-400 mb-1">
              Core Superpower
            </div>
            <div className="text-sm font-semibold text-foreground">
              {selected.strength}
            </div>
          </div>

          <div className="bg-background/60 p-4 rounded-xl border border-border/70">
            <div className="text-xs font-semibold uppercase text-red-400 mb-1">
              Achilles Heel
            </div>
            <div className="text-sm font-semibold text-foreground">
              {selected.vulnerability}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
