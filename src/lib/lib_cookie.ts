import Cookies from 'js-cookie'
import { getUuid, aesEncrypt, aesDecrypt } from '@/lib/lib_utils'
import debounce from '@/lib/lib_debounce'

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
  if (['', null, undefined].includes(temp)) return null

  const userData = JSON.parse(temp)
  return userData
}

export const setToken = (userId: number) => {
  const temp = {
    uuid: `${getUuid()}`,
    date: new Date(),
    userId
  }
  const _token = JSON.stringify(temp)

  // 設定 30 分鐘
  setCookie(
    'token',
    aesEncrypt(_token, privateKey),
    { expires: 30 / 24 * 60 * 60 }
  )
}

export const clearToken = () => {
  removeCookie('token')
}

export const updateToken = () => {
  const token = getToken()

  if (token !== null) {
    const { userId } = token
    setToken(userId)
  }else {
    clearToken()
  }
}
