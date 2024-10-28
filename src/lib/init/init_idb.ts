import { openDB, deleteDB } from 'idb'
import checkSystemVersionDiff from './checkSystemVersion'
import {
  idbVersion,
  storeVersion,
  get,
  set,
  // del,
  keys,
  clear
} from '@/lib/lib_idb'
import { deepClone, message, isEmpty } from '@/lib/lib_utils' // 工具

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
    upgrade(db, oldVersion, newVersion, transaction, event) {
      try {
        console.log('upgrade', { db, oldVersion, newVersion, transaction, event })

        const tempStoreVersion = deepClone({}, storeVersion)

        // 已存在的db
        const objectStoreNames = db.objectStoreNames
        const len = objectStoreNames.length
        const defaultStoreInfo = {
          createVersion: '0.0.0',
          isDelete: true
        }

        for (let i = 0; i < len; i++) {
          const storeName = objectStoreNames[i]
          const storeInfo = storeVersion[storeName] ?? defaultStoreInfo

          const { createVersion, isDelete } = storeInfo
          // 是否刪除
          if (isDelete || createVersion > oldVersion) {
            db.deleteObjectStore(storeName)
          }
          delete tempStoreVersion[storeName]
        }

        // 尚未存在的db
        for (const storeName in tempStoreVersion) {
          const storeInfo = storeVersion[storeName] ?? defaultStoreInfo

          const { createVersion, isDelete } = storeInfo
          // 加入版本 > 舊資料庫版本
          if (!isDelete && createVersion > oldVersion) {
            db.createObjectStore(storeName)
          }
        }
      } catch (e) {
        console.log(e)

        message({
          type: 'warning',
          message: `<div class="idb-message">
            <h2>Web IndexedDB Error</h2>
            <div>upgrade</div>
            <div>${e}</div>
          </div>`,
          dangerouslyUseHTMLString: true,
          duration: 2000
        })
      }
    },
    blocked(currentVersion, blockedVersion, event) {
      console.log('blocked', { currentVersion, blockedVersion, event })
    },
    blocking(currentVersion, blockedVersion, event) {
      console.log('blocking', { currentVersion, blockedVersion, event })
    },
    terminated() {
      console.log('terminated')
    }
  })

  _dbPromise.then(idb => {
    console.groupCollapsed('[init] indexedDB: Init')
    console.log('初始化 indexedDB')
    console.log('initDB()')
    console.log({ system, idbVersion })
    console.log(idb)
    console.groupEnd()
  })

  return _dbPromise
}

let dbPromise = initDB()

// iDB版本
async function getIDBVersion(key: string) {
  return await get('iDBVersion', key)
}
async function setIDBVersion(key: string, val: any) {
  return await set('iDBVersion', key, val)
}
// async function delIDBVersion(key: string) {
//   return await del('iDBVersion', key)
// }
// async function clearIDBVersion() {
//   return await clear('iDBVersion')
// }
async function keysIDBVersion() {
  return await keys('iDBVersion')
}

// 確認indexDB是否建立成功
const checkInitIdb = async () => {
  const res = await keysIDBVersion()
  console.groupCollapsed('[init] indexedDB: Check')
  console.log('確認indexDB是否建立成功')
  console.log('checkInitIdb()')
  console.log(res)

  if ([undefined, null].includes(res)) {
    console.log('indexedDB Delete')

    await deleteDB(system)
    dbPromise = initDB()
  }

  console.groupEnd()

  for (const storeName in storeVersion) {
    const store = storeVersion[storeName]
    const { version, createVersion, isDelete } = store

    getIDBVersion(storeName).then(async info => {
      if (
        isEmpty(info) ||
        info.version !== version ||
        info.createVersion !== createVersion ||
        info.isDelete !== isDelete
      ) {
        if (!isDelete) {
          const clearKeys = await keys(storeName)
          if (clearKeys.length > 0) {
            clear(storeName)
          }
        }

        setIDBVersion(storeName, {
          storeName,
          version,
          createVersion,
          isDelete
        })
      }
    })
  }
}

setTimeout(() => {
  checkInitIdb()
}, 0)

export default dbPromise
