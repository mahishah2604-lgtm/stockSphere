/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-soft': '0 0 12px rgba(56, 189, 248, 0.22)',
      },
      colors: {
        bg0: '#090909',
        bg1: '#121212',
        bg2: '#1A1A1A',
        purple: '#8B5CF6',
        violet: '#A855F7',
        blue: '#60A5FA',
        cyan: '#38BDF8',
        profit: '#22C55E',
        loss: '#EF4444',
      },
    },
  },
  plugins: [],
}

