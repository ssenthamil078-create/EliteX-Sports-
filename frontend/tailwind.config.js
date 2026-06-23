/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B1A',
        surface: '#111827',
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#A855F7',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#f58c0b',
      },
      boxShadow: {
        neon: '0 0 30px rgba(99, 102, 241, 0.35)',
        soft: '0 20px 60px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'sports-glow': 'radial-gradient(circle at top left, rgba(99,102,241,0.25), transparent 35%), radial-gradient(circle at bottom right, rgba(168,85,247,0.18), transparent 30%)',
      }
    },
  },
  plugins: [],
}
