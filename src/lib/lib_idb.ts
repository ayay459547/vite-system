/**
 * 使用瀏覽器 Web IndexedDB
 * @see https://github.com/jakearchibald/idb
 * @see https://www.npmjs.com/package/idb
 */

import { message } from '@/lib/lib_utils' // 工具
import dbPromise from './init/init_idb'

const getMessage = (e: any, action: string, table: string, key: string = '') => {
  return `<div class="idb-message">
    <h2>Web IndexedDB Error</h2>
    <div>${action} ${table} ${key}</div>
    <div>${e}</div>
  </div>`
}

/**
 * @async indexedDB 取資料
 * @param table 資料表名稱
 * @param key 搜尋key
 */
export async function get(table: string, key: string) {
  try {
    return (await (dbPromise as any)).get(table, key)

  } catch (e: any) {
    console.trace('💾', e)
    message({
      type: 'warning',
      message: getMessage(e, 'get', table, key),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return undefined
  }
}

/**
 * @async indexedDB 設定資料
 * @param table 資料表名稱
 * @param key 設定key
 * @param val 設定值
 */
export async function set(table: string, key: string, val: any) {
  try {
    const tx = (await (dbPromise as any)).transaction(table, 'readwrite')
    const store = tx.objectStore(table)

    const resKey = await store.put(val, key)
    await tx.done

    return resKey

  } catch (e: any) {
    console.trace('💾', e)
    message({
      type: 'warning',
      message: getMessage(e, 'set', table, key),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return key
  }
}

/**
 * @async indexedDB 刪除資料
 * @param table 資料表名稱
 * @param key 刪除key
 */
export async function del(table: string, key: string) {
  try {
    return (await (dbPromise as any)).delete(table, key)

  } catch (e: any) {
    console.trace('💾', e)
    message({
      type: 'warning',
      message: getMessage(e, 'delete', table, key),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return undefined
  }
}

/**
 * @async indexedDB 清除資料表
 * @param table 資料表名稱
 */
export async function clear(table: string) {
  try {
    return (await (dbPromise as any)).clear(table)

  } catch (e: any) {
    console.trace('💾', e)
    message({
      type: 'warning',
      message: getMessage(e, 'clear', table),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return undefined
  }
}

/**
 * @async indexedDB 取得資料表所有的key
 * @param table 資料表名稱
 */
export async function keys(table: string) {
  try {
    return (await (dbPromise as any)).getAllKeys(table)

  } catch (e: any) {
    console.trace('💾', e)
    message({
      type: 'warning',
      message: getMessage(e, 'getAllKeys', table),
      dangerouslyUseHTMLString: true,
      duration: 2000
    })

    return []
  }
}

// 表單欄位設定
export async function getColumnSetting(key: string): Promise<any> {
  return await get('columnSetting', key)
}
export async function setColumnSetting(key: string, val: any): Promise<any> {
  return await set('columnSetting', key, val)
}
export async function delColumnSetting(key: string): Promise<any> {
  return await del('columnSetting', key)
}
export async function clearColumnSetting(): Promise<any> {
  return await clear('columnSetting')
}
export async function keysColumnSetting(): Promise<any> {
  return await keys('columnSetting')
}

// 篩選設定
export async function getFilterSetting(key: string): Promise<any> {
  return await get('filterSetting', key)
}
export async function setFilterSetting(key: string, val: any): Promise<any> {
  return await set('filterSetting', key, val)
}
export async function delFilterSetting(key: string): Promise<any> {
  return await del('filterSetting', key)
}
export async function clearFilterSetting(): Promise<any> {
  return await clear('filterSetting')
}
export async function keysFilterSetting(): Promise<any> {
  return await keys('filterSetting')
}

// 頁面用的設定資料
// 開發時 個人可依照需求自行調用
export async function getPageSetting(key: string): Promise<any> {
  return await get('pageSetting', key)
}
export async function setPageSetting(key: string, val: any): Promise<any> {
  return await set('pageSetting', key, val)
}
export async function delPageSetting(key: string): Promise<any> {
  return await del('pageSetting', key)
}
export async function clearPageSetting(): Promise<any> {
  return await clear('pageSetting')
}
export async function keysPageSetting(): Promise<any> {
  return await keys('pageSetting')
}

// 甘特圖設定
export async function getGanttSetting(key: string): Promise<any> {
  return await get('ganttSetting', key)
}
export async function setGanttSetting(key: string, val: any): Promise<any> {
  return await set('ganttSetting', key, val)
}
export async function delGanttSetting(key: string): Promise<any> {
  return await del('ganttSetting', key)
}
export async function clearGanttSetting(): Promise<any> {
  return await clear('ganttSetting')
}
export async function keysGanttSetting(): Promise<any> {
  return await keys('ganttSetting')
}


// 資料組選項
const dataOptionsVersion = '1.0.1'
export type DataOption = {
  key: string // 選項的鍵值
  name: string // 自訂名稱
  date?: string // 建立日期
  value: any
}
export type DB_DataOptions = {
  dbKey?: string // IndexDB DataOptions
  version?: string
  options: Array<DataOption>
  autoSave?: boolean
  defaultOptionKey: string | null // 預設選項的鍵值
}

export async function getDataOptions(key: string): Promise<DB_DataOptions> {
  const val = await get('dataOptions', key)
  if(!val) return null
  const { dbKey, version, defaultOptionKey = null, options = [], autoSave = false } = val
  const _options  =  options.map(option => JSON.parse(option))
  const _val = { dbKey, version, defaultOptionKey, options: _options, autoSave }
  return _val
}
export async function setDataOptions(key: string, val: DB_DataOptions): Promise<any> {
  const dbKey = key
  const version = dataOptionsVersion
  const { defaultOptionKey = null, options = [], autoSave = false } = val
  const _options  =  options.map(option => JSON.stringify(option))
  const _val = { dbKey, version, defaultOptionKey, options: _options, autoSave }

  return await set('dataOptions', key, _val)
}
export async function delDataOptions(key: string): Promise<any> {
  return await del('dataOptions', key)
}
export async function clearDataOptions(): Promise<any> {
  return await clear('dataOptions')
}
export async function keysDataOptions(): Promise<any> {
  return await keys('dataOptions')
}
