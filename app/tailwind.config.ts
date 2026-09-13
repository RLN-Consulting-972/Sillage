import type { Config } from "tailwindcss";

// Charte graphique officielle RLN Consulting (yvanemonides.com, mai 2022).
// Toutes les couleurs passent par des variables CSS (app/globals.css)
// pour rester facilement modifiables sans toucher au code.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        plum: "hsl(var(--plum))",
        bordeaux: "hsl(var(--bordeaux))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
        border: "hsl(var(--border))",
      },
      fontFamily: {
        serif: ["var(--font-bodoni)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
