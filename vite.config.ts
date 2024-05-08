import { fileURLToPath, URL } from 'node:url'
// https://docs.sheetjs.com/docs/demos/static/vitejs/
// import fs, { readFileSync } from 'fs'
import { readFileSync } from 'fs'
import { read, utils } from 'xlsx'
// import path from 'path'
// import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import eslintPlugin from 'vite-plugin-eslint'
import VueDevTools from 'vite-plugin-vue-devtools'

const Timestamp = new Date().getTime()

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  // root: path.resolve(__dirname, './src/'),
  build: {
    outDir: 'demo',
    sourcemap: true,
    // assetsDir: '',
    // outDir: path.resolve(__dirname, ''),
    rollupOptions: {
      output: {
        chunkFileNames: `static/js/[name].[hash]${Timestamp}.js`,
        entryFileNames: `static/js/[name].[hash]${Timestamp}.js`,
        assetFileNames: `static/[ext]/[name].[hash]${Timestamp}.[ext]`
      }
    },
    minify: 'esbuild'
  },
  assetsInclude: ['**/*.xlsx'], // xlsx file should be treated as assets
  plugins: [
    vue(),
    vueJsx(),
    { // this plugin handles ?b64 tags
      name: 'vite-b64-plugin',
      transform (code, id) {
        if(!id.match(/\?b64$/)) return
        const path = id.replace(/\?b64/, '')
        const b64 = readFileSync(path, 'base64')
        return `export default '${b64}'`
      }
    },
    { // this plugin handles ?sheetjs tags
      name: 'vite-sheet',
      transform (code, id) {
        if(!id.match(/\?sheetjs$/)) return
        const wb = read(readFileSync(id.replace(/\?sheetjs$/, '')))
        const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        return `export default JSON.parse('${JSON.stringify(data)}')`
      }
    },
    VueDevTools({
      // openInEditorHost: 'http://localhost:3000',
      // clientHost: 'http://localhost:3000'
    }),
    eslintPlugin({
      include: [
        './src/**/*.ts',
        './src/*.ts',
        './src/**/*.tsx',
        './src/*.tsx',
        './src/**/*.vue',
        './src/*.vue'
      ]
    })
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
        rewrite: path => path.replace(/^\/api/, '')
      },
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true
      }
    }
    // https: {
    //   key: fs.readFileSync('RootCA-key.pem'),
    //   cert: fs.readFileSync('RootCA.pem')
    // }
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
        additionalData: '@import "@/assets/main.scss";'
      }
    }
  }
})
