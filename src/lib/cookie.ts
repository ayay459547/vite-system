import Cookies from 'js-cookie'

export const setCookie = (key: string, value: string) => {
  const options = {
    expires: (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  }
  Cookies.set(key, value, options)
}

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

export const removeCookie = (key: string) => {
  Cookies.remove(key)
}