import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Points to client/src
      "@": path.resolve(import.meta.dirname, "src"),
      // Goes up one level to find shared in the project root
      "@shared": path.resolve(import.meta.dirname, "..", "shared"),
      // Goes up one level to find attached_assets in the project root
      "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
    },
  },
  // Since the config file is in 'client', the root IS the current directory
  root: import.meta.dirname, 
  build: {
    // Places the build folder in the project root (Proper-Reference/dist/public)
    outDir: path.resolve(import.meta.dirname, "..", "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/media": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});