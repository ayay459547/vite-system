import type { AxiosRequestConfig } from 'axios'

export type Api<T> = {
  result?: T,
  data?: T,
  status?: 'success' | 'error' | 'fail',
  msg?: any
}

export type AjaxOptions<T> = {
  getFakeData?: boolean
  delay?: number,
  fakeData?: T | null
  callback?: (config: AxiosRequestConfig, fakeData: T) => any | null
}