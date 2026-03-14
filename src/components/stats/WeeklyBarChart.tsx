import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { WeeklyBar } from "../../lib/stats";

interface WeeklyBarChartProps {
  data: WeeklyBar[];
}

const SVG_W = 600;
const SVG_H = 200;
const PADDING_LEFT = 10;
const PADDING_RIGHT = 10;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 30;
const CHART_H = SVG_H - PADDING_TOP - PADDING_BOTTOM;

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  const { maxVal, barWidth, groupWidth } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => Math.max(d.completed, d.created)));
    const usable = SVG_W - PADDING_LEFT - PADDING_RIGHT;
    const gw = usable / data.length;
    const bw = gw * 0.3;
    return { maxVal: max, barWidth: bw, groupWidth: gw };
  }, [data]);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" preserveAspectRatio="xMidYMid meet">
        <motion.g
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {data.map((week, i) => {
            const x = PADDING_LEFT + i * groupWidth;
            const completedH = (week.completed / maxVal) * CHART_H;
            const createdH = (week.created / maxVal) * CHART_H;
            const isHovered = hoveredWeek === i;
            const dimmed = hoveredWeek !== null && !isHovered;

            return (
              <g
                key={week.weekLabel}
                onMouseEnter={() => setHoveredWeek(i)}
                onMouseLeave={() => setHoveredWeek(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Invisible hit area */}
                <rect
                  x={x}
                  y={PADDING_TOP}
                  width={groupWidth}
                  height={CHART_H}
                  fill="transparent"
                />

                {/* Created bar */}
                <motion.rect
                  x={x + groupWidth * 0.15}
                  width={barWidth}
                  rx={3}
                  fill="rgba(232,160,69,0.4)"
                  variants={{
                    hidden: { height: 0, y: PADDING_TOP + CHART_H },
                    visible: {
                      height: createdH,
                      y: PADDING_TOP + CHART_H - createdH,
                      transition: { type: "spring", stiffness: 200, damping: 20 },
                    },
                  }}
                  animate={{ opacity: dimmed ? 0.4 : 1 }}
                />

                {/* Completed bar */}
                <motion.rect
                  x={x + groupWidth * 0.15 + barWidth + 2}
                  width={barWidth}
                  rx={3}
                  fill="#22c55e"
                  variants={{
                    hidden: { height: 0, y: PADDING_TOP + CHART_H },
                    visible: {
                      height: completedH,
                      y: PADDING_TOP + CHART_H - completedH,
                      transition: { type: "spring", stiffness: 200, damping: 20 },
                    },
                  }}
                  animate={{ opacity: dimmed ? 0.4 : 1 }}
                />

                {/* Week label */}
                <text
                  x={x + groupWidth / 2}
                  y={SVG_H - 8}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontFamily="var(--font-body)"
                >
                  {week.weekLabel}
                </text>
              </g>
            );
          })}
        </motion.g>

        {/* Hover tooltip in SVG */}
        {hoveredWeek !== null && (
          <g>
            <rect
              x={PADDING_LEFT + hoveredWeek * groupWidth + groupWidth / 2 - 50}
              y={2}
              width={100}
              height={22}
              rx={4}
              fill="var(--bg-elevated)"
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={PADDING_LEFT + hoveredWeek * groupWidth + groupWidth / 2}
              y={16}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="10"
              fontFamily="var(--font-body)"
            >
              {data[hoveredWeek].completed} done · {data[hoveredWeek].created} created
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 ml-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#22c55e" }} />
          <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Completed
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(232,160,69,0.4)" }} />
          <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Created
          </span>
        </div>
      </div>
    </div>
  );
}
