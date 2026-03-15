/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base:      "var(--bg-base)",
        surface:   "var(--bg-surface)",
        elevated:  "var(--bg-elevated)",
        accent:    "var(--accent)",
        primary:   "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary:  "var(--text-tertiary)",
        ghost:     "var(--text-ghost)",
      },
      fontFamily: {
        sans:    ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "system-ui", "sans-serif"],
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "system-ui", "sans-serif"],
        body:    ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "SF Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      borderRadius: {
        'glass-sm': '10px',
        'glass':    '16px',
        'glass-lg': '22px',
        'glass-xl': '28px',
      },
      backdropBlur: {
        glass: "48px",
      },
    },
  },
  plugins: [],
};
