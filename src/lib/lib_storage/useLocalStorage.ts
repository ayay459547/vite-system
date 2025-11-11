import { ref, computed } from 'vue'
import { getStorageKey } from './storageHookUtils'

/**
 * @description 設定 LocalStorage 資料
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * @param {String} key 鍵值
 */
export const useLocalStorage = (key: string) => {
  const localStorageKey = getStorageKey(key)
  const setLocalStorage = (value: string) => {
    localStorage.setItem(localStorageKey, value)
  }
  const getLocalStorage = (): string | null => {
    return localStorage.getItem(localStorageKey)
  }

  const __localStorageValue__ = ref<string | null>(null)
  // 資料異動時 自動更新 LocalStorage
  const localStorageValue = computed({
    get: () => __localStorageValue__.value,
    set: (v: string) => {
      __localStorageValue__.value = v
      setLocalStorage(v)
    }
  })
  // 初始化 設定 LocalStorage
  __localStorageValue__.value = getLocalStorage()

  return {
    localStorageKey,
    localStorageValue,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage: () => {
      localStorage.removeItem(localStorageKey)
    }
  }
}

/**
 * @description 設定 LocalStorage 資料
 * @param {String} key 鍵值
 * @param {String} value 資料
 */
export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(
    getStorageKey(key),
    value
  )
}

/**
 * @description 取得 LocalStorage 資料
 * @param {String} key 鍵值
 * @returns {String | null}
 */
export const getLocalStorage = (key: string): string | null => {
  return localStorage.getItem(
    getStorageKey(key)
  )
}

/**
 * @description 刪除 LocalStorage 資料
 * @param {String} key 鍵值
 */
export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(
    getStorageKey(key)
  )
}

/**
 * @description 清除全部 LocalStorage
 */
export const clearLocalStorage = () => {
  localStorage.clear()
}
