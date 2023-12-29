import { fileURLToPath, URL } from 'node:url'
// https://docs.sheetjs.com/docs/demos/static/vitejs/
import { readFileSync } from 'fs'
import { read, utils } from 'xlsx'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'demo'
  },
  assetsInclude: ['**/*.xlsx'], // xlsx file should be treated as assets
  plugins: [
    vue(),
    vueJsx(),
    { // this plugin handles ?sheetjs tags
      name: 'vite-sheet',
      transform (code, id) {
        if(!id.match(/\?sheetjs$/)) return
        const wb = read(readFileSync(id.replace(/\?sheetjs$/, '')))
        const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        return `export default JSON.parse('${JSON.stringify(data)}')`
      }
    }
  ],
  server: {
    port: 4040,
    host: '0.0.0.0',
    open: true,
    cors: true,
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
