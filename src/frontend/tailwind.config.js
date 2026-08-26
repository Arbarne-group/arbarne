/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          950: '#021e16',
          900: '#022c24',
          850: '#03352c',
          800: '#04382d',
          700: '#0f4f41',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        sprout: {
          400: '#4ade80',
          500: '#22c55e',
        },
        gold: {
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        canvas: '#f6f8f7',
        surface: {
          white: '#ffffff',
          soft: '#f0f4f2',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
