import checkSystemVersionDiff from './checkSystemVersion'
import { hasOwnProperty, webReload } from '@/lib/lib_utils' // 工具
import { setLocalStorage, getLocalStorage, clearLocalStorage } from '@/lib/lib_storage'

const buildVersion = (import.meta as any).env.VITE_API_BUILD_VERSION

// 打包版本 如果不同 會清除瀏覽器快取 並刷新
const oldBuildVersion = getLocalStorage('buildVersion')
if (buildVersion !== oldBuildVersion) {
  console.log('💾 init buildVersion')
  setLocalStorage('buildVersion', buildVersion)

  if (hasOwnProperty(window, 'caches')) {
    window.caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => caches.delete(key))
        )
      }
    )
  }
  webReload()
}

/**
 * localStorage 刪除換新
 *
 * 處發時機:
 * 如果第一次使用系統
 * 如果系統版本更換
 */
const { isChange, system, systemVersion } = checkSystemVersionDiff()

if (isChange) {
  console.log('💾 init localStorage')

  clearLocalStorage()
  setLocalStorage('system', system)
  setLocalStorage('version', systemVersion)
  // 預設色調 淺色
  setLocalStorage('color-tone', 'light')
}
