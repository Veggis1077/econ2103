/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: { 50: '#f7f7f8', 100: '#eeeef1', 200: '#d9d9e0', 300: '#b8b8c4', 400: '#8e8ea0', 500: '#6b6b7e', 600: '#525264', 700: '#3f3f4e', 800: '#27272f', 900: '#18181d', 950: '#0f0f13' },
        brand: { 50: '#eef4ff', 100: '#dbe6fe', 200: '#bfd3fe', 300: '#93b4fd', 400: '#6090fa', 500: '#3b6ef6', 600: '#2552eb', 700: '#1d3fd8', 800: '#1e35af', 900: '#1e338a' },
      },
      boxShadow: { card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)' },
    },
  },
  plugins: [],
};
