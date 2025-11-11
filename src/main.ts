/**
 * Polyfill
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Polyfill
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

// 去除 chrome 的事件警告
import './lib/init/init_passiveEvents'

// vue
import { createApp, h } from 'vue'
import App from './App.vue'

// 全域狀態管理
import { createPinia } from 'pinia'

// 路由設定
import { useRoutesStore } from '@/stores/useRoutesStore'
import { getType } from '@/lib/lib_utils' // 工具
import { initRouter } from './router'

// 全域組件
import pluginComponents from '@/components/pluginComponents'
// v-指令
import pluginDirective from '@/directive/pluginDirective'

// 翻譯
import { createI18n } from 'vue-i18n'
import { defaultLang, i18nMap } from '@/declare/declare_i18n'
import { getI18nMessages } from '@/lib/lib_i18n'

// 初始化
async function initApp () {
  try {
    // throw 'throw test' // 測試 初始化失敗

    const app = createApp({
      render: () => h(App),
      devtools: { hide: false }
    })

    // debug 使用
    app.config.globalProperties.$log = (any: any) => {
      console.log('$log => ', any)
      const value = ['string', 'number', 'boolean'].includes(typeof any) ? any : getType(any)
      return `$log[ ${value} ]`
    }

    // stores
    app.use(createPinia())
    const routesStore = useRoutesStore()
    const { initRoutes } = routesStore
    const routes = await initRoutes()
    const router = initRouter(routes)

    app.use(router)
    app.use(pluginComponents)
    app.use(pluginDirective)

    // 翻譯
    app.use(
      createI18n({
        fallbackWarn: false,
        missingWarn: false,
        legacy: false,
        globalInjection: true,
        locale: defaultLang, // 設定語言
        fallbackLocale: defaultLang, // 若選擇的語言缺少翻譯則退回的語言
        messages: getI18nMessages(i18nMap)
      })
    )

    app.mount('#app')

  } catch (e) {

    // 初始化失敗
    console.error(e)

    // 瀏覽版本支援對應表
    const versionTable: any = document.querySelector<HTMLElement>('.app-table.browser-version')
    if (![null, undefined].includes(versionTable)) {
      const elNavigator = versionTable.querySelector('.app-navigator')
      elNavigator.innerHTML = `
        <div>${navigator.userAgent}</div>
      `
      // 瀏覽器支援表
      const browserList = [
        {
          name: 'Chrome',
          imageImport: () => import('./assets/images/browser/chrome.png?url'),
          version: 'Chrome ≥ 110',
          download: 'https://www.google.com/intl/en/chrome/'
        },
        {
          name: 'Edge',
          imageImport: () => import('./assets/images/browser/edge.png?url'),
          version: 'Edge ≥ 110',
          download: 'https://www.microsoft.com/en-us/edge/download/'
        },
        {
          name: 'Firefox',
          imageImport: () => import('./assets/images/browser/firefox.png?url'),
          version: 'Firefox ≥ 115',
          download: 'https://www.mozilla.org/en-US/firefox/new/'
        },
        {
          name: 'Safari',
          imageImport: () => import('./assets/images/browser/safari.png?url'),
          version: 'Safari ≥ 16',
          download: 'https://www.apple.com/lae/safari/'
        },
        {
          name: 'Opera',
          imageImport: () => import('./assets/images/browser/opera.png?url'),
          version: 'Opera ≥ 96',
          download: 'https://www.opera.com/'
        }
      ]

      browserList.forEach(async browserItem => {
        const { name, imageImport, version, download } = browserItem

        // 動態載入圖片 URL
        const imgModule = await imageImport()
        const imgSrc = imgModule.default

        const tr = document.createElement('tr')
        tr.innerHTML = `
          <td class="td-center">
            <img src="${imgSrc}" alt="${name} logo">
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
}
initApp()
