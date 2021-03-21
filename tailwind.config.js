module.exports = {
  purge: {
    mode: "all",
    content: ["./**/*.njk"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
      inset: {
        '1/10': '10%',
        '1/20': '5%',
      },
      width: {},

    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
