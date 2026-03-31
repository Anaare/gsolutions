/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gs-bg": "#F4F7EC",
        "gs-dark": "#1F352F",
        "gs-surface": "#2A4740",
        "gs-primary": "#6FA876",
        "gs-accent": "#6E4F54",
        "gs-soft": "#E6D3D8",
        "gs-text-main": "#F8FAF7",
      },
    },
  },
  plugins: [],
};
