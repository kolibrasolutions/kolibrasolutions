
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
    // Add allowedHosts to resolve "Blocked request" errors in Lovable
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.lovableproject.com',
      '.lovable.app',
      '4cdcc636-b4e5-4741-b7ff-1020ce3ff208.lovableproject.com'
    ],
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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true, // Force optimization to ensure consistent versions
  },
}));
