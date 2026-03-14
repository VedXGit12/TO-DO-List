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
        {/* Circle background */}
        <motion.circle
          cx="10"
          cy="10"
          r="9"
          strokeWidth="1.5"
          stroke={checked ? "#22c55e" : "var(--border)"}
          animate={{
            fill: checked ? "#22c55e" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.25 }}
        />
        {/* Checkmark path */}
        <motion.path
          d="M6 10.5L8.5 13L14 7.5"
          stroke={checked ? "#0d0d0d" : "var(--border)"}
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
