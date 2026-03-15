import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "../ui/AnimatedNumber";
import type { PriorityDistribution } from "../../lib/stats";

interface DonutChartProps {
  data: PriorityDistribution;
}

const SIZE = 160;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

const COLORS: { key: keyof PriorityDistribution; color: string; label: string; filter?: string }[] = [
  { key: "p1", color: "rgba(255,95,95,0.9)", label: "Urgent", filter: "drop-shadow(0 0 4px rgba(255,80,80,0.4))" },
  { key: "p2", color: "rgba(255,165,75,0.9)", label: "High" },
  { key: "p3", color: "rgba(100,160,255,0.9)", label: "Medium" },
  { key: "p4", color: "rgba(155,155,175,0.65)", label: "Someday" },
];

export default function DonutChart({ data }: DonutChartProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const total = data.p1 + data.p2 + data.p3 + data.p4;

  const arcs = useMemo(() => {
    if (total === 0) return [];
    let cumulative = 0;
    return COLORS.map((c, i) => {
      const count = data[c.key];
      const ratio = count / total;
      const dashLen = ratio * CIRCUMFERENCE;
      const offset = cumulative;
      cumulative += ratio;
      const rotation = offset * 360 - 90; // -90 to start at top
      return {
        ...c,
        count,
        ratio,
        dashLen,
        rotation,
        index: i,
      };
    }).filter((a) => a.count > 0);
  }, [data, total]);

  return (
    <div className="flex items-center gap-6">
      {/* SVG Donut */}
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Background circle */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={STROKE}
            fill="none"
          />

          {/* Arc segments */}
          {arcs.map((arc) => (
            <motion.circle
              key={arc.key}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke={arc.color}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="butt"
              strokeDasharray={`${arc.dashLen} ${CIRCUMFERENCE - arc.dashLen}`}
              style={{
                transformOrigin: "center",
                transform: `rotate(${arc.rotation}deg)`,
              }}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{
                strokeDashoffset: 0,
                scale: hoveredKey === arc.key ? 1.05 : 1,
              }}
              transition={{
                strokeDashoffset: {
                  duration: 0.8,
                  delay: arc.index * 0.1,
                  ease: "easeOut",
                },
                scale: { duration: 0.2 },
              }}
              onMouseEnter={() => setHoveredKey(arc.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="cursor-pointer"
            />
          ))}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedNumber
            value={total}
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-sans)", color: "var(--text-primary)" }}
          />
          <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            active
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {COLORS.map((c) => {
          const count = data[c.key];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div
              key={c.key}
              className="flex items-center gap-2 text-xs"
              onMouseEnter={() => setHoveredKey(c.key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                opacity: hoveredKey && hoveredKey !== c.key ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ background: c.color }}
              />
              <span style={{ color: "var(--text-secondary)" }}>{c.label}</span>
              <span style={{ color: "var(--text-primary)" }} className="font-medium">
                {count}
              </span>
              <span style={{ color: "var(--text-secondary)" }}>({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
