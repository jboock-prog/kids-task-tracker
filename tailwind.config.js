/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kidPink: '#FF6584',
        kidBlue: '#3B82F6',
        kidTeal: '#14B8A6',
        kidPurple: '#8B5CF6',
        kidYellow: '#FBBF24',
        kidGreen: '#10B981',
      },
      fontFamily: {
        sans: ['"Comic Neue"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
