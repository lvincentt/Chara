/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C6422B",
        primary_light: "#6C320A",
        text_light: "#BBB6BA",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        nunito: ['"Nunito"', "sans-serif"], // Google Font
      },
    },
  },
  plugins: [],
};
