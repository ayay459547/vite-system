import Cookies from 'js-cookie'

import { aesEncrypt, aesDecrypt } from '@/lib/lib_utils'

const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY

/**
 * @see https://github.com/js-cookie/js-cookie
 * @description 設定 cookie
 * @param {String} key 鍵值
 * @param {String} value 值
 * @param {Partial<Cookies.CookieAttributes>} options 設定
 */
export const setCookie = (
  key: string,
  value: string,
  options?: Partial<Cookies.CookieAttributes>
) => {
  const _options = { expires: 1 }

  Cookies.set(key, value, {
    ..._options,
    ...options
  })
}

/**
 * @see https://github.com/js-cookie/js-cookie
 * @description 取得 cookie
 * @param {String} key 鍵值
 * @returns {String | undefined}
 */
export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

/**
 * @see https://github.com/js-cookie/js-cookie
 * @description 移除 cookie
 * @param {String} key 鍵值
 */
export const removeCookie = (key: string, options?: Partial<Cookies.CookieAttributes>) => {
  Cookies.remove(key, options)
}

export interface Token {
  uid: string
  date: Date
  userId: number
}

/**
 * 取得登入資訊
 * @param {String} loginTime YYYY-MM-DD_HH:mm:ss
 * @returns 使用者資訊
 */
export const getToken = (loginTime?: string): Token | null => {
  try {
    const _token = getCookie('token')
    if (['', null, undefined].includes(_token)) {
      throw `getToken _token = "${_token}"`
    }

    const temp = aesDecrypt(_token, `${privateKey}__${loginTime}`)
    const userId = Number.parseInt(temp)
    if (Number.isNaN(userId)) {
      throw `isNaN data = "${temp}"`
    }

    const userData = {
      uid: '',
      date: new Date(),
      userId
    }
    return userData
  } catch (e) {
    console.log(e)
    return null
  }
}

/**
 * 設定登入資訊
 * @param {Number} userId 使用者ID
 * @param {String} loginTime YYYY-MM-DD_HH:mm:ss
 */
export const setToken = (userId: number, loginTime: string) => {
  try {
    if (['', null, undefined].includes(loginTime)) {
      throw `setToken loginTime = "${loginTime}"`
    }

    const _token = `${userId}`
    const minutes = 20 // 設定 20 分鐘
    const time = new Date(new Date().getTime() + minutes * 60 * 1000)

    setCookie('token', aesEncrypt(_token, `${privateKey}__${loginTime}`), {
      expires: time
    })
  } catch (e) {
    console.log(e)
  }
}

export const clearToken = () => {
  removeCookie('token')
}

let queue: any = null
const _updateToken = () => {
  const loginTime = getCookie('loginTime')
  const token = getToken(loginTime)

  const { userId = -1 } = token ?? {}

  if (!Number.isNaN(userId) && userId > 0) {
    setToken(userId, loginTime)
  }
}
/**
 * 更新token(登入)狀態
 * 更新時機：換路由、送api
 * @param {String} type 使用者ID
 */
export const updateToken = (type?: string) => {
  if (queue === null) {
    queue = []
    _updateToken()
  }
  queue.push(type ?? 'updateToken')

  setTimeout(() => {
    if (queue.length > 0) {
      queue.splice(0)

      _updateToken()
    }
  }, 60 * 1000)
}
