import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";
import { calendarLabelVariants } from "../../lib/animations";
import { useUIStore } from "../../store/uiStore";

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
  const { setActiveTodo } = useUIStore();

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
      className="flex items-center justify-between px-2 py-3"
      style={{ color: "rgba(255,255,255,0.90)" }}
    >
      {/* Left: month/year with arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="p-1.5"
          style={{ color: "rgba(255,255,255,0.50)", borderRadius: 8 }}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ width: 200, overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={label}
              custom={direction}
              variants={calendarLabelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="block font-semibold text-center"
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="p-1.5"
          style={{ color: "rgba(255,255,255,0.50)", borderRadius: 8 }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Center: Today / Month / Week pills */}
      <div
        className="flex items-center gap-0.5 px-1 py-1"
        style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 8,
        }}
      >
        <button
          onClick={handleToday}
          className="px-3 py-1.5"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,0.70)",
            borderRadius: 6,
            background: "transparent",
          }}
        >
          Today
        </button>
        {(["month", "week"] as CalViewMode[]).map((mode) => {
          const active = calView === mode;
          return (
            <button
              key={mode}
              onClick={() => onViewChange(mode)}
              className="relative px-3 py-1.5 capitalize"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
                borderRadius: 6,
                background: active ? "rgba(255,255,255,0.18)" : "transparent",
              }}
            >
              {mode}
            </button>
          );
        })}
      </div>

      {/* Right: + New Task button */}
      <button
        onClick={() => setActiveTodo("new")}
        className="flex items-center gap-1.5"
        style={{
          background: "linear-gradient(135deg, #F5A623, #E8940A)",
          borderRadius: 10,
          padding: "8px 16px",
          color: "#0A0A0A",
          fontSize: 13,
          fontWeight: 600,
          border: "none",
          boxShadow: "0 0 16px rgba(245,166,35,0.40)",
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        <span>New Task</span>
      </button>
    </div>
  );
}
