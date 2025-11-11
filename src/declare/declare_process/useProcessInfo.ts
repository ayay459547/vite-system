import { inject } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import { webViewFormat, formatDatetime } from '@/lib/lib_format' // 格式化
import type { UseHook } from '@/types/types_hook' // 全域功能類型

import type { Params, ResponseData, ExcelData, TableData } from '@/types/types_process'

export const useProcessInfo = (options: {
  i18nModule?: ScopeKey
}) => {
  const { i18nModule = defaultModuleType } = options

  const useHook = inject('useHook') as UseHook
  const { i18nTranslate, i18nTest, redirectInfo } = useHook({ i18nModule })

  // api 格式
  const formatParams = (params: any): Params => {
    const {
      processId = '',
      processName = '',
      processGroup = '',
      processNote = '',
      lastUpdateDate
    } = params

    return {
      processId,
      processName,
      processGroup,
      processNote,
      ...webViewFormat.dateTimeRange('lastUpdateDate', lastUpdateDate)
    }
  }

  // 顯示資料格式化
  const formatData = (row: ResponseData): ExcelData | TableData => {
    const { processId, lastUpdateDate } = row

    return {
      ...row,
      rowId: `${processId}`,
      lastUpdateDate: formatDatetime(lastUpdateDate, 'YYYY-MM-DD HH:mm:ss')
    }
  }
  const formatExcel = (row: ResponseData): ExcelData => formatData(row)
  const formatTable = (row: ResponseData): TableData => formatData(row)

  return {
    i18nTranslate, i18nTest, redirectInfo,
    formatParams, formatData, formatExcel, formatTable
  }
}
