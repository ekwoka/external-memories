const height = require("tailwindcss/defaultTheme")
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: "all",
    content: ["./**/*.njk"],
    options: {
      whitelist: [],
    },
  },
  darkMode: 'media',
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        truegray: colors.trueGray,
      },
      margin: {
        '-16': '-2rem',
        '-32': '-4rem',
        '-48': '-6rem',
        '-64': '-8rem',
        '-80': '-10rem',
        '-96': '-12rem',
      inset: {
        '1/10': '10%',
        '1/20': '5%',
      },
      width: {},
      lineHeight: {
        '12': '3rem',
        '16': '4rem',
      },
      letterSpacing: ['dark']
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
