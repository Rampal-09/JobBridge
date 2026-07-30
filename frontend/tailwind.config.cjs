/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan the whole frontend folder (HTML, JS/TS/JSX/TSX) so components
  // outside `src/` (e.g. `resuableComponent`) are included.
  content: ["./**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
