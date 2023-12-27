import { openDB, deleteDB } from 'idb'
import checkSystemVersionDiff from './checkSystemVersion'

/**
 * indexedDB 刪除換新
 *
 * 處發時機:
 * 如果第一次使用系統
 * 如果系統版本更換
 */
const { isChange, system } = checkSystemVersionDiff()

if (isChange) {
  console.log('init DB')

  deleteDB(system)
}

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
