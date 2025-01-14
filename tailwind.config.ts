/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617', // Primary Background
          900: '#0F172A', // Secondary Background
          800: '#1E293B', // Input Background
          700: '#334155', // Secondary Border
          500: '#64748B', // Extra Muted Text
          400: '#94A3B8', // Muted Text
          200: '#E2E8F0', // Secondary Text
        },
        blue: {
          400: '#60A5FA', // Gradient hover
          500: '#3B82F6', // Secondary Accent
          600: '#2563EB', // Primary Accent
        }
      }
    },
  },
  plugins: [],
}