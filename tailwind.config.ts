import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0B0D",
        surface: "#101216",
        elevated: "#16181D",
        frame: "#0D0E11",
        borderSubtle: "#1E2127",
        borderStrong: "#2A2E37",
        textPrimary: "#E6E8EB",
        textSecondary: "#9BA1AC",
        textTertiary: "#6B7280",
        textDisabled: "#454B54",
        syntax: {
          kw: "#C792EA",
          str: "#C3E88D",
          fn: "#82AAFF",
          num: "#F78C6C",
          comment: "#5C6370",
          const: "#FFCB6B",
          err: "#F07178",
        },
        neutral: {
          50: "var(--color-neutral-50, oklch(98.5% 0.004 318))",
          100: "var(--color-neutral-100, oklch(97% 0.007 318))",
          200: "var(--color-neutral-200, oklch(92.2% 0.012 318))",
          300: "var(--color-neutral-300, oklch(87% 0.019 318))",
          400: "var(--color-neutral-400, oklch(70.8% 0.03 318))",
          500: "var(--color-neutral-500, oklch(55.6% 0.034 318))",
          600: "var(--color-neutral-600, oklch(43.9% 0.032 318))",
          700: "var(--color-neutral-700, oklch(37.1% 0.03 318))",
          800: "var(--color-neutral-800, oklch(26.9% 0.026 318))",
          900: "var(--color-neutral-900, oklch(20.5% 0.022 318))",
          950: "var(--color-neutral-950, oklch(14.5% 0.016 318))",
        },
        "rb-accent": "var(--rb-accent, oklch(20.5% 0 0))",
        "rb-accent-fg": "var(--rb-accent-fg, oklch(100% 0 0))",
      },
      borderRadius: {
        "rb-xs": "var(--rb-r-xs, 4px)",
        "rb-sm": "var(--rb-r-sm, 6px)",
        "rb-md": "var(--rb-r-md, 8px)",
        "rb-lg": "var(--rb-r-lg, 10px)",
        "rb-xl": "var(--rb-r-xl, 12px)",
        "rb-2xl": "var(--rb-r-2xl, 14px)",
        "rb-3xl": "var(--rb-r-3xl, 16px)",
        "rb-4xl": "var(--rb-r-4xl, 18px)",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "var(--font-sans)", "Geist", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "var(--font-mono)", "'JetBrains Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
