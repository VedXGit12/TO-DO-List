// CARD ENTRANCE — staggered list reveal
export const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export const cardVariants = {
  hidden:  { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } },
  exit:    { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.18 } },
}

// CHECK ANIMATION — satisfying task complete
export const checkVariants = {
  unchecked: { pathLength: 0, opacity: 0 },
  checked:   { pathLength: 1, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

// MODAL — scale-in with blur backdrop
export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.94, y: 8 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: { type: 'spring', stiffness: 500, damping: 32 } },
  exit:    { opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.15 } },
}

// SIDEBAR COLLAPSE
export const sidebarVariants = {
  open:   { width: 240, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { width: 64,  transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

// DRAG GHOST
export const dragVariants = {
  dragging: { scale: 1.04, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', rotate: 1.5 },
}

// COMMAND PALETTE SLIDE
export const cmdVariants = {
  hidden:  { opacity: 0, y: -12, scale: 0.97 },
  visible: { opacity: 1, y: 0,   scale: 1, transition: { type: 'spring', stiffness: 500, damping: 35 } },
}

// TOAST STACK
export const toastVariants = {
  initial: { opacity: 0, x: 60, scale: 0.9 },
  animate: { opacity: 1, x: 0,  scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } },
  exit:    { opacity: 0, x: 60, scale: 0.85, transition: { duration: 0.2 } },
}
