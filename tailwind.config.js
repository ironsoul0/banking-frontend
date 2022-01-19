module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ["disabled"],
      opacity: ["disabled"],
      cursor: ["disabled", "hover"],
      backgroundColor: ["disabled"],
    },
  },
  plugins: [],
};
