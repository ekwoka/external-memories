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
      inset: {
        '1/10': '10%',
        '1/20': '5%',
      },
      width: {},
      lineHeight: {
        '12': '3rem',
        '16': '4rem',
      }

    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
