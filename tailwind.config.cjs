const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cabin Variable", ...defaultTheme.fontFamily.sans],
        headings: ["Questrial", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        "5vh": "5vh",
        "10vh": "10vh",
        "15vh": "15vh",
        "5vw": "5vw",
        "10vw": "10vw",
        "15vw": "15vw",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
