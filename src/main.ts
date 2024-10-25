/**
 * Polyfill
 * 有需要再啟用
 */
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

// 去除 chrome 的touch事件警告
import './lib/init/init_passiveEvents'

// vue
import { createApp, h } from 'vue'
import App from './App.vue'

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

// 瀏覽器支援表
import chromeImage from './assets/browser/chrome.png?url'
import edgeImage from './assets/browser/edge.png?url'
import firefoxImage from './assets/browser/firefox.png?url'
import safariImage from './assets/browser/safari.png?url'
import operaImage from './assets/browser/opera.png?url'
import arcImage from './assets/browser/arc.png?url'

try {
  // throw 'test version'

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

} catch (e) {
  console.log(e)

  // 瀏覽版本支援對應表
  const versionTable = document.querySelector<HTMLElement>('.app-table.browser-version')
  if (![null, undefined].includes(versionTable)) {
    const elNavigator = versionTable.querySelector('.app-navigator')
    elNavigator.innerHTML = `
      <div>${navigator.userAgent}</div>
    `

    const browserList = [
      {
        name: 'Chrome',
        img: chromeImage,
        version: 'Chrome ≥ 97',
        download: 'https://www.google.com/intl/en/chrome/'
      },
      {
        name: 'Edge',
        img: edgeImage,
        version: 'Edge ≥ 97',
        download: 'https://www.microsoft.com/en-us/edge/download/'
      },
      {
        name: 'Firefox',
        img: firefoxImage,
        version: 'Firefox ≥ 104',
        download: 'https://www.mozilla.org/en-US/firefox/new/'
      },
      {
        name: 'Safari',
        img: safariImage,
        version: 'Safari ≥ 15.4',
        download: 'https://www.apple.com/lae/safari/'
      },
      {
        name: 'Opera',
        img: operaImage,
        version: 'Opera ≥ 83',
        download: 'https://www.opera.com/'
      },
      {
        name: 'Arc',
        img: arcImage,
        version: 'Arc ≥ 97',
        download: 'https://arc.net/'
      }
    ]

    browserList.forEach(browserItem => {
      const { name, img, version, download } = browserItem

      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td class="td-center">
          <img src="${img}" alt="">
          <span>${name}</span>
        </td>
        <td>${version}</td>
        <td>
          <a href="${download}" target="_blank">${download}</a>
        </td>
      `
      versionTable.querySelector('tbody').appendChild(tr)
    })

    setTimeout(() => {
      versionTable.style.opacity = '1'
    }, 3200)
  }
}
