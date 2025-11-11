import type { AxiosRequestConfig } from 'axios'

import type { CustomTableTypes } from '@/components/table' // 系統組件: 表格
// import type { SweetAlertIcon } from 'sweetalert2'

export type ApiStatus = 'success' | 'error'

type ApiCommon<T = any> = {
  data: T // 資料
  size: number // 資料數
  status: ApiStatus // 狀態
  msg?: any // 訊息
  i18nMsg?: any // 訊息(可用i18n翻譯)
}
export type Api<T = any, O = {}> = ApiCommon<T> & Partial<O>

export type AjaxOptions<T = any> = {
  isFakeData?: boolean | any // 是否使用假資料
  fakeData?: T | null | any // 假資料
  fakeDataPath?: string // 假資料路徑
  size?: number | any // 資料數
  status?: 'success' | 'error' // 狀態
  isLog?: boolean | any // 是否打印api資訊
  delay?: number | any // 回傳假資料的時間
  callback?: ((fakeData: T, config: AxiosRequestConfig) => any | null) | any // 自訂回傳假資料
  [key: string]: any // 其他
}

export type ApiRes<T = any> = Partial<ApiCommon<T>>

export type TableParams = CustomTableTypes['tableParams']

// 配合後端 SQL View 所需格式
export declare interface ViewParams extends TableParams {
  webfuno?: string
  funoviewsuffix?: string
  designatedview?: string
}
