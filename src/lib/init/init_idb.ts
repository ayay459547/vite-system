import { openDB, deleteDB } from 'idb'
import { setCookie, getCookie } from '@/lib/cookie'

const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE
const systemVersion = (import.meta as any).env.VITE_API_VERSION
/**
 * 如果系統版本更換 indexedDB 刪除換新
 */
const checkSystemVersion = () => {
  const cookieVersion = getCookie('version')

  if ([null, undefined, ''].includes(cookieVersion)) {
    setCookie('version', systemVersion)
  }
  if (cookieVersion !== systemVersion) {
    console.log('init DB')
    deleteDB(system)
    setCookie('version', systemVersion)
  }
}
checkSystemVersion()

const idbVersion = 1
/**
 * 管理新增加的 store
 * 已存在的 store 不用創建
 *
 * storeName 資料表名稱
 * newVersion 在什麼版本加入
 */
const storeVersion = [
  {
    storeName: 'columnSetting',
    newVersion: 1
  },
  {
    storeName: 'historyNavigation',
    newVersion: 1
  }
]

const dbPromise = openDB(system, idbVersion, {
  upgrade (db, oldVersion) {
    storeVersion.forEach(store => {
      // 加入版本 > 原資料庫版本
      if (store.newVersion > oldVersion) {
        db.createObjectStore(store.storeName)
      }
    })
  }
})

export default dbPromise