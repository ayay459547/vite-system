import dbPromise from './init/init_idb'
import { isEmpty } from '@/lib/lib_utils'

async function get (table: string, key: string) {
  return (await dbPromise).get(table, key)
}
async function set (table: string, key: string, val: any) {
  const tx = (await dbPromise).transaction(table, 'readwrite')
  const store = tx.objectStore(table)

  const resKey = await store.put(val, key)
  await tx.done

  return resKey
}
async function del (table: string, key: string) {
  return (await dbPromise).delete(table, key)
}
async function clear (table: string) {
  return (await dbPromise).clear(table)
}
async function keys (table: string) {
  return (await dbPromise).getAllKeys(table)
}

/**
 * 有新增表時 idbVersion + 1
 * Table版本 > DB版本 => 加入新表
 */
export const idbVersion = 1
/**
 * 管理新增加的 store
 * 已存在的 store 不用創建
 *
 * storeName 資料表名稱
 * newVersion 在什麼版本的 idbVersion 加入
 */
export const storeVersion = [
  {
    storeName: 'iDBVersion',
    newVersion: 1
  },
  {
    storeName: 'columnSetting',
    newVersion: 1
  },
  {
    storeName: 'historyNavigation',
    newVersion: 1
  },
  {
    storeName: 'i18nInfo',
    newVersion: 1
  }
]

// 紀錄版本
export const checkInitIdb = async () => {
  const storeList = await keysIDBVersion()

  storeVersion.forEach(async store => {
    const { storeName, newVersion } = store

    getIDBVersion(storeName).then(info => {
      if (
        isEmpty(info) ||
        info.newVersion !== newVersion
      ) {
        setIDBVersion(storeName, {
          storeName,
          newVersion
        })
      }
    })
  })

  return storeList
}

// iDB版本
export async function getIDBVersion (key: string) {
  return await get('iDBVersion', key)
}
export async function setIDBVersion (key: string, val: any) {
  return await set('iDBVersion', key, val)
}
export async function delIDBVersion (key: string) {
  return await del('iDBVersion', key)
}
export async function clearIDBVersion () {
  return await clear('iDBVersion')
}
export async function keysIDBVersion () {
  return await keys('iDBVersion')
}

// 表單欄位設定
export async function getColumnSetting (key: string) {
  return await get('columnSetting', key)
}
export async function setColumnSetting (key: string, val: any) {
  return await set('columnSetting', key, val)
}
export async function delColumnSetting (key: string) {
  return await del('columnSetting', key)
}
export async function clearColumnSetting () {
  return await clear('columnSetting')
}
export async function keysColumnSetting () {
  return await keys('columnSetting')
}

// 歷史路由
export async function getHistoryNavigation (key: string) {
  return await get('historyNavigation', key)
}
export async function setHistoryNavigation (key: string, val: any) {
  return await set('historyNavigation', key, val)
}
export async function delHistoryNavigation (key: string) {
  return await del('historyNavigation', key)
}
export async function clearHistoryNavigation () {
  return await clear('historyNavigation')
}
export async function keysHistoryNavigation () {
  return await keys('historyNavigation')
}

// 翻譯檔
export async function getI18nInfo (key: string) {
  return await get('i18nInfo', key)
}
export async function setI18nInfo (key: string, val: any) {
  return await set('i18nInfo', key, val)
}
export async function delI18nInfo (key: string) {
  return await del('i18nInfo', key)
}
export async function clearI18nInfo () {
  return await clear('i18nInfo')
}
export async function keysI18nInfo () {
  return await keys('i18nInfo')
}
