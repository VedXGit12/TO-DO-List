import { motion } from 'framer-motion'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

export default function FilterBar({ filter, setFilter }) {
  return (
    <div className="flex gap-2">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
            filter === key
              ? 'text-white'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          {filter === key && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 rounded-full bg-white/20"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  )
}
