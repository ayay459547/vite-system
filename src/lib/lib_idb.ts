import dbPromise from './init/init_idb'
import { isEmpty, swal } from '@/lib/lib_utils' // 工具

/**
 * @see https://github.com/jakearchibald/idb
 * IndexedDB
 */

async function get(table: string, key: string) {
  try {
    return (await dbPromise).get(table, key)
  } catch (e) {
    console.log(e)
    swal({
      icon: 'error',
      title: `indexedDB get ${table}[${key}] error`,
      text: e,
      showCancelButton: false
    })

    return []
  }
}
async function set(table: string, key: string, val: any) {
  const tx = (await dbPromise).transaction(table, 'readwrite')
  const store = tx.objectStore(table)

  const resKey = await store.put(val, key)
  await tx.done

  return resKey
}
async function del(table: string, key: string) {
  return (await dbPromise).delete(table, key)
}
async function clear(table: string) {
  return (await dbPromise).clear(table)
}
async function keys(table: string) {
  try {
    return (await dbPromise).getAllKeys(table)
  } catch (e) {
    console.log(e)
    swal({
      icon: 'error',
      title: `indexedDB ${table} getAllKeys error`,
      text: e,
      showCancelButton: false
    })

    return []
  }
}

/**
 * 有新增或刪除表時 idbVersion + 1
 * Table版本 > DB版本 => 加入新表
 */
export const idbVersion = 3
/**
 * 管理新增加的 store
 * 已存在的 store 不用創建
 *
 * 資料表名稱: {
 *   version 目前版本 版本不同會清空
 *   createVersion 在什麼版本的 idbVersion 加入
 *   isDelete 是否刪除
 * }
 *
 * isDelete變更 需要變更 createVersion + idbVersion
 */
export const storeVersion = {
  iDBVersion: {
    version: '1.0.0',
    createVersion: 1,
    isDelete: false
  },
  columnSetting: {
    version: '1.0.0',
    createVersion: 1,
    isDelete: false
  },
  historyNavigation: {
    version: '1.0.0',
    createVersion: 1,
    isDelete: true
  },
  i18nInfo: {
    version: '1.0.0',
    createVersion: 1,
    isDelete: false
  },
  pageSetting: {
    version: '1.0.0',
    createVersion: 2,
    isDelete: false
  }
}

// 紀錄版本
export const checkInitIdb = () => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const storeList = await keysIDBVersion()

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

        resolve(storeList)
      } catch (e) {
        console.log(e)
        swal({
          icon: 'error',
          title: 'checkInit indexedDB error',
          text: e
        })

        reject([])
      }
    }, 0)
  })
}

// iDB版本
export async function getIDBVersion(key: string) {
  return await get('iDBVersion', key)
}
export async function setIDBVersion(key: string, val: any) {
  return await set('iDBVersion', key, val)
}
export async function delIDBVersion(key: string) {
  return await del('iDBVersion', key)
}
export async function clearIDBVersion() {
  return await clear('iDBVersion')
}
export async function keysIDBVersion() {
  return await keys('iDBVersion')
}

// 表單欄位設定
export async function getColumnSetting(key: string) {
  return await get('columnSetting', key)
}
export async function setColumnSetting(key: string, val: any) {
  return await set('columnSetting', key, val)
}
export async function delColumnSetting(key: string) {
  return await del('columnSetting', key)
}
export async function clearColumnSetting() {
  return await clear('columnSetting')
}
export async function keysColumnSetting() {
  return await keys('columnSetting')
}

// 翻譯檔
export async function getI18nInfo(key: string) {
  return await get('i18nInfo', key)
}
export async function setI18nInfo(key: string, val: any) {
  return await set('i18nInfo', key, val)
}
export async function delI18nInfo(key: string) {
  return await del('i18nInfo', key)
}
export async function clearI18nInfo() {
  return await clear('i18nInfo')
}
export async function keysI18nInfo() {
  return await keys('i18nInfo')
}

// 頁面用的設定資料
// 開發時 個人可依照需求自行調用
export async function getPageSetting(key: string) {
  return await get('pageSetting', key)
}
export async function setPageSetting(key: string, val: any) {
  return await set('pageSetting', key, val)
}
export async function delPageSetting(key: string) {
  return await del('pageSetting', key)
}
export async function clearPageSetting() {
  return await clear('pageSetting')
}
export async function keysPageSetting() {
  return await keys('pageSetting')
}
