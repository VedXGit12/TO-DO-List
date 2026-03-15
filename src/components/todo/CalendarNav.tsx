import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { calendarLabelVariants } from "../../lib/animations";

export type CalViewMode = "month" | "week";

interface CalendarNavProps {
  currentDate: Date;
  calView: CalViewMode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: CalViewMode) => void;
}

export default function CalendarNav({
  currentDate,
  calView,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: CalendarNavProps) {
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    onPrev();
  };
  const handleNext = () => {
    setDirection(1);
    onNext();
  };
  const handleToday = () => {
    setDirection(0);
    onToday();
  };

  const label = format(currentDate, "MMMM yyyy");

  return (
    <div
      className="flex items-center justify-between px-1 py-3"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Left: arrows + label */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="p-1.5"
          style={{ color: "var(--text-secondary)", borderRadius: 10 }}
        >
          <ChevronLeft size={16} />
        </motion.button>

        <div style={{ width: 180, overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={label}
              custom={direction}
              variants={calendarLabelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="block text-sm font-semibold text-center"
              style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="p-1.5"
          style={{ color: "var(--text-secondary)", borderRadius: 10 }}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      {/* Right: Today + Month/Week toggle */}
      <div className="flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToday}
          className="px-3 py-1.5 text-xs font-semibold"
          style={{
            background: "var(--accent-dim)",
            color: "var(--accent)",
            borderRadius: 10,
          }}
        >
          Today
        </motion.button>
        <div
          className="flex items-center gap-0.5 px-1 py-1"
          style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {(["month", "week"] as CalViewMode[]).map((mode) => {
            const active = calView === mode;
            return (
              <motion.button
                key={mode}
                onClick={() => onViewChange(mode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-3 py-1 text-xs font-medium capitalize"
                style={{
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  borderRadius: 10,
                }}
              >
                {active && (
                  <motion.div
                    layoutId="cal-view-pill"
                    className="absolute inset-0"
                    style={{ background: "var(--accent-dim)", borderRadius: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{mode}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
