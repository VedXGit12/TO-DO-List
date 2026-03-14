import { motion } from "framer-motion";

const PRIORITY_MAP: Record<1 | 2 | 3 | 4, { label: string; color: string; hex: string }> = {
  1: { label: "Urgent", color: "var(--p1)", hex: "#ef4444" },
  2: { label: "High",   color: "var(--p2)", hex: "#f97316" },
  3: { label: "Medium", color: "var(--p3)", hex: "#3b82f6" },
  4: { label: "Low",    color: "var(--p4)", hex: "#6b7280" },
};

interface PriorityBadgeProps {
  priority: 1 | 2 | 3 | 4;
  onChange?: (next: 1 | 2 | 3 | 4) => void;
}

export default function PriorityBadge({ priority, onChange }: PriorityBadgeProps) {
  const { label, color, hex } = PRIORITY_MAP[priority];

  const cycle = () => {
    const next = ((priority % 4) + 1) as 1 | 2 | 3 | 4;
    onChange?.(next);
  };

  return (
    <motion.button
      onClick={(e) => { e.stopPropagation(); cycle(); }}
      whileTap={{ scale: 0.85 }}
      animate={{ backgroundColor: `${hex}20` }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium select-none"
      style={{ color }}
    >
      <motion.span
        animate={{ backgroundColor: hex }}
        transition={{ duration: 0.2 }}
        className="w-1.5 h-1.5 rounded-full inline-block"
      />
      {label}
    </motion.button>
  );
}
