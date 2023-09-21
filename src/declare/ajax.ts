import type { AxiosRequestConfig } from 'axios'

type ApiCommon<T> = {
  result?: T
  data?: T
  status?: 'success' | 'error' | 'fail'
  msg?: any
}
export type Api<T, O = {}> = ApiCommon<T> & O

export type AjaxOptions<T> = {
  getFakeData?: boolean
  delay?: number
  fakeData?: T | null
  callback?: (config: AxiosRequestConfig, fakeData: T) => any | null
}