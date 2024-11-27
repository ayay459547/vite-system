import dbPromise from './init/init_idb'
import { message } from '@/lib/lib_utils' // 工具

/**
 * @see https://github.com/jakearchibald/idb
 * Web IndexedDB
 */

const getMessage = (e: string, action: string, table: string, key: string = '') => {
  return `<div class="idb-message">
    <h2>Web IndexedDB Error</h2>
    <div>${action} ${table} ${key}</div>
    <div>${e}</div>
  </div>`
}

export async function get(table: string, key: string) {
  try {
    return (await dbPromise).get(table, key)

  } catch (e) {
    console.trace(e)
    message({
      type: 'warning',
      message: getMessage(e, 'get', table, key),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return undefined
  }
}
export async function set(table: string, key: string, val: any) {
  try {
    const tx = (await dbPromise).transaction(table, 'readwrite')
    const store = tx.objectStore(table)

    const resKey = await store.put(val, key)
    await tx.done

    return resKey

  } catch (e) {
    console.trace(e)
    message({
      type: 'warning',
      message: getMessage(e, 'set', table, key),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return key
  }
}
export async function del(table: string, key: string) {
  try {
    return (await dbPromise).delete(table, key)

  } catch (e) {
    console.trace(e)
    message({
      type: 'warning',
      message: getMessage(e, 'delete', table, key),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return undefined
  }
}
export async function clear(table: string) {
  try {
    return (await dbPromise).clear(table)

  } catch (e) {
    console.trace(e)
    message({
      type: 'warning',
      message: getMessage(e, 'clear', table),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return undefined
  }
}
export async function keys(table: string) {
  try {
    return (await dbPromise).getAllKeys(table)

  } catch (e) {
    console.trace(e)
    message({
      type: 'warning',
      message: getMessage(e, 'getAllKeys', table),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return []
  }
}

/**
 * 有新增或刪除表時 idbVersion + 1
 */
export const idbVersion = 6
/**
 * 管理 store
 * 版本記錄在 iDBVersion
 *
 * 資料表名稱: {
 *   version 目前版本 版本不同會清空
 * }
 */
export const storeVersion = {
  iDBVersion: { version: '1.0.0' },
  columnSetting: { version: '1.0.0' },
  filterSetting: { version: '1.0.0' },
  pageSetting: { version: '1.0.0' },
  ganttSetting: { version: '1.0.0' }
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

// 篩選設定
export async function getFilterSetting(key: string) {
  return await get('filterSetting', key)
}
export async function setFilterSetting(key: string, val: any) {
  return await set('filterSetting', key, val)
}
export async function delFilterSetting(key: string) {
  return await del('filterSetting', key)
}
export async function clearFilterSetting() {
  return await clear('filterSetting')
}
export async function keysFilterSetting() {
  return await keys('filterSetting')
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

// 甘特圖設定
export async function getGanttSetting(key: string) {
  return await get('ganttSetting', key)
}
export async function setGanttSetting(key: string, val: any) {
  return await set('ganttSetting', key, val)
}
export async function delGanttSetting(key: string) {
  return await del('ganttSetting', key)
}
export async function clearGanttSetting() {
  return await clear('ganttSetting')
}
export async function keysGanttSetting() {
  return await keys('ganttSetting')
}