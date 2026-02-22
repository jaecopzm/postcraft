import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F0FAFA',
        foreground: '#134E4A',
        primary: '#F97316',
        'primary-hover': '#EA580C',
        accent: '#0D9488',
        surface: '#FFFFFF',
        border: '#CCFBF1',
        'card-bg': 'rgba(255, 255, 255, 0.9)',
        // Keep legacy colors for compatibility
        'text-primary': '#134E4A',
        'border-teal': '#CCFBF1',
      },
    },
  },
  plugins: [],
} satisfies Config;
