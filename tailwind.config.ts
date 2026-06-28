import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#13131a",
        "surface-2": "#1c1c26",
        border: "#2a2a3a",
        gold: "#c9a84c",
        "gold-light": "#e8c97a",
        "mexico-green": "#006847",
        "mexico-red": "#ce1126",
        live: "#ef4444",
      },
    },
  },
  plugins: [],
}

export default config