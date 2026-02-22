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
        primary: '#F97316', // Orange-500
        accent: '#0D9488',  // Teal-600
        surface: '#FFFFFF',
        'text-primary': '#134E4A',
        'border-teal': '#CCFBF1',
      },
    },
  },
  plugins: [],
} satisfies Config;
