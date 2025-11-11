/**
 * 系統設定 Storage Key 前綴統一
 * 使用範圍: Cookie, SessionStorage, LocalStorage
 */
const storageKeyPrefix = (import.meta as any).env.VITE_API_STORAGE_KEY_PREFIX

export const getStorageKey = (key: string) => {
 return `${storageKeyPrefix}__${key}`
}
