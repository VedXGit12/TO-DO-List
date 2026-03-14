import type { Variants, Transition } from "framer-motion";

/* ── Spring presets ───────────────────────────────── */
export const springSnappy: Transition = { type: "spring", stiffness: 400, damping: 28 };
export const springDeliberate: Transition = { type: "spring", stiffness: 300, damping: 30 };
export const springInstant: Transition = { type: "spring", stiffness: 500, damping: 35 };
export const springPress: Transition = { type: "spring", stiffness: 600, damping: 30 };

/** Returns a spring or instant transition based on reduced-motion preference */
export function getTransition(reduced: boolean, spring?: Partial<Transition>): Transition {
  if (reduced) return { duration: 0 };
  return spring ?? springSnappy;
}

export const sidebarVariants: Variants = {
  open:   { width: 240, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { width: 64,  transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export const sidebarLabelVariants: Variants = {
  open:   { opacity: 1, x: 0,  display: "block", transition: { delay: 0.08, duration: 0.2 } },
  closed: { opacity: 0, x: -8, transitionEnd: { display: "none" }, transition: { duration: 0.12 } },
};

export const chevronVariants: Variants = {
  open:   { rotate: 0,   transition: { type: "spring", stiffness: 400, damping: 28 } },
  closed: { rotate: 180, transition: { type: "spring", stiffness: 400, damping: 28 } },
};

export const workspaceVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 400, damping: 30 },
  }),
};

export const workspaceChildrenVariants: Variants = {
  hidden:  { height: 0, opacity: 0, overflow: "hidden" },
  visible: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit:    { height: 0, opacity: 0, transition: { duration: 0.18 } },
};

export const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: "spring", stiffness: 400, damping: 28 } },
  exit:    { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.18 } },
};

export const modalOverlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 8 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: { type: "spring", stiffness: 500, damping: 32 } },
  exit:    { opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.15 } },
};

export const cmdVariants: Variants = {
  hidden:  { opacity: 0, y: -12, scale: 0.97 },
  visible: { opacity: 1, y: 0,   scale: 1, transition: { type: "spring", stiffness: 500, damping: 35 } },
  exit:    { opacity: 0, y: -8,  scale: 0.97, transition: { duration: 0.14 } },
};

export const toastVariants: Variants = {
  initial: { opacity: 0, x: 60, scale: 0.9 },
  animate: { opacity: 1, x: 0,  scale: 1, transition: { type: "spring", stiffness: 400, damping: 28 } },
  exit:    { opacity: 0, x: 60, scale: 0.85, transition: { duration: 0.2 } },
};

export const checkVariants: Variants = {
  unchecked: { pathLength: 0, opacity: 0 },
  checked:   { pathLength: 1, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export const dragActiveStyle = {
  scale: 1.04, rotate: 1.5,
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  zIndex: 999,
};

export const viewVariants: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const calendarGridVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.18 } }),
};

export const calendarLabelVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -24, transition: { duration: 0.15 } }),
};

export const dayDetailPanelVariants: Variants = {
  hidden: { x: 320, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 30 } },
  exit: { x: 320, opacity: 0, transition: { duration: 0.22 } },
};

/* ── Glass materialize: scale + opacity + blur fade ── */
export const glassMaterialize: Variants = {
  hidden:  { opacity: 0, scale: 0.96, filter: "blur(8px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.15 } },
};
