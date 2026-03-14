import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
}

export default function ProgressRing({ progress, size = 56 }: ProgressRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const percent = Math.round(progress * 100);
  const arcColor = progress >= 0.5 ? "#22c55e" : "#e8a045";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--bg-elevated)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={arcColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </svg>
      <motion.span
        key={percent}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute text-xs font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {percent}%
      </motion.span>
    </div>
  );
}
