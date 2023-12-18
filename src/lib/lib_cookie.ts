import Cookies from 'js-cookie'

export const setCookie = (key: string, value: string, options?: Partial<Cookies.CookieAttributes>) => {
  const _options = {
    // expires: (new Date(Date.now() + 8 * 60 * 60 * 1000))
    path: '',
    expires: 1
  }
  Cookies.set(key, value, {
    ..._options,
    ...options
  })
}

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

export const removeCookie = (key: string) => {
  Cookies.remove(key)
}