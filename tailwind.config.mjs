const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"M PLUS 1p"', 'sans-serif', ...defaultTheme.fontFamily.sans],
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
