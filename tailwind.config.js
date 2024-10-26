module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        secondary: '#3498DB',
        'light-gray': '#F4F6F8',
        'medium-gray': '#E0E4E8',
        'dark-gray': '#4A4A4A',
        teal: '#1ABC9C',
        coral: '#E74C3C',
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
            h1: {
              color: '#2C3E50',
            },
            h2: {
              color: '#2C3E50',
            },
            h3: {
              color: '#2C3E50',
            },
            strong: {
              color: '#2C3E50',
            },
            code: {
              color: '#2C3E50',
              backgroundColor: '#F4F6F8',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}