import { motion } from "framer-motion";

const PRIORITY_MAP: Record<1 | 2 | 3 | 4, { label: string; color: string; hex: string; glowColor: string; shouldPulse: boolean }> = {
  1: { label: "Urgent", color: "var(--p1)", hex: "#ff6464", glowColor: "rgba(255,80,80,0.3)", shouldPulse: true },
  2: { label: "High",   color: "var(--p2)", hex: "#ffa050", glowColor: "rgba(255,140,60,0.3)", shouldPulse: true },
  3: { label: "Medium", color: "var(--p3)", hex: "#64a0ff", glowColor: "rgba(80,140,255,0.3)", shouldPulse: false },
  4: { label: "Low",    color: "var(--p4)", hex: "#a0a0b4", glowColor: "none", shouldPulse: false },
};

interface PriorityBadgeProps {
  priority: 1 | 2 | 3 | 4;
  onChange?: (next: 1 | 2 | 3 | 4) => void;
}

export default function PriorityBadge({ priority, onChange }: PriorityBadgeProps) {
  const { hex, glowColor, shouldPulse } = PRIORITY_MAP[priority];

  const cycle = () => {
    const next = ((priority % 4) + 1) as 1 | 2 | 3 | 4;
    onChange?.(next);
  };

  return (
    <motion.button
      onClick={(e) => { e.stopPropagation(); cycle(); }}
      whileTap={{ scale: 0.85 }}
      className="shrink-0 flex items-center justify-center"
      style={{ width: 12, height: 12 }}
      title={PRIORITY_MAP[priority].label}
    >
      <motion.span
        animate={{ backgroundColor: hex }}
        transition={{ duration: 0.2 }}
        className={shouldPulse ? "glow-dot" : ""}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          display: "block",
          backgroundColor: hex,
          boxShadow: glowColor !== "none" ? `0 0 6px ${glowColor}` : "none",
          color: hex,
        }}
      />
    </motion.button>
  );
}
