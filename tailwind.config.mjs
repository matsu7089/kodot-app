const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,md}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"M PLUS 1p"', 'sans-serif', ...defaultTheme.fontFamily.sans],
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
      },
      colors: {
        godot: {
          DEFAULT: '#478cbf',
          dark: '#244660',
        },
        'godot-green': {
          DEFAULT: '#47bf99',
          dark: '#24604c',
        },
        'gh-dimmed': {
          text: '#adbac7',
          bg: '#22272e',
        },
      },
      listStyleType: {
        square: 'square',
      },
    },
  },
  plugins: [],
}
