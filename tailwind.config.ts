import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#f5f7fa",
          100: "#e6ecf5",
          200: "#c3d0e6",
          300: "#8fa7cc",
          400: "#5c7db3",
          500: "#2a5399",
          600: "#1e407a",
          700: "#18325f",
          800: "#122445",
          900: "#0b1426",
        },
        primary: {
          DEFAULT: "#2a5399",
          dark: "#122445",
        },
      },
    },
  },
  plugins: [],
};

export default config;