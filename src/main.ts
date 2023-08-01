// polyfill
import './lib/Polyfill/inject'
// object 有類似 array 方法
import './lib/init/objectFunction'

/**
 * 初始化客戶瀏覽器端的資料
 *
 * idb
 * localStorage
 * cookie
 */
import './lib/init/init_idb'
import './lib/init/init_cookie'
import './lib/init/init_localStorage'

// chrome 性能優化 所產生的警告
import './lib/init/passiveEvents'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
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

// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

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