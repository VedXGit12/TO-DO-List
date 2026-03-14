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
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
        mono:    ["Geist Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
