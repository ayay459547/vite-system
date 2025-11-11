import { ref, computed } from 'vue'
import { getStorageKey } from './storageHookUtils'

/**
 * @description 設定 SessionStorage 資料
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage
 * @param {String} key 鍵值
 */
export const useSessionStorage = (key: string) => {
  const sessionStorageKey = getStorageKey(key)
  const setSessionStorage = (value: string) => {
    sessionStorage.setItem(sessionStorageKey, value)
  }
  const getSessionStorage = (): string | null => {
    return sessionStorage.getItem(sessionStorageKey)
  }

  const __sessionStorageValue__ = ref<string | null>(null)
  // 資料異動時 自動更新 SessionStorage
  const sessionStorageValue = computed({
    get: () => __sessionStorageValue__.value,
    set: (v: string) => {
      __sessionStorageValue__.value = v
      setSessionStorage(v)
    }
  })
  // 初始化 設定 SessionStorage
  __sessionStorageValue__.value = getSessionStorage()

  return {
    sessionStorageKey,
    sessionStorageValue,
    setSessionStorage,
    getSessionStorage,
    removeSessionStorage: () => {
      sessionStorage.removeItem(sessionStorageKey)
    }
  }
}

/**
 * @description 設定 SessionStorage 資料
 * @param {String} key 鍵值
 * @param {String} value 資料
 */
export const setSessionStorage = (key: string, value: string) => {
  sessionStorage.setItem(
    getStorageKey(key),
    value
  )
}

/**
 * @description 取得 SessionStorage 資料
 * @param {String} key 鍵值
 * @returns {String | null}
 */
export const getSessionStorage = (key: string): string | null => {
  return sessionStorage.getItem(
    getStorageKey(key)
  )
}

/**
 * @description 刪除 SessionStorage 資料
 * @param {String} key 鍵值
 */
export const removeSessionStorage = (key: string) => {
  sessionStorage.removeItem(
    getStorageKey(key)
  )
}

/**
 * @description 清除全部 SessionStorage
 */
export const clearSessionStorage = () => {
  sessionStorage.clear()
}
