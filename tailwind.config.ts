import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "js-green-dark": "#243a24",
        "js-green": "#445b38",
        "js-green-light": "#65764d",
        "js-cream": "#f3ead8",
        "js-cream-dark": "#dfd0b6",
        "js-cream-mid": "#eadcc2",
        "js-brown": "#7a563f",
        "js-gold": "#a87d36",
        "js-gold-light": "#c29b55",
        "js-orange": "#a95f38",
        "js-blue": "#607f86",
        "js-blue-dark": "#435f63",
        "js-text": "#2f241a",
        "js-text-light": "#65513d",
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "Cambria", "serif"],
        display: ["Playfair Display", "Lora", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        card: "0 2px 12px rgba(139, 94, 60, 0.12), 0 1px 4px rgba(139, 94, 60, 0.08)",
        "card-hover": "0 6px 24px rgba(139, 94, 60, 0.2), 0 2px 8px rgba(139, 94, 60, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
