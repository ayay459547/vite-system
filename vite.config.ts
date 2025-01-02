import { fileURLToPath, URL } from 'node:url'

import type { UserConfigExport, UserConfig, UserConfigFnObject } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// import eslintPlugin from 'vite-plugin-eslint'
// import VueDevTools from 'vite-plugin-vue-devtools'

// @ts-ignore
import { transformI18n, transformRoutes } from './transformExcel'

// https://vitejs.dev/config/
const userConfigFnObject: UserConfigFnObject = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const buildVersion = env.VITE_API_BUILD_VERSION
  const nowDate = new Date()
  const timestamp = nowDate.getTime()
  const [
    year, month, day,
    hour, min, second
  ] = [
    nowDate.getFullYear(),
    `${nowDate.getMonth() + 1}`.padStart(2, '0'),
    `${nowDate.getDate()}`.padStart(2, '0'),
    `${nowDate.getHours()}`.padStart(2, '0'),
    `${nowDate.getMinutes()}`.padStart(2, '0'),
    `${nowDate.getSeconds()}`.padStart(2, '0')
  ]
  const isDevelopment = mode === 'development'

  console.log('\n', '------------------------------------------------------------------------', '\n')
  console.log('\x1B[33m%s\x1B[0m \x1B[36m%s\x1B[0m', '前端服務器資訊', `(執行時間: ${year}-${month}-${day} ${hour}:${min}:${second})`)
  console.table({
    '版本': buildVersion,
    '時間': timestamp,
    '指令': command,
    '模式': mode
  })
  console.log('\x1B[43m%s\x1B[0m', '注意版本是否有更新')
  console.log('\n', '------------------------------------------------------------------------', '\n')


  return {
    base: './', // 路徑
    // root: path.resolve(__dirname, './src/'),
    build: {
      outDir: 'portal', // 匯出資料夾名稱
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        output: {
          // chunkFileNames: `static/js/[name].[hash].${buildVersion}.${timestamp}.js`,
          // entryFileNames: `static/js/[name].[hash].${buildVersion}.${timestamp}.js`,
          // assetFileNames: `static/[ext]/[name].[hash].${buildVersion}.${timestamp}.[ext]`

          // 由於 buildVersion + timestamp 會不斷更新, 所以移除 [hash]
          chunkFileNames: `static/js/[name].${buildVersion}.${timestamp}.js`,
          entryFileNames: `static/js/[name].${buildVersion}.${timestamp}.js`,
          assetFileNames: `static/[ext]/[name].${buildVersion}.${timestamp}.[ext]`,
          manualChunks (id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      },
      minify: 'esbuild'
    },
    assetsInclude: [
      // xlsx file should be treated as assets
      '**/*.xlsx'
    ],
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      lazyImport({
        resolvers: [
          VxeResolver({ libraryName: 'vxe-table' }),
          VxeResolver({ libraryName: 'vxe-pc-ui' })
        ]
      }),
      {
        name: 'custom-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (/i18n.json/.test(req?.url ?? '')) {
              // 將 i18n excel 轉換成 json
              transformI18n()
            } else if (/routes.json/.test(req?.url ?? '')) {
              // 將 routes excel 轉換成 json
              transformRoutes()
            }
            next()
          })
        }
      }
    ],
    server: {
      port: 4040, // 服務器 port號
      host: '0.0.0.0',
      open: true, // 是否啟動服務時 打開瀏覽器
      cors: true, // 是否跨域 配合 proxy 使用
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
        ssrFiles: [],
        clientFiles: [
          './src/lib/init/*.ts',
          './src/lib/*.ts'
        ]
      },
      hmr: {
        // protocol: 'ws', // 使用 WebSocket 協議
        // host: 'localhost',
        // port: 3000, // 設定 HMR 使用的端口
        // overlay: false // 根據需要禁用錯誤覆蓋層
      },
      https: false // 啟用 HTTPS
      // https: {
      //   key: readFileSync('../.pem'),
      //   cert: readFileSync('../.pem')
      // }
    },
    resolve: {
      // extensions: ['.tsx', '.json', '.js', '.ts'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        $: fileURLToPath(new URL('./public', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/main.scss" as *;',
          quietDeps: true, // 僅顯示錯誤，不顯示警告
          api: 'modern-compiler', // or "modern"
          // Sass 2.0.0 隱藏訊息
          // Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
          silenceDeprecations: ['legacy-js-api']
        }
      },
      devSourcemap: isDevelopment // 在開發模式下啟用 source map
    },
    optimizeDeps: {
      include: ['vue', 'axios'] // 指定需要預打包的依賴
    }
  }
})
const viteConfig: UserConfigExport = defineConfig(userConfigFnObject)

export default viteConfig as UserConfig
