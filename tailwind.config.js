module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#1A202C", // dark gray for sidebar
        },
        content: {
          DEFAULT: "#F7FAFC", // off-white for main content
        },
        accent: {
          DEFAULT: "#4A90E2", // blue accents
        },
        status: {
          progress: "#F59E0B", // amber-500 for In Progress
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        }
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            h1: { fontWeight: "700" },
            h2: { fontWeight: "700" },
            h3: { fontWeight: "600" },
            a: { color: theme("colors.brand.600") },
          },
        },
        invert: {
          css: {
            color: theme("colors.gray.200"),
            a: { color: theme("colors.brand.400") },
          },
        },
      }),
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
