const { COLORS } = require('./src/styles/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: COLORS,
      borderRadius: {
        '2.5xl': '1.25rem',
        '3.5xl': '1.875rem',
        '4xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
