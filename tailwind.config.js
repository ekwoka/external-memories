module.exports = {
  purge: {
    enable: true,
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
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
