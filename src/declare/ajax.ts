import type { AxiosRequestConfig } from 'axios'

type ApiCommon<T> = {
  result?: T
  data?: T
  status?: 'success' | 'error' | 'fail' | boolean
  msg?: any
}
export type Api<T, O = {}> = ApiCommon<T> & Partial<O>

export type AjaxOptions<T> = {
  getFakeData?: boolean
  fakeData?: T | null
  showLog?: boolean
  delay?: number
  callback?: (config: AxiosRequestConfig, fakeData: T) => any | null
}