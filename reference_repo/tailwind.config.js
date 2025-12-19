const {COLORS} = require('./src/config/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: COLORS,
      fontFamily: {
        rajdhani: ['Rajdhani-Regular'],
        'rajdhani-light': ['Rajdhani-Light'],
        'rajdhani-medium': ['Rajdhani-Medium'],
        'rajdhani-semiBold': ['Rajdhani-SemiBold'],
        'rajdhani-bold': ['Rajdhani-Bold'],
        inter: ['Inter-Regular'],
        'inter-light': ['Inter-Light'],
        'inter-italic': ['Inter-Italic'],
        'inter-medium': ['Inter-Medium'],
        'inter-semiBold': ['Inter-SemiBold'],
        'inter-bold': ['Inter-Bold'],
        'inter-extrabold': ['Inter-ExtraBold'],
      },
      fontWeight: {
        light: '200',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3.5xl': '1.875rem',
        '4xl': '2.5rem',
      },
      screens: {
        xs: {raw: '(max-width: 375px)'}, // Small phones
        sm: {raw: '(max-width: 480px)'}, // Regular phones
        md: {raw: '(max-width: 768px)'}, // Small tablets
        lg: {raw: '(max-width: 1024px)'}, // Large tablets
        xl: {raw: '(max-width: 1280px)'}, // Small laptops
      },
      fontSize: {
        xs: ['12px', {lineHeight: '16px'}],
        sm: ['14px', {lineHeight: '18px'}],
        md: ['16px', {lineHeight: '20px'}],
        lg: ['18px', {lineHeight: '24px'}],
        xl: ['20px', {lineHeight: '28px'}],
        '2xl': ['24px', {lineHeight: '32px'}],
      },
      width: {
        xs: '25%',
        sm: '50%',
        md: '75%',
        lg: '90%',
        xl: '100%',
      },
      height: {
        xs: '25%',
        sm: '50%',
        md: '75%',
        lg: '90%',
        xl: '100%',
      },
    },
  },
  plugins: [],
};
