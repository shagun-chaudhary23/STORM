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
        storm: {
          dark: '#080C14',
          card: '#0F172A',
          orange: '#FF6B1A',
        }
      }
    },
  },
  plugins: [],
}
