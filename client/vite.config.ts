import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['tempo-routes', 'tempo-devtools'],
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'http://localhost:3001' 
          : 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
