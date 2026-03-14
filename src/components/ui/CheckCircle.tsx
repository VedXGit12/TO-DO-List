import { motion } from "framer-motion";
import { checkVariants } from "../../lib/animations";

interface CheckCircleProps {
  checked: boolean;
  onToggle: () => void;
}

export default function CheckCircle({ checked, onToggle }: CheckCircleProps) {
  return (
    <motion.button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      whileTap={{ scale: 0.85 }}
      className="shrink-0 flex items-center justify-center"
      style={{ width: 22, height: 22 }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {/* Glow ring when checked */}
        {checked && (
          <circle
            cx="10"
            cy="10"
            r="9"
            fill="none"
            stroke="none"
            style={{ filter: "drop-shadow(0 0 6px rgba(80,220,140,0.5))" }}
          />
        )}
        {/* Circle background with radial gradient fill */}
        <defs>
          <radialGradient id="check-fill-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(80,220,140,0.9)" />
            <stop offset="100%" stopColor="rgba(60,200,120,0.7)" />
          </radialGradient>
        </defs>
        <motion.circle
          cx="10"
          cy="10"
          r="9"
          strokeWidth="1.5"
          stroke={checked ? "rgba(80,220,140,0.9)" : "rgba(255,255,255,0.25)"}
          animate={{
            fill: checked ? "url(#check-fill-grad)" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.25 }}
          style={checked ? { filter: "drop-shadow(0 0 12px rgba(80,220,140,0.5))" } : undefined}
        />
        {/* Checkmark path */}
        <motion.path
          d="M6 10.5L8.5 13L14 7.5"
          stroke={checked ? "#0d0d0d" : "rgba(255,255,255,0.25)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={checkVariants}
          animate={checked ? "checked" : "unchecked"}
        />
      </svg>
    </motion.button>
  );
}
