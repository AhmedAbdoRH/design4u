import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
    watch: {
      usePolling: true,
      interval: 500,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/*.timestamp-*.mjs',
        '**/*.timestamp-*.js',
      ],
    },
  },
  build: {
    // Use esbuild for minification (faster and doesn't require terser)
    minify: 'esbuild',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@supabase/supabase-js',
      'react-helmet-async',
    ],
  },
});
