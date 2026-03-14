import { motion } from "framer-motion";
import AnimatedNumber from "../ui/AnimatedNumber";
import type { StreakData } from "../../lib/stats";

interface StreakCounterProps {
  streak: StreakData;
  hasCompletedToday: boolean;
}

export default function StreakCounter({ streak, hasCompletedToday }: StreakCounterProps) {
  const intensity = Math.min(streak.current / 14, 1);
  const showWarning = !hasCompletedToday && streak.current > 0;

  // Glow intensity for fire emoji
  const glowSize = Math.round(4 + intensity * 16);
  const glowAlpha = (0.2 + intensity * 0.6).toFixed(2);

  const pulseClass =
    streak.current >= 3 ? "streak-pulse" : "";

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-3">
        <motion.span
          className={`text-3xl select-none ${pulseClass}`}
          animate={{
            scale: streak.current >= 7 ? [1, 1.15, 1] : 1,
            filter:
              streak.current >= 3
                ? `drop-shadow(0 0 ${glowSize}px rgba(232,160,69,${glowAlpha}))`
                : "none",
          }}
          transition={
            streak.current >= 7
              ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        >
          🔥
        </motion.span>
        <AnimatedNumber
          value={streak.current}
          className="text-3xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: showWarning ? "var(--text-secondary)" : "var(--text-primary)",
          }}
        />
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          day{streak.current !== 1 ? "s" : ""}
        </span>
        {showWarning && (
          <span className="text-sm" title="Complete a task today to keep your streak">
            ⚠️
          </span>
        )}
      </div>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Longest streak: {streak.longest} day{streak.longest !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
