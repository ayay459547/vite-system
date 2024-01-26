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

const initDB = async () => {
  console.log(system, ' => ', isChange)

  if (isChange) {
    console.log('init DB')

    await deleteDB(system)
  }

  const _dbPromise = openDB(system, idbVersion, {
    upgrade (db, oldVersion) {
      storeVersion.forEach(store => {
        // 加入版本 > 原資料庫版本
        if (store.newVersion > oldVersion) {
          db.createObjectStore(store.storeName)
        }
      })
    }
  })

  _dbPromise.then(idb => {
    console.groupCollapsed('[init] indexedDB')
    console.table(idb)
    console.groupEnd()
  })

  return _dbPromise
}

const dbPromise = initDB()

export default dbPromise
