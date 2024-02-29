// 去除 chrome 的touch事件警告
import './lib/init/passiveEvents'

// object 有類似 array 方法
import './lib/init/objectFunction'

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
