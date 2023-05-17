import { openDB } from 'idb'

const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE

const dbPromise = openDB(system, 1, {
  upgrade (db) {
    db.createObjectStore('columnSetting')
  }
})

export default dbPromise