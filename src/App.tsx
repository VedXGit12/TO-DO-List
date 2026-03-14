import { motion } from 'framer-motion'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="text-center"
      >
        <h1
          className="text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
        >
          Notion-Killer Todo
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
          The todo app that feels alive. — Session 2 coming next.
        </p>
      </motion.div>
    </div>
  )
}
