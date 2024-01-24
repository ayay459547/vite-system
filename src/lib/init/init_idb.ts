import { openDB, deleteDB } from 'idb'
import checkSystemVersionDiff from './checkSystemVersion'
import { idbVersion, storeVersion } from '@/lib/lib_idb'

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
