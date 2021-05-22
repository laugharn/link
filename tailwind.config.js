const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

const config = {
  darkMode: 'media',
  mode: 'jit',
  plugins: [require('@tailwindcss/forms')],
  purge: {
    content: ['./components/**/*.js', './pages/**/*.js'],
  },
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      ...colors,
    },
    fontFamily: {
      sans: ['InterDisplay var', 'InterDisplay', 'Inter', ...defaultTheme.fontFamily.sans],
    },
  },
}

module.exports = config
