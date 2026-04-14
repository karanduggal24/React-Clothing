import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

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
        manualChunks: {
          // Core React
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // State management
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
          // UI libraries
          "vendor-ui": ["framer-motion", "lucide-react", "@mui/material", "@mui/icons-material"],
          // Charts
          "vendor-charts": ["recharts"],
          // Utilities
          "vendor-utils": ["react-toastify", "react-hot-toast"],
        },
      },
    },
  },
})