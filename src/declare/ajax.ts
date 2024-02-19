import type { AxiosRequestConfig } from 'axios'
import type { Sort, SortingList, SortingMap } from '@/components'

type ApiCommon<T> = {
  result?: T
  data?: T
  status?: 'success' | 'error' | 'fail' | boolean
  msg?: any
  errorMsg?: any
}
export type Api<T, O = {}> = ApiCommon<T> & Partial<O>

export type AjaxOptions<T> = {
  isFakeData?: boolean
  fakeData?: T | null
  isLog?: boolean
  delay?: number
  callback?: (config: AxiosRequestConfig, fakeData: T) => any | null
}

export declare interface TableParams {
  page?: number
  size?: number
  sort?: Sort
  sortingList?: SortingList
  sortingMap?: SortingMap
}
