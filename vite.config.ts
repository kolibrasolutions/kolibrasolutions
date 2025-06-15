
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
      // ONLY these explicit aliases for React:
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    // Dedupe all possible React import paths:
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime"
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          ui: [
            '@radix-ui/react-tooltip',
            '@radix-ui/react-toast'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-query'
    ],
    force: true,
    exclude: [],
    esbuildOptions: {
      resolveExtensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    }
  },
}));
