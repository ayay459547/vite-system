import Cookies from 'js-cookie'

import {
  // getUuid,
  aesEncrypt,
  aesDecrypt
} from '@/lib/lib_utils'

const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY

/**
 * @description 設定 cookie
 * @param key 鍵值
 * @param value 值
 * @param options 設定
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
 * @description 取得 cookie
 * @param key 鍵值
 * @returns {String | undefined}
 */
export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

/**
 * @description 移除 cookie
 * @param key 鍵值
 */
export const removeCookie = (key: string, options?: Partial<Cookies.CookieAttributes>) => {
  Cookies.remove(key, options)
}

export interface Token {
  uid: string
  date: Date
  userId: number
}

export const getToken = (loginTime?: string): Token | null => {
  const _token = getCookie('token')
  if (['', null, undefined].includes(_token)) return null

  const temp = aesDecrypt(_token, `${privateKey}:${loginTime ?? '0000-00-00_00:00:00'}`)
  // if (['', null, undefined].includes(temp)) return null

  // const userData = JSON.parse(temp)

  const userData = {
    uid: '',
    date: new Date(),
    userId: Number.parseInt(temp)
  }
  return userData
}

export const setToken = (userId: number, loginTime?: string) => {
  // const temp = {
  //   uuid: `${getUuid()}`,
  //   date: new Date(),
  //   userId
  // }
  // const _token = JSON.stringify(temp)
  const _token = `${userId}`

  // 設定 60 分鐘
  const minutes = 60
  const time = new Date(new Date().getTime() + minutes * 60 * 1000)

  setCookie('token', aesEncrypt(_token, `${privateKey}:${loginTime ?? '0000-00-00_00:00:00'}`), {
    expires: time
  })
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
