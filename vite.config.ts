import { fileURLToPath, URL } from 'node:url'
// https://docs.sheetjs.com/docs/demos/static/vitejs/
import { readFileSync, writeFileSync } from 'fs'
import { read, utils } from 'xlsx'
// import path from 'path'
// import { resolve } from 'path'

import { defineConfig, loadEnv } from 'vite'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import eslintPlugin from 'vite-plugin-eslint'
// import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const buildVersion = env.VITE_API_BUILD_VERSION
  const timestamp = new Date().getTime()
  console.log({
    buildVersion,
    mode,
    command,
    timestamp
  })

  return {
    base: './',
    // root: path.resolve(__dirname, './src/'),
    build: {
      outDir: 'demo',
      sourcemap: false,
      cssCodeSplit: true,
      // assetsDir: '',
      // outDir: path.resolve(__dirname, ''),
      rollupOptions: {
        output: {
          chunkFileNames: `static/js/[name].[hash].${buildVersion}.${timestamp}.js`,
          entryFileNames: `static/js/[name].[hash].${buildVersion}.${timestamp}.js`,
          assetFileNames: `static/[ext]/[name].[hash].${buildVersion}.${timestamp}.[ext]`
        }
      },
      minify: 'esbuild'
    },
    assetsInclude: ['**/*.xlsx'], // xlsx file should be treated as assets
    plugins: [
      vue(),
      vueJsx(),
      {
        // this plugin handles ?b64 tags
        name: 'vite-b64-plugin',
        transform(code, id) {
          if (!id.match(/\?b64$/) || mode !== 'development') return
          const path = id.replace(/\?b64/, '')
          const b64 = readFileSync(path, 'base64')
          const i18n = JSON.parse(JSON.stringify(b64))

          const workBook = read(i18n)
          const [wsTranslate] = [
            workBook.Sheets[workBook.SheetNames[0]]
            // workBook.Sheets[workBook.SheetNames[1]],
            // workBook.Sheets[workBook.SheetNames[2]],
            // workBook.Sheets[workBook.SheetNames[3]]
          ]
          const moduleList = [
            ...utils.sheet_to_json(wsTranslate)
            // ...utils.sheet_to_json(wsOptions),
            // ...utils.sheet_to_json(wsLiveBoard),
            // ...utils.sheet_to_json(wsPage)
          ]
          // // 將新的翻譯檔寫入
          const jsonPath = id.replace(/\.xlsx\?b64/, '.json')
          writeFileSync(jsonPath, JSON.stringify(moduleList), { flag: 'w' })
          console.log('writeI18nJSON => ', jsonPath)

          return `export default JSON.parse('${JSON.stringify({
            excelPath: path,
            jsonPath
          })}')`
        }
      },
      {
        // this plugin handles ?sheetjs tags
        name: 'vite-sheet',
        transform(code, id) {
          if (!id.match(/\?sheetjs$/)) return
          const wb = read(readFileSync(id.replace(/\?sheetjs$/, '')))
          const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          return `export default JSON.parse('${JSON.stringify(data)}')`
        }
      },
      lazyImport({
        resolvers: [
          VxeResolver({ libraryName: 'vxe-table' }),
          VxeResolver({ libraryName: 'vxe-pc-ui' })
        ]
      }),
      // VueDevTools({
      //   // openInEditorHost: 'http://localhost:3000',
      //   // clientHost: 'http://localhost:3000'
      // }),
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
      },
      warmup: {
        clientFiles: [
          './src/components/layout/**/*.vue',
          './src/lib/init/*.ts',
          './src/lib/*.ts'
        ]
      },
      hmr: {
        overlay: false // 根據需要禁用錯誤覆蓋層
      }
      // https: {
      //   key: fs.readFileSync('RootCA-key.pem'),
      //   cert: fs.readFileSync('RootCA.pem')
      // }
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
      alias: {
        '@': fileURLToPath(new URL('./src', (import.meta as any).url)),
        $: fileURLToPath(new URL('./public', (import.meta as any).url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/main.scss" as *;'
        }
      },
      devSourcemap: false // 在開發模式下啟用 source map
    },
    optimizeDeps: {
      // include: ['element-plus']
    }
  }
})
