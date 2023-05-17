import dbPromise from './init/init_idb'

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