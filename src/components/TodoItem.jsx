import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TodoItem({ task, isEditing, onToggle, onDelete, onEdit, onStartEdit, onCancelEdit }) {
  const [editValue, setEditValue] = useState(task.text)

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') onEdit(editValue)
    if (e.key === 'Escape') onCancelEdit()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass-card rounded-xl px-4 py-3 mb-2 flex items-center gap-3 group shadow-sm"
    >
      {/* Checkbox */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onToggle}
        aria-label={task.checked ? 'Mark as active' : 'Mark as complete'}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          task.checked
            ? 'bg-emerald-400 border-emerald-400 text-white'
            : 'border-white/40 hover:border-white/70'
        }`}
      >
        {task.checked && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            className="text-xs font-bold leading-none"
          >
            ✓
          </motion.span>
        )}
      </motion.button>

      {/* Task text / edit input */}
      {isEditing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onEdit(editValue)}
          onKeyDown={handleEditKeyDown}
          className="flex-1 bg-white/10 text-white text-sm rounded-lg px-2 py-1 outline-none border border-white/30 focus:border-white/60"
        />
      ) : (
        <motion.span
          layout
          onDoubleClick={onStartEdit}
          title="Double-click to edit"
          className={`flex-1 text-sm font-medium transition-all duration-300 cursor-text ${
            task.checked ? 'line-through text-white/40' : 'text-white'
          }`}
        >
          {task.text}
        </motion.span>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onStartEdit}
            aria-label="Edit task"
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs flex items-center justify-center transition"
          >
            ✏️
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onDelete}
          aria-label="Delete task"
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/50 text-white/70 hover:text-white text-xs flex items-center justify-center transition"
        >
          🗑️
        </motion.button>
      </div>
    </motion.div>
  )
}
