import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/epi": {
        target: "orangedynasty.global",
        changeOrigin: true,
        secure: false, // For local development
      },
    },
  },
});