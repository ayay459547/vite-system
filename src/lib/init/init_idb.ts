import { openDB, deleteDB } from 'idb'
import checkSystemVersionDiff from './checkSystemVersion'
import {
  idbVersion,
  storeVersion,
  get,
  set,
  del,
  keys,
  clear
} from '@/lib/lib_idb'
import { deepClone, message, isEmpty, hasOwnProperty } from '@/lib/lib_utils' // 工具

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
  try {
    const _dbPromise = openDB(system, idbVersion, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        console.log('upgrade', { db, oldVersion, newVersion, transaction, event })

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

let dbPromise = initDB()

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
  return await keys('iDBVersion')
}

// 確認indexDB是否建立成功
const checkInitIdb = async () => {
  const storeNameList = await keysIDBVersion()
  console.groupCollapsed('[init] indexedDB: Check')
  console.log('確認indexDB是否建立成功')
  console.log('checkInitIdb()')
  console.log(storeNameList)

  if ([undefined, null].includes(storeNameList)) {
    console.log('indexedDB Delete')

    await deleteDB(system)
    dbPromise = initDB()
  }

  console.groupEnd()

  // 系統版本/名稱 變更 清除資料
  if (isChange) {
    clearIDBVersion()
  }

  // 設定當前版本
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

  // 移除不存在的 store
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
