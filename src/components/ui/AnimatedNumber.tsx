import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedNumber({
  value,
  duration = 0.8,
  decimals = 0,
  className,
  style,
}: AnimatedNumberProps) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(
          decimals > 0
            ? v.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              })
            : Math.round(v).toLocaleString()
        );
      },
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, duration, decimals, mv]);

  return (
    <span className={className} style={style}>
      {display}
    </span>
  );
}
