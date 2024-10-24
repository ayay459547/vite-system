import { openDB, deleteDB } from 'idb'
import checkSystemVersionDiff from './checkSystemVersion'
import { idbVersion, storeVersion } from '@/lib/lib_idb'
import { deepClone, swal } from '@/lib/lib_utils' // 工具

/**
 * indexedDB 刪除換新
 *
 * 處發時機:
 * 如果第一次使用系統
 * 如果系統版本更換
 */
const { isChange, system } = checkSystemVersionDiff()

const initDB = async () => {
  if (isChange) {
    console.log('[init] init DB')

    await deleteDB(system)
  }

  const _dbPromise = openDB(system, idbVersion, {
    upgrade(db, oldVersion) {
      try {
        const tempStoreVersion = deepClone({}, storeVersion)

        // 已存在的db
        const objectStoreNames = db.objectStoreNames
        const len = objectStoreNames.length
        for (let i = 0; i < len; i++) {
          const storeName = objectStoreNames[i]
          const storeInfo = storeVersion[storeName]

          const { createVersion, isDelete } = storeInfo
          // 是否刪除
          if (isDelete || createVersion > oldVersion) {
            db.deleteObjectStore(storeName)
          }
          delete tempStoreVersion[storeName]
        }

        // 尚未存在的db
        for (const storeName in tempStoreVersion) {
          const storeInfo = storeVersion[storeName]
          const { createVersion, isDelete } = storeInfo
          // 加入版本 > 舊資料庫版本
          if (!isDelete && createVersion > oldVersion) {
            db.createObjectStore(storeName)
          }
        }
      } catch (e) {
        console.log(e)

        swal({
          icon: 'error',
          title: 'upgrade indexedDB error',
          text: e
        })
      }
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
