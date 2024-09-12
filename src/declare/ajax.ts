import type { AxiosRequestConfig } from 'axios'

import type { CustomTableTypes } from '@/components'
// import type { SweetAlertIcon } from 'sweetalert2'

export type ApiStatus = 'success' | 'error' | 'fail'

type ApiCommon<T> = {
  result?: T
  data?: T
  size?: number
  status?: ApiStatus | boolean
  msg?: any
  errorMsg?: any
}
export type Api<T, O = {}> = ApiCommon<T> & Partial<O>

export type AjaxOptions<T> = {
  isFakeData?: boolean
  fakeData?: T | null
  size?: number
  isLog?: boolean
  delay?: number
  callback?: (config: AxiosRequestConfig, fakeData: T) => any | null
}

export type ApiRes<T = any> = {
  status: ApiStatus
  data?: T
  size?: number
  msg?: string
}

export type TableParams = CustomTableTypes.TableParams

export declare interface ViewParams extends TableParams {
  webfuno?: string
  funoviewsuffix?: string
  designatedview?: string
}
