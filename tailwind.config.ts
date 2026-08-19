import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ededed",
        accent: "#00ff88",
      },
      fontFamily: {
        heading: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        logo: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        "drift-1": "drift-1 28s ease-in-out infinite",
        "drift-2": "drift-2 24s ease-in-out infinite",
        "drift-3": "drift-3 32s ease-in-out infinite",
      },
      keyframes: {
        "drift-1": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(120px, 80px)" },
          "50%": { transform: "translate(60px, 160px)" },
          "75%": { transform: "translate(-40px, 60px)" },
        },
        "drift-2": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-100px, -60px)" },
          "50%": { transform: "translate(-160px, 40px)" },
          "75%": { transform: "translate(-50px, -120px)" },
        },
        "drift-3": {
          "0%, 100%": { transform: "translate(-50%, -50%)" },
          "33%": { transform: "translate(calc(-50% + 80px), calc(-50% - 60px))" },
          "66%": { transform: "translate(calc(-50% - 70px), calc(-50% + 90px))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
