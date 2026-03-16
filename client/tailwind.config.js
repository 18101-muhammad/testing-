/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        antique: {
          navy: "#1a2744",
          gold: "#c9a84c",
          cream: "#faf8f3",
          "light-gold": "#f0e6cc",
          dark: "#2c2c2c",
          muted: "#6b6b6b",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
}
