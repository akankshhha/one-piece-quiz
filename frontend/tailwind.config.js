/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all source files
  ],
  theme: {
    extend: {
      fontFamily: {
        vt323: ['"VT323"', 'monospace'],
        pressStart: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'cream-yellow': '#ECDFCC', 
        'almost-black': '#161717'
      },
    },
  },
  plugins: [],
};
