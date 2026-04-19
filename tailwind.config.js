/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#24313f",
        berry: "#d85776",
        mango: "#f6b84b",
        mint: "#5ebfa3",
        sky: "#5aa9e6",
        cream: "#fff7e7",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(36, 49, 63, 0.14)",
        pop: "0 12px 0 rgba(36, 49, 63, 0.12)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans TC",
          "PingFang TC",
          "Microsoft JhengHei",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
