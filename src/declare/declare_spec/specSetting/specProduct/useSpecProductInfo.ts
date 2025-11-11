import { inject } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
// import { webViewFormat, formatDatetime } from '@/lib/lib_format' // 格式化
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { Params, ResponseData, ExcelData, TableData } from '@/types/types_spec/specSetting/specProduct'

import {
  formatParams as commonFormatParams,
  formatExcel as commonFormatExcel,
  formatTable as commonFormatTable
} from '../specSettingInfo'

export const useSpecProductInfo = (options: {
  i18nModule?: ScopeKey
}) => {
  const { i18nModule = defaultModuleType } = options

  const useHook = inject('useHook') as UseHook
  const {
    i18nTranslate, i18nTest, redirectInfo,
    swal, permission, eventList
  } = useHook({ i18nModule })

  // api 格式
  const formatParams = (params: any): Params => {
    const { productId = '' } = params
    return {
      ...commonFormatParams(params),
      productId
    }
  }

  // 顯示資料格式化
  const formatExcel = (row: ResponseData): ExcelData => {
    const { productId, specId } = row
    return {
      ...commonFormatExcel(row),
      productId,
      rowId: `${productId}-${specId}`
    }
  }
  const formatTable = (row: ResponseData): TableData => {
    const { productId, specId } = row
    return {
      ...commonFormatTable(row),
      productId,
      rowId: `${productId}-${specId}`
    }
  }

  return {
    i18nTranslate, i18nTest, redirectInfo,
    swal, permission, eventList,
    formatParams, formatExcel, formatTable
  }
}
