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
        primary: '#0EA5E9',
        accent: '#06B6D4',
        charcoal: '#101720',
        'cool-blue': '#D1EAF0',
      },
    },
  },
  plugins: [],
} satisfies Config;
