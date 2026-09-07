import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.VITE_SUPABASE_URL || 'https://divvkonzeukafawgwzzu.supabase.co'
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ag5ejpRyT9NYYgTrkIOSew_bFmzosYQ'
      ),
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      },
      proxy: {
        '/api': {
          target: 'http://localhost/backend',
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router-dom')) return 'vendor';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('swiper') || id.includes('react-countup') || id.includes('aos')) return 'ui';
          },
        },
      },
    },
  };
});
