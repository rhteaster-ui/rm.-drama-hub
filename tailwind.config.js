/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          0: "#050505",
          1: "#080706",
          2: "#0D0A07",
        },
        amber: {
          DEFAULT: "#FF8A1F",
          glow: "#FFB347",
          soft: "#FFD08A",
        },
        ink: {
          DEFAULT: "#FFF7E8",
          muted: "#AFA79E",
          dim: "#B8ADA0",
        },
        rmerror: "#FF4D4D",
        rmok: "#22C55E",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
      },
      backdropBlur: {
        xs: "4px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(255,138,31,0.35)",
        "glow-sm": "0 0 12px rgba(255,138,31,0.25)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
