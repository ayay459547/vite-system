import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), vueJsx()],
  server: {
    port: 4040,
    host: '0.0.0.0',
    // https://cn.vitejs.dev/config/server-options.html#server-proxy
    proxy: {
      '/api': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    // extensions: ['.js', '.ts', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', (import.meta as any).url)),
      '$': fileURLToPath(new URL('./public', (import.meta as any).url)),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/_global.scss";'
      }
    }
  }
})
