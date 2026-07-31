export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { green: '#8EE656', dark: '#22C55E' },
        base: 'rgb(var(--c-base) / <alpha-value>)',
        navbar: 'rgb(var(--c-navbar) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        surfacealt: 'rgb(var(--c-surfacealt) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        heading: 'rgb(var(--c-heading) / <alpha-value>)',
        body: 'rgb(var(--c-body) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
