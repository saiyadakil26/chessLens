"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { AnalyzedMove } from "@/lib/chessEngine";

interface EvaluationGraphProps {
  moves: AnalyzedMove[];
  currentPly: number;
  onSelectPly: (ply: number) => void;
  theoryEndPly?: number;
  turningPointPly?: number;
}

export default function EvaluationGraph({
  moves,
  currentPly,
  onSelectPly,
  theoryEndPly,
  turningPointPly,
}: EvaluationGraphProps) {
  // Format data for Recharts
  const chartData = useMemo(() => {
    return moves.map((m) => {
      // Bound chart display evaluation between -8 and +8 for clean visualization
      const boundedEval = Math.max(-8, Math.min(8, m.evalAfter));
      return {
        ply: m.ply,
        moveNumber: m.moveNumber,
        san: m.san,
        side: m.side,
        eval: boundedEval,
        rawEval: m.evalAfter,
        classification: m.classification,
      };
    });
  }, [moves]);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between text-xs pb-1 border-b border-border/50">
        <span className="uppercase font-bold tracking-wider text-muted-foreground text-[11px]">
          Game Evaluation Flow
        </span>
        <span className="font-mono text-muted-foreground text-[11px]">
          Current Ply: <span className="text-accent font-bold">{currentPly}</span> / {moves.length}
        </span>
      </div>

      <div className="w-full h-36 sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload[0]) {
                const ply = state.activePayload[0].payload.ply;
                onSelectPly(ply);
              }
            }}
          >
            <defs>
              <linearGradient id="evalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="ply"
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              tickLine={false}
              tickFormatter={(val) => `${Math.ceil(val / 2)}`}
            />
            <YAxis
              domain={[-6, 6]}
              stroke="#52525b"
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              tickLine={false}
              ticks={[-4, -2, 0, 2, 4]}
              tickFormatter={(val) => (val > 0 ? `+${val}` : `${val}`)}
            />

            {/* Zero line (Equal game) */}
            <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="3 3" />

            {/* Theory End Marker */}
            {theoryEndPly && theoryEndPly > 0 && theoryEndPly <= moves.length && (
              <ReferenceLine
                x={theoryEndPly}
                stroke="#06b6d4"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "Theory",
                  fill: "#06b6d4",
                  fontSize: 10,
                  position: "top",
                }}
              />
            )}

            {/* Turning Point Marker */}
            {turningPointPly && turningPointPly > 0 && turningPointPly <= moves.length && (
              <ReferenceLine
                x={turningPointPly}
                stroke="#f97316"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "⚡ Swing",
                  fill: "#f97316",
                  fontSize: 10,
                  position: "bottom",
                }}
              />
            )}

            {/* Active Current Ply Marker */}
            {currentPly > 0 && (
              <ReferenceLine
                x={currentPly}
                stroke="#D4AF37"
                strokeWidth={2}
                label={{
                  value: "●",
                  fill: "#D4AF37",
                  fontSize: 14,
                  position: "top",
                }}
              />
            )}

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const isWhite = data.side === "white";
                  return (
                    <div className="bg-[#18181b] border border-border p-2.5 rounded-lg shadow-xl text-xs space-y-1 font-mono">
                      <div className="flex items-center justify-between gap-3 text-muted-foreground">
                        <span>
                          Move {data.moveNumber} ({isWhite ? "White" : "Black"})
                        </span>
                        <span className="font-bold text-foreground">{data.san}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 font-bold">
                        <span className="text-muted-foreground">Eval:</span>
                        <span className={data.rawEval >= 0 ? "text-accent" : "text-blue-400"}>
                          {data.rawEval > 0 ? `+${data.rawEval}` : data.rawEval}
                        </span>
                      </div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground pt-1 border-t border-border/40 capitalize">
                        {data.classification}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="eval"
              stroke="#D4AF37"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#evalGradient)"
              activeDot={{
                r: 5,
                fill: "#D4AF37",
                stroke: "#ffffff",
                strokeWidth: 2,
                cursor: "pointer",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
        <span>White Advantage (+)</span>
        <span className="italic">Click any point to jump to move</span>
        <span>Black Advantage (-)</span>
      </div>
    </div>
  );
}
