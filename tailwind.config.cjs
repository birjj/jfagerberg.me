const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#f2fdff",
          100: "#c3f4fd",
          200: "#94eafb",
          300: "#6be1f8",
          400: "#49d8f4",
          500: "#2fcfee",
          600: "#1ac3e5",
          700: "#0bb1d2",
          800: "#048ea9",
          900: "#015869",
          950: "#002a33",
        },
      },
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
