import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Add these configurations
  base: "/", // This is crucial for correct paths

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // Disable sourcemaps for production
    minify: "esbuild", // Minify code

    // Rollup options to handle chunking
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },

  // Server configuration for development
  server: {
    port: 3000,
    open: true, // Automatically open browser
  },

  // Preview server configuration
  preview: {
    port: 3000,
  },
});
