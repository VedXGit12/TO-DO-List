import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, getDay } from "date-fns";
import type { HeatmapDay } from "../../lib/stats";

interface HeatmapGridProps {
  data: HeatmapDay[];
}

const CELL = 16;
const GAP = 2;
const ROWS = 7;

const LEVEL_COLORS: Record<number, string> = {
  0: "var(--bg-elevated)",
  1: "rgba(232,160,69,0.2)",
  2: "rgba(232,160,69,0.45)",
  3: "rgba(232,160,69,0.7)",
  4: "var(--accent)",
};

export default function HeatmapGrid({ data }: HeatmapGridProps) {
  const [hovered, setHovered] = useState<HeatmapDay | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Organize data into columns (weeks) × rows (days)
  const { grid, monthLabels, cols } = useMemo(() => {
    if (data.length === 0) return { grid: [] as (HeatmapDay | null)[][], monthLabels: [] as { col: number; label: string }[], cols: 0 };

    const firstDate = parseISO(data[0].date);

    // Build grid: each column is a week
    const columns: (HeatmapDay | null)[][] = [];
    let col: (HeatmapDay | null)[] = [];

    // Pad the first column with nulls for days before data starts
    const startDayIdx = getDay(firstDate); // 0=Sun, 6=Sat
    for (let i = 0; i < startDayIdx; i++) col.push(null);

    for (const d of data) {
      col.push(d);
      if (col.length === ROWS) {
        columns.push(col);
        col = [];
      }
    }
    if (col.length > 0) {
      while (col.length < ROWS) col.push(null);
      columns.push(col);
    }

    // Month labels: detect when month changes
    const labels: { col: number; label: string }[] = [];
    let lastMonth = "";
    for (let c = 0; c < columns.length; c++) {
      const firstInCol = columns[c].find((d) => d !== null);
      if (firstInCol) {
        const month = format(parseISO(firstInCol.date), "MMM");
        if (month !== lastMonth) {
          labels.push({ col: c, label: month });
          lastMonth = month;
        }
      }
    }

    return { grid: columns, monthLabels: labels, cols: columns.length };
  }, [data]);

  const gridWidth = cols * (CELL + GAP);

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="inline-block relative" style={{ minWidth: gridWidth }}>
        {/* Month labels */}
        <div className="flex" style={{ height: 18, marginBottom: 2 }}>
          {monthLabels.map((m) => (
            <span
              key={`${m.col}-${m.label}`}
              className="absolute text-[10px]"
              style={{
                left: m.col * (CELL + GAP),
                color: "var(--text-secondary)",
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          className="flex gap-[2px]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.008 } },
          }}
        >
          {grid.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-[2px]">
              {column.map((day, rowIdx) => (
                <motion.div
                  key={`${colIdx}-${rowIdx}`}
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: {
                      scale: 1,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: colIdx * 0.008,
                      },
                    },
                  }}
                  whileHover={{ scale: 1.3 }}
                  onMouseEnter={(e) => {
                    if (day) {
                      setHovered(day);
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      const parent = (e.target as HTMLElement).closest(".relative")?.getBoundingClientRect();
                      if (parent) {
                        setHoverPos({
                          x: rect.left - parent.left + CELL / 2,
                          y: rect.top - parent.top - 8,
                        });
                      }
                    }
                  }}
                  onMouseLeave={() => setHovered(null)}
                  className="rounded-sm cursor-pointer"
                  style={{
                    width: CELL,
                    height: CELL,
                    background: day ? LEVEL_COLORS[day.level] : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </motion.div>

        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap z-50"
              style={{
                left: hoverPos.x,
                top: hoverPos.y,
                transform: "translate(-50%, -100%)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {hovered.count} task{hovered.count !== 1 ? "s" : ""} ·{" "}
              {format(parseISO(hovered.date), "MMM d")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
