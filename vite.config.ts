
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
    },
    dedupe: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@radix-ui/react-tooltip',
    ],
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
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@radix-ui/react-tooltip',
    ],
    force: true,
    exclude: [],
    esbuildOptions: {
      resolveExtensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    }
  },
}));
