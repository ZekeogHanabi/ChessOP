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
        brand: {
          primary: '#8c6a5c',
          secondary: '#e6dfd9',
          dark: '#1e1e1a',
          'bg-dark': '#121210',
          'bg-light': '#f7f5f0',
          'board-light': '#ececd7',
          'board-dark': '#739552',
        }
      }
    },
  },
  plugins: [],
}
