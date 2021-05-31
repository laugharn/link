const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

const config = {
  darkMode: 'media',
  mode: 'jit',
  plugins: [require('@tailwindcss/forms')],
  purge: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      ...colors,
    },
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
    fontFamily: {
      sans: [
        'InterDisplay var',
        'InterDisplay',
        'Inter',
        ...defaultTheme.fontFamily.sans,
      ],
    },
  },
}

module.exports = config
