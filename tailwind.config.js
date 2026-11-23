/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0A0A0F',
          light: '#F5F5FA',
        },
        surface: {
          dark: '#13131A',
          light: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
        },
        gold: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
