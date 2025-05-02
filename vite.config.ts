
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    historyApiFallback: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
  preview: {
    port: 8080,
    historyApiFallback: true
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Use exact module matching with $ to prevent partial matches
      "react$": path.resolve(__dirname, "./node_modules/react"),
      "react-dom$": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    // Explicitly dedupe React to prevent multiple instances
    dedupe: ['react', 'react-dom'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Remove react from manualChunks since it's now external
          'ui': ['@/components/ui/index.ts'],
        },
      },
      external: ['react', 'react-dom']
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true, // Force optimization to ensure consistent versions
  },
}));
