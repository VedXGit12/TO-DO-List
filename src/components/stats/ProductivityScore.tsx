import { motion } from "framer-motion";
import AnimatedNumber from "../ui/AnimatedNumber";
import { useUIStore, ACCENT_COLORS } from "../../store/uiStore";
import type { ProductivityScoreData } from "../../lib/stats";

interface ProductivityScoreProps {
  data: ProductivityScoreData;
}

const SIZE = 120;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = Math.PI * RADIUS; // semicircle

export default function ProductivityScore({ data }: ProductivityScoreProps) {
  const { accentColor } = useUIStore();
  const accentHex = ACCENT_COLORS[accentColor];

  function gaugeColor(score: number): string {
    if (score >= 80) return "#22c55e";
    if (score >= 50) return accentHex;
    return "#ef4444";
  }

  const { score, trend, delta } = data;
  const offset = CIRCUMFERENCE * (1 - score / 100);
  const color = gaugeColor(score);

  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "var(--text-secondary)";
  const trendRotation = trend === "up" ? -45 : trend === "down" ? 45 : 0;

  return (
    <div className="flex flex-col items-start gap-2">
      {/* Gauge */}
      <div className="relative" style={{ width: SIZE, height: SIZE / 2 + 10 }}>
        <svg
          width={SIZE}
          height={SIZE / 2 + STROKE}
          viewBox={`0 0 ${SIZE} ${SIZE / 2 + STROKE}`}
        >
          {/* Background arc */}
          <path
            d={`M ${STROKE / 2} ${SIZE / 2} A ${RADIUS} ${RADIUS} 0 0 1 ${SIZE - STROKE / 2} ${SIZE / 2}`}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d={`M ${STROKE / 2} ${SIZE / 2} A ${RADIUS} ${RADIUS} 0 0 1 ${SIZE - STROKE / 2} ${SIZE / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {/* Score number */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <AnimatedNumber
            value={score}
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      {/* Label */}
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        This week's productivity
      </p>

      {/* Trend */}
      <div className="flex items-center gap-1.5 text-xs">
        <motion.span
          animate={{ rotate: trendRotation, color: trendColor }}
          transition={{ duration: 0.3 }}
          className="text-sm font-bold"
          style={{ color: trendColor }}
        >
          {trendArrow}
        </motion.span>
        <span style={{ color: trendColor }}>
          {delta >= 0 ? "+" : ""}
          {delta}% vs last week
        </span>
      </div>
    </div>
  );
}
