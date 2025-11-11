import { ref, computed } from 'vue'
import Cookies from 'js-cookie'

import { getStorageKey } from './storageHookUtils'

/**
 * @see https://github.com/js-cookie/js-cookie
 * @description 設定 Cookie
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Cookie
 * @param {String} key 鍵值
 */
export const useCookie = (key: string) => {
  const cookieKey = getStorageKey(key)
  const setCookie = (value: string, options: Partial<Cookies.CookieAttributes> = {}) => {
    Cookies.set(cookieKey, value, {
      expires: 1,
      ...options
    })
  }
  const getCookie = (): string | null => {
    return Cookies.get(cookieKey)
  }
  const removeCookie = (options?: Partial<Cookies.CookieAttributes>) => {
    Cookies.remove(cookieKey, options)
  }

  const __cookieValue__ = ref<string | null>(null)
  // 資料異動時 自動更新 Cookie
  const cookieValue = computed({
    get: () => __cookieValue__.value,
    set: (v: string) => {
      __cookieValue__.value = v
      setCookie(v)
    }
  })
  // 初始化 設定 Cookie
  __cookieValue__.value = getCookie()

  return {
    cookieKey,
    cookieValue,
    setCookie,
    getCookie,
    removeCookie
  }
}

/**
 * @description 設定 Cookie
 * @param {String} key 鍵值
 * @param {String} value 值
 * @param {Partial<Cookies.CookieAttributes>} options 設定
 */
export const setCookie = (
  key: string,
  value: string,
  options: Partial<Cookies.CookieAttributes> = {}
) => {
  Cookies.set(
    getStorageKey(key),
    value,
    { expires: 1, ...options }
  )
}

/**
 * @description 取得 cookie
 * @param {String} key 鍵值
 * @returns {String | undefined}
 */
export const getCookie = (key: string): string | undefined => {
  return Cookies.get(
    getStorageKey(key)
  )
}

/**
 * @description 移除 cookie
 * @param {String} key 鍵值
 */
export const removeCookie = (key: string, options?: Partial<Cookies.CookieAttributes>) => {
  Cookies.remove(
    getStorageKey(key),
    options
  )
}
