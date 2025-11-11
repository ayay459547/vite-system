/**
 * 使用瀏覽器 Web IndexedDB
 * @see https://github.com/jakearchibald/idb
 * @see https://www.npmjs.com/package/idb
 */

import { openDB, deleteDB } from 'idb'

import checkSystemVersionDiff from './checkSystemVersion'
import { get, set, del, keys, clear } from '@/lib/lib_idb'
import { deepClone, message, isEmpty, hasOwnProperty, webReload } from '@/lib/lib_utils' // 工具

/**
 * 有新增或刪除表時 idbVersion + 1
 */
const idbVersion = 7
/**
 * 管理 store
 * 版本記錄在 iDBVersion
 *
 * 資料表名稱: {
 *   version 目前版本 版本不同會清空
 * }
 */
const storeVersion: Record<string, any> = {
  iDBVersion: { version: '1.0.0' },
  columnSetting: { version: '1.0.1' },
  filterSetting: { version: '1.0.0' },
  pageSetting: { version: '1.0.0' },
  ganttSetting: { version: '1.0.0' },
  dataOptions: { version: '1.0.2' }
}

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
    await deleteDB(system).then(() => {
      console.log('💾 delete indexedDB success')
    }).catch(e => {
      console.log('💾 delete indexedDB error', e)
    })
  }
  try {
    const _dbPromise = openDB(system, idbVersion, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        console.log('💾 upgrade', { db, oldVersion, newVersion, transaction, event })

        const tempStoreVersion = deepClone({}, storeVersion)

        // 瀏覽器中的db
        const objectStoreNames = db.objectStoreNames
        const len = objectStoreNames.length

        for (let i = 0; i < len; i++) {
          const storeName = objectStoreNames[i]

          // 刪除db
          if (!hasOwnProperty(storeVersion, storeName)) {
            db.deleteObjectStore(storeName)
          }
          delete tempStoreVersion[storeName]
        }

        // 尚未存在的db
        for (const storeName in tempStoreVersion) {
          db.createObjectStore(storeName)
        }
      },
      blocked(currentVersion, blockedVersion, event) {
        console.log('💾 blocked', { currentVersion, blockedVersion, event })
      },
      blocking(currentVersion, blockedVersion, event) {
        console.log('💾 blocking', { currentVersion, blockedVersion, event })
      },
      terminated() {
        console.log('💾 terminated')
      }
    })

    _dbPromise.then(idb => {
      console.groupCollapsed('💾 init indexedDB success')
      console.log({ system, idbVersion })
      console.log(idb)
      console.groupEnd()
    }).catch(e => {
      console.log('💾 init indexedDB error', e)
    })

    return _dbPromise

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
}

let dbPromise: any = initDB()

// iDB版本
async function getIDBVersion(key: string) {
  return await get('iDBVersion', key)
}
async function setIDBVersion(key: string, val: any) {
  return await set('iDBVersion', key, val)
}
async function delIDBVersion(key: string) {
  return await del('iDBVersion', key)
}
async function clearIDBVersion() {
  return await clear('iDBVersion')
}
async function keysIDBVersion() {
  try {
    return (await (dbPromise as any)).getAllKeys('iDBVersion')
  } catch (e: any) {
    console.log('💾', e)
  }
}

/**
 * 1. 確認indexDB是否建立成功
 * 2. 系統版本/名稱 變更 清除資料
 * 3. 設定當前版本, 如果 store 版本不同, 清除資料
 * 4. 移除不存在的 store
 */
const checkInitIdb = async () => {
  const storeNameList = await keysIDBVersion()
  /**
   * idbVersion 高版本 => 低版本 會出現此情況
   * 如果原本 是新版本網頁 => 降回舊版本網頁
   * indexedDB 不允許 idbVersion 往下降版
   */

  // 1. 確認indexDB是否建立成功
  if (storeNameList === null || storeNameList === undefined) {
    // 重新建立idb
    await deleteDB(system).then(() => {
      console.log('💾 delete indexedDB success')
    }).catch(e => {
      console.log('💾 delete indexedDB error', e)
    })
    dbPromise = initDB()
    webReload()
  }

  // 2. 系統版本/名稱 變更 清除資料
  if (isChange) {
    clearIDBVersion()
  }

  // 3. 設定當前版本, 如果 store 版本不同, 清除資料
  for (const storeName in storeVersion) {
    const store = storeVersion[storeName]
    const { version } = store

    getIDBVersion(storeName).then(async info => {
      if (isEmpty(info) || info.version !== version) {
        const clearKeys = await keys(storeName)
        if (clearKeys.length > 0) {
          clear(storeName)
        }

        setIDBVersion(storeName, { storeName, version })
      }
    })
  }

  // 4. 移除不存在的 store
  for (const i in storeNameList) {
    const storeKey = storeNameList[i]
    const storeName = `${storeKey}`

    if (!hasOwnProperty(storeVersion, storeName)) {
      delIDBVersion(storeName)
      continue
    }
  }
}

setTimeout(() => {
  checkInitIdb()
}, 0)

export default dbPromise
