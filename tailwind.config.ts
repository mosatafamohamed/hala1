import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      screens: {
        "2xl": "1280px"
      },
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem"
      }
    },
    extend: {
      colors: {
        navy: "rgb(var(--color-navy) / <alpha-value>)",
        sky: "rgb(var(--color-sky) / <alpha-value>)",
        bronze: "rgb(var(--color-bronze) / <alpha-value>)",
        slate: "rgb(var(--color-slate) / <alpha-value>)",
        white: "rgb(var(--color-white) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"]
      },
      borderRadius: {
        soft: "0.8rem",
        card: "1.05rem",
        xl: "1.5rem"
      },
      boxShadow: {
        soft: "0 18px 44px rgba(16, 35, 58, 0.18)",
        card: "0 12px 28px rgba(16, 35, 58, 0.11)"
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem"
      }
    }
  },
  plugins: []
};

export default config;
