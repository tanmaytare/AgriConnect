/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: '#4CAF50', // Primary green
          light: '#A5D6A7',  // Light green
          dark: '#2E7D32'    // Dark green
        },
        white: '#FFFFFF'
      },
    },
  },
  plugins: [],
};
