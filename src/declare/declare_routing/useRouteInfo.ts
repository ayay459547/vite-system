import { inject } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import { webViewFormat, formatDatetime } from '@/lib/lib_format' // 格式化
import type { UseHook } from '@/types/types_hook' // 全域功能類型

import type { Params, ResponseData, ExcelData, TableData } from '@/types/types_routing'

export const useRouteInfo = (options: {
  i18nModule?: ScopeKey
}) => {
  const { i18nModule = defaultModuleType } = options

  const useHook = inject('useHook') as UseHook
  const { i18nTranslate, i18nTest, redirectInfo } = useHook({ i18nModule })

  // api 格式
  const formatParams = (params: any): Params => {
    const {
      routeId = '',
      orderIndex,
      processId = '',
      routePhaseIndx = '',
      routePhase = '',
      LAST_UPDATE_TIMESTAMP
    } = params

    return {
      routeId,
      ...webViewFormat.operator('orderIndex', orderIndex),
      processId,
      routePhaseIndx,
      routePhase,
      ...webViewFormat.dateTimeRange('LAST_UPDATE_TIMESTAMP', LAST_UPDATE_TIMESTAMP)
    }
  }

  // 顯示資料格式化
  const formatData = (row: ResponseData): ExcelData | TableData => {
    const { routeId, orderIndex, LAST_UPDATE_TIMESTAMP } = row

    return {
      ...row,
      rowId: `${routeId}-${orderIndex}`,
      LAST_UPDATE_TIMESTAMP: formatDatetime(LAST_UPDATE_TIMESTAMP, 'YYYY-MM-DD HH:mm:ss')
      // routePhase: i18nTranslate(columnSetting.routePhase.getI18nValue(routePhase))
    }
  }
  const formatExcel = (row: ResponseData): ExcelData => formatData(row)
  const formatTable = (row: ResponseData): TableData => formatData(row)

  return {
    i18nTranslate, i18nTest, redirectInfo,
    formatParams, formatData, formatExcel, formatTable
  }
}
