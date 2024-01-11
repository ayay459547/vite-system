import Cookies from 'js-cookie'

import { getUuid, aesEncrypt, aesDecrypt } from '@/lib/lib_utils'

const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY

export const setCookie = (key: string, value: string, options?: Partial<Cookies.CookieAttributes>) => {
  const _options = { expires: 1 }

  Cookies.set(key, value, {
    ..._options,
    ...options
  })
}

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

export const removeCookie = (key: string, options?: Partial<Cookies.CookieAttributes>) => {
  Cookies.remove(key, options)
}

export interface Token {
	uid: string
	date: Date
	userId: number
}

export const getToken = (): Token | null => {
  const _token = getCookie('token')
  if (['', null, undefined].includes(_token)) return null

  const temp = aesDecrypt(_token, privateKey)
  // if (['', null, undefined].includes(temp)) return null

  // const userData = JSON.parse(temp)

  const userData = {
    uid: '',
    date: new Date(),
    userId: Number.parseInt(temp)
  }
  return userData
}

export const setToken = (userId: number) => {
  // const temp = {
  //   uuid: `${getUuid()}`,
  //   date: new Date(),
  //   userId
  // }
  // const _token = JSON.stringify(temp)
  const _token = userId

  // 設定 30 分鐘
  const minutes = 30
  const time = new Date(new Date().getTime() + minutes * 60 * 1000)

  setCookie(
    'token',
    aesEncrypt(_token, privateKey),
    { expires: time }
  )
}

export const clearToken = () => {
  removeCookie('token')
}

/**
 * 更新token(登入)狀態
 * 更新時機：換路由、送api
 */
export const updateToken = () => {
  const token = getToken()

  if (token !== null) {
    const { userId = -1 } = token
    setToken(userId)
  }
}
