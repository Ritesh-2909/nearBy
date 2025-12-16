/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './navigation/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35', // Orange accent from design
        secondary: '#5856D6',
        success: '#34C759',
        warning: '#FFA500',
        danger: '#FF3B30',
        accent: '#FF6B35', // Alias for primary
      },
    },
  },
  plugins: [],
};
