// Polyfill
import './lib/Polyfill/inject'

/**
 * 初始化客戶瀏覽器端的資料
 *
 * idb
 * cookie
 * localStorage 必需最後
 */
import './lib/init/init_idb'
import './lib/init/init_cookie'
import './lib/init/init_localStorage'

// worker
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module'
})
worker.postMessage('idb')
worker.addEventListener(
  'message',
  function (e) {
    console.log('[workder]', e.data)
  },
  false
)
// worker.terminate()

// 去除 chrome 的touch事件警告
import './lib/init/init_passiveEvents'

// vue
import { createApp, h } from 'vue'
import App from './App.vue'
import './assets/reset.css'

// 全域狀態管理
import { createPinia } from 'pinia'

// 路由設定
import router from './router'
// 全域組件
import pluginComponents from '@/components/pluginComponents'
// vue v-指令
import pluginDirective from '@/directive/pluginDirective'
// 翻譯
import i18n from '@/i18n'

// 暗黑模式 尚未開發
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp({
  render: () => h(App),
  devtools: { hide: false }
})

app.config.globalProperties.$log = (any: any) => {
  console.log('$log => ', any)
  return '$log'
}

app.use(createPinia())

app.use(router)
app.use(pluginComponents)
app.use(pluginDirective)
app.use(i18n)

app.mount('#app')
