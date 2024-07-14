import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      aspectRatio: {
        "9/16": "9 / 16",
        "16/9": "16 / 9",
        "4/5": "4 / 5",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        system:
          "system-ui  -apple-system  BlinkMacSystemFont  Segoe UI  Roboto  Ubuntu  Cantarell  Noto Sans  sans-serif  Apple Color Emoji  Segoe UI Emoji  Segoe UI Symbol  Noto Color Emoji",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "story": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        "like": {
          "from": { transform: "scale(0.5)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", display: "none" },
        },
        "visible": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "story-skip-start": {
          from: { opacity: "0" },
          to: { opacity: "0.5" },
        },
        "story-skip-end": {
          from: { opacity: "0.5" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "story": "story 5s linear 1",
        "like": "like 0.5s ease-in-out forwards",
        "opacity": "visible 0.1s ease-out",
        "skip-start": "story-skip-start 0.15s ease-out",
        "skip-end": "story-skip-end 0.15s ease-in",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
