import TailwindTypography from '@tailwindcss/typography'
import TailwindForms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0'
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB'
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      maxWidth: {
        '8xl': '88rem'
      },
      fontSize: {
        '2xs': '0.625rem'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      animation: {
        'gradient': 'gradient 8s linear infinite'
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: [TailwindTypography, TailwindForms]
}