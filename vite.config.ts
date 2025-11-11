import { fileURLToPath, URL } from 'node:url'

import type { UserConfigFnObject, ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'

// import { visualizer } from 'rollup-plugin-visualizer'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * 打包: 只將現在的excel 重新複寫json
 * 啟動服務: 監聽excel變化 重新複寫json
 */
import { transformI18n, transformRoutes } from './transformExcel'

const ip = '127.0.0.1:8080'

const apiUrl = `http://${ip}`
const wsUrl = `ws://${ip}`

const nowDate = new Date()
const [year, month, day, hour, min, second] = [
  nowDate.getFullYear(),
  `${nowDate.getMonth() + 1}`.padStart(2, '0'),
  `${nowDate.getDate()}`.padStart(2, '0'),
  `${nowDate.getHours()}`.padStart(2, '0'),
  `${nowDate.getMinutes()}`.padStart(2, '0'),
  `${nowDate.getSeconds()}`.padStart(2, '0')
]

// https://vitejs.dev/config/
const userConfigFnObject: UserConfigFnObject = ({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')
  const {
    VITE_API_BUILD_VERSION,
    VITE_API_VERSION,
    VITE_API_SYSTEM_TYPE,
    VITE_API_SYSTEM_URL
  } = env

  const hashName = `${VITE_API_BUILD_VERSION}.${mode}.${year}-${month}-${day}_${hour}.${min}.${second}`
  const isDevelopment = mode === 'development'
  const isTest = mode === 'test'
  const isServe = command === 'serve'

  // 啟動前端服務 + 開發模式 + 不是測試 => 監聽 excel 變化
  const isWatch = isServe && isDevelopment

  // 不是測試
  if (!isTest) {
    const transformI18nList = [
      {
        fileName: 'translateSrcFile',
        excelPath: './public/i18N/translateSrcFile.xlsx',
        excel_CustPath: './public/i18N/translateSrcFile_Cust.xlsx',
        jsonPath: './public/i18N/translateSrcFile.json'
      }
    ]
    transformI18n(isWatch, transformI18nList)
    const transformRouterList = [
      {
        fileName: 'routes',
        excelPath: './public/router/routes.xlsx',
        jsonPath: './public/router/routes.json'
      }
    ]
    transformRoutes(isWatch, transformRouterList)
  }

  console.log('\n ------------------------------------------------------------------------ \n')
  console.log('\x1B[33m%s\x1B[0m \x1B[36m%s\x1B[0m', '前端服務器資訊', `(執行時間: ${year}-${month}-${day} ${hour}:${min}:${second})`)
  console.table({
    '系統類型': VITE_API_SYSTEM_TYPE,
    '系統版本': VITE_API_VERSION,
    '使用的IP': isServe ? ip : '127.0.0.1:8080',
    '指令': command,
    '模式': mode,
    '檔案hash名稱': hashName,
    '打包版本': VITE_API_BUILD_VERSION
  })
  console.log('\x1B[43m%s\x1B[0m', '注意打包版本是否有更新')
  console.log('\n ------------------------------------------------------------------------ \n')

  return {
    base: `${VITE_API_SYSTEM_URL}`, // 路徑
    build: {
      outDir: 'portal', // 匯出資料夾名稱
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: `static/js/[name].${hashName}.js`,
          entryFileNames: `static/js/[name].${hashName}.js`,
          assetFileNames: `static/[ext]/[name].${hashName}.[ext]`,
          // manualChunks: {
          //   vendor: ['vue', 'vue-router'], // 第三方庫單獨打包
          //   ui: ['element-plus'] // UI 框架單獨打包
          // }
          // manualChunks: (id: string) => {
          //   if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
          //   }
          // }
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const paths = id.split('node_modules/')[1].split('/')
              const name = paths[0].startsWith('@') ? `${paths[0]}/${paths[1]}` : paths[0]
              return `vendor-${name}`
            }
          }
        }
      },
      minify: 'esbuild'
    },
    assetsInclude: [
      '**/*.xlsx' // 不打包 excel
    ],
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      // 檢視模組占比 有需要再打開 配合打包使用 (打包時間約 1 小時)
      // visualizer({
      //   open: true, // 自動打開瀏覽器顯示報告
      //   gzipSize: false,
      //   brotliSize: false
      // }),
      // https://vxetable.cn/#/start/useGlobal
      lazyImport({
        resolvers: [
          VxeResolver({ libraryName: 'vxe-table' }),
          VxeResolver({ libraryName: 'vxe-pc-ui' })
        ]
      }),
      // https://element-plus.org/en-US/guide/quickstart.html#on-demand-import
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dirs: ['src/components'],
        directoryAsNamespace: true, // 使資料夾名稱成為命名空間的一部分
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      port: 4040, // 服務器 port號
      host: '0.0.0.0',
      open: true, // 是否啟動服務時 打開瀏覽器
      cors: true, // 是否跨域 配合 proxy 使用
      // https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {
        // ajax
        '/demo-rest': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/demo-rest/, 'demo-rest')
        },
        // webSocket
        '/ws-api/webSocket': {
          target: wsUrl,
          ws: true
        }
      },
      // 預先 轉換/緩存 的文件
      warmup: {
        ssrFiles: [],
        clientFiles: ['./src/lib/init/*.ts', './src/lib/*.ts']
      },
      // hmr: {
      //   overlay: false // 根據需要禁用錯誤覆蓋層
      // },
      watch: {
        followSymlinks: false
      }
    },
    resolve: {
      // extensions: ['.tsx', '.json', '.js', '.ts'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '$': fileURLToPath(new URL('./public', import.meta.url)),
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
}
const viteConfig = defineConfig(userConfigFnObject)

export default viteConfig
