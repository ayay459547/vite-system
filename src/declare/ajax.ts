import type { AxiosRequestConfig } from 'axios'
import type { Sort, SortingList, SortingMap } from '@/components'
import type { SweetAlertIcon } from 'sweetalert2'

export type ApiStatus = 'success' | 'error' | 'fail' | boolean

type ApiCommon<T> = {
  result?: T
  data?: T
  size?: number
  status?: ApiStatus
  msg?: any
  errorMsg?: any
}
export type Api<T, O = {}> = ApiCommon<T> & Partial<O>

export type ApiResponse = {
  icon: SweetAlertIcon
  status: ApiStatus
  title?: string
  msg?: any
  errorMsg?: any
}

export type AjaxOptions<T> = {
  isFakeData?: boolean
  fakeData?: T | null
  size?: number
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

export declare interface ViewParams extends TableParams {
  webfuno?: string
  funoviewsuffix?: string
  designatedview?: string
}
