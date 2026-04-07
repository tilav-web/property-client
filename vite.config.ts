import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("react-dom") ||
            id.includes("/react/") ||
            id.includes("react-router") ||
            id.includes("scheduler")
          ) {
            return "framework";
          }

          if (id.includes("@tanstack/react-query")) {
            return "query";
          }

          if (id.includes("i18next") || id.includes("react-i18next")) {
            return "i18n";
          }

          if (id.includes("@radix-ui")) {
            return "radix";
          }

          if (
            id.includes("formik") ||
            id.includes("yup") ||
            id.includes("react-hook-form") ||
            id.includes("@hookform/resolvers") ||
            id.includes("react-day-picker") ||
            id.includes("input-otp") ||
            id.includes("zod")
          ) {
            return "forms";
          }

          if (
            id.includes("cmdk") ||
            id.includes("use-debounce") ||
            id.includes("embla-carousel")
          ) {
            return "interaction";
          }

          if (
            id.includes("recharts") ||
            id.includes("@tanstack/react-table")
          ) {
            return "data-viz";
          }

          if (
            id.includes("leaflet") ||
            id.includes("react-leaflet") ||
            id.includes("@react-google-maps")
          ) {
            return "maps";
          }

          if (
            id.includes("axios") ||
            id.includes("lodash") ||
            id.includes("date-fns")
          ) {
            return "utils";
          }
        },
      },
    },
  },
})
