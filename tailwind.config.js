/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base':     'var(--bg-base)',
        'bg-surface':  'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        border:        'var(--border)',
        'text-primary':  'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        accent:        'var(--accent)',
        'accent-dim':  'var(--accent-dim)',
        p1:            'var(--p1)',
        p2:            'var(--p2)',
        p3:            'var(--p3)',
        p4:            'var(--p4)',
        success:       'var(--success)',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
