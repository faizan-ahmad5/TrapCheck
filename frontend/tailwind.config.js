/**
 * Tailwind CSS Configuration
 * (Created manually due to CLI issues)
 * See: https://tailwindcss.com/docs/configuration
 */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
