module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50',
          dark: '#1a2530',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        secondary: {
          DEFAULT: '#3498DB',
          dark: '#2980b9',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        'light-gray': {
          DEFAULT: '#F4F6F8',
          dark: '#2d3748',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        'medium-gray': {
          DEFAULT: '#E0E4E8',
          dark: '#4a5568',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        'dark-gray': {
          DEFAULT: '#4A4A4A',
          dark: '#1a202c',
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b'
        },
        teal: {
          DEFAULT: '#1ABC9C',
          dark: '#16a085',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e'
        },
        coral: {
          DEFAULT: '#E74C3C',
          dark: '#c0392b',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        dark: {
          DEFAULT: '#111827',
          surface: '#1f2937',
          lighter: '#374151',
          lightest: '#4b5563'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#4A4A4A',
            a: {
              color: '#3498DB',
              '&:hover': {
                color: '#2C3E50',
              },
            },
            h1: { color: '#2C3E50' },
            h2: { color: '#2C3E50' },
            h3: { color: '#2C3E50' },
            strong: { color: '#2C3E50' },
            code: {
              color: '#2C3E50',
              backgroundColor: '#F4F6F8',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' }
          },
        },
        dark: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#60a5fa',
              '&:hover': { color: '#93c5fd' }
            },
            h1: { color: '#f1f5f9' },
            h2: { color: '#f1f5f9' },
            h3: { color: '#f1f5f9' },
            strong: { color: '#f1f5f9' },
            code: {
              color: '#e2e8f0',
              backgroundColor: '#1e293b'
            }
          }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}