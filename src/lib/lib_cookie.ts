import Cookies from 'js-cookie'

import { aesEncrypt, aesDecrypt } from '@/lib/lib_utils' // 工具
// import { formatDatetime } from '@/lib/lib_format'

const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY
const tokenTime = (import.meta as any).env.VITE_API_TOKEN_TIME

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
  options: Partial<Cookies.CookieAttributes> = {}
) => {
  Cookies.set(key, value, {
    expires: 1,
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
    const token = getCookie('token')
    if (['', null, undefined].includes(token)) {
      // throw `getToken token = '${token}'`
      return null
    }

    const _userId = aesDecrypt(token, `${privateKey}__${loginTime}`)
    const userId = Number.parseInt(_userId)
    if (Number.isNaN(userId)) {
      throw `userId = '${_userId}'`
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
      // throw `setToken loginTime = '${loginTime}'`
      return
    }

    const token = aesEncrypt(`${userId}`, `${privateKey}__${loginTime}`)

    const minutes = Number.parseInt(tokenTime)

    // 保存時間 (分鐘)
    const expiresTime = new Date(new Date().getTime() + minutes * 60 * 1000)

    // 保存時間: 測試(秒)
    // const expiresTime = new Date(new Date().getTime() + minutes * 1000)

    // console.log('minutes => ', {
    //   minutes,
    //   expiresTime,
    //   formatExires: formatDatetime(expiresTime, 'HH:mm:ss')
    // })

    setCookie('token', token, {
      expires: expiresTime
    })
  } catch (e) {
    console.log(e)
  }
}

export const clearToken = () => {
  removeCookie('token')
}

/**
 * 更新token(登入)狀態
 * 更新時機：換路由、送api
 * @param {String} type 使用者ID
 */
let queue: any = null
let updateTokenTimer: NodeJS.Timeout | number | undefined = null
const _updateToken = () => {
  queue.splice(0)

  clearInterval(updateTokenTimer)
  updateTokenTimer = null

  // 更新token
  const loginTime = getCookie('loginTime')
  const token = getToken(loginTime)

  const { userId = -1 } = token ?? {}
  if (!Number.isNaN(userId) && userId > 0) {
    setToken(userId, loginTime)
  }
}
export const updateToken = (type?: string) => {
  if (queue === null) {
    queue = []
    _updateToken()
  }
  queue.push(type ?? 'updateToken')

  if (updateTokenTimer === null) {
    // 一分鐘更新一次
    updateTokenTimer = setInterval(() => {
      if (queue.length > 0) {
        _updateToken()
      }
    }, 60 * 1000)
  }
}
