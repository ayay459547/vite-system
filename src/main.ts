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
import './lib/init/init_localStorage'
import './lib/init/init_cookie'

// chrome 性能優化 所產生的警告
import './lib/init/passiveEvents'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
// 全局狀態管理
import { createPinia } from 'pinia'

// 路由設定
import router from './router'
// 全局組件
import pluginComponents from '@/components/pluginComponents'
// vue v-指令
import pluginDirective from '@/directive/pluginDirective'
// 翻譯
import i18n from '@/i18n/i18n'

const app = createApp(App)

app.use(createPinia())

app.use(router)
app.use(pluginComponents)
app.use(pluginDirective)
app.use(i18n)

app.mount('#app')