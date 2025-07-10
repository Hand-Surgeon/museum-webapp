import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      // Bundle size analysis in production
      isProduction && visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ].filter(Boolean),
    server: {
      port: 3000,
      open: true,
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: blob:",
          "font-src 'self' data:",
          "connect-src 'self' https://sgvpiljodxoyghluvdhi.supabase.co wss://sgvpiljodxoyghluvdhi.supabase.co",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "base-uri 'self'"
        ].join('; ')
      }
    },
    build: {
      target: 'es2018',
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : undefined,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-window': ['react-window'],
            'locales': ['./src/locales/ko.json', './src/locales/en.json', './src/locales/ja.json', './src/locales/zh.json']
          },
          // Asset naming for better caching
          assetFileNames: isProduction
            ? 'assets/[name].[hash][extname]'
            : 'assets/[name][extname]',
          chunkFileNames: isProduction
            ? 'js/[name].[hash].js'
            : 'js/[name].js',
          entryFileNames: isProduction
            ? 'js/[name].[hash].js'
            : 'js/[name].js'
        }
      },
      // Performance budgets
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: isProduction
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    },
    // Production-specific optimizations
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : []
    }
  }
})