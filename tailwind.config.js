import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    defaultTheme: 'dark',
    addCommonColors: true,
    layout: {
      dividerWeight: "1px",
      disabledOpacity: 0.5,
      fontSize: {
        tiny: "0.75rem",
        small: "0.875rem", 
        medium: "1rem",
        large: "1.125rem"
      },
      radius: {
        small: "6px",
        medium: "8px",
        large: "12px"
      },
      borderWidth: {
        small: "1px",
        medium: "1px",
        large: "2px"
      }
    },
    themes: {
      dark: {
        layout: {
          hoverOpacity: 0.8,
          boxShadow: {
            small: "0px 2px 4px 0px rgb(0 0 0 / 0.2)",
            medium: "0px 4px 6px -1px rgb(0 0 0 / 0.3)",
            large: "0px 10px 15px -3px rgb(0 0 0 / 0.4)"
          }
        },
        colors: {
          background: "#030712",
          foreground: "#f8fafc",
          primary: {
            50: "#eff6ff",
            100: "#dbeafe", 
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            DEFAULT: "#3b82f6"
          },
          focus: "#3b82f6",
          border: {
            50: "#1e293b",
            100: "#334155", 
            200: "#475569",
            300: "#64748b",
            400: "#94a3b8",
            500: "#cbd5e1",
            DEFAULT: "#1e293b"
          }
        }
      }
    }
  })],
}
