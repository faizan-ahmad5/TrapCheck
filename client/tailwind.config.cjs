/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#1E1E2F",
        neon: {
          cyan: "#00FFD5",
          pink: "#FF00C8",
        },
        accent: {
          yellow: "#FFD500",
        },
        text: {
          base: "#FFFFFF",
          muted: "#CCCCCC",
        },
      },
      fontFamily: {
        heading: ["Orbitron", "Rajdhani", "sans-serif"],
        body: ["Inter", "Roboto", "sans-serif"],
      },
      fontSize: {
        h1: "2.25rem", // 36px
        h2: "1.75rem", // 28px
        base: "1rem", // 16px
      },
    },
  },
  plugins: [],
};
