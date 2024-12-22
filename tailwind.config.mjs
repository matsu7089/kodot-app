const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,tsx,md}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"BIZ UDPGothic"', ...defaultTheme.fontFamily.sans],
        ps2: ['"Press Start 2P"', 'sans-serif'],
      },
      colors: {
        'kodot-blue': {
          DEFAULT: '#478cbf',
          dark: '#244660',
        },
        'kodot-green': {
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
      rotate: {
        aa: '0.05deg',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^(text|bg)-kodot-[^-]+$/,
    },
    {
      pattern: /^bg-kodot-.+-dark$/,
      variants: ['dark'],
    },
  ],
}
