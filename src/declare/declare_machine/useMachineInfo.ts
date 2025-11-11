import { inject } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import { webViewFormat, formatDatetime } from '@/lib/lib_format' // 格式化
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { Params, ResponseData, ExcelData, TableData } from '@/types/types_machine'

export const useMachineInfo = (options: {
  i18nModule?: ScopeKey
}) => {
  const { i18nModule = defaultModuleType } = options

  const useHook = inject('useHook') as UseHook
  const { i18nTranslate, i18nTest, redirectInfo } = useHook({ i18nModule })

  // api 格式
  const formatParams = (params: any): Params => {
    const {
      machineId = '',
      areaNo = '',
      machineName = '',
      areaName = '',
      machineNote = '',
      hasWorkingTime = null,
      horizontal_LAST_UPDATE_TIMESTAMP
    } = params

    return {
      machineId,
      machineName,
      areaNo,
      areaName,
      machineNote,
      hasWorkingTime,
      ...webViewFormat.dateTimeRange('horizontal_LAST_UPDATE_TIMESTAMP', horizontal_LAST_UPDATE_TIMESTAMP)
    }
  }

  // 顯示資料格式化
  const formatData = (row: ResponseData): ExcelData | TableData => {
    const { machineId, horizontal_LAST_UPDATE_TIMESTAMP } = row

    return {
      ...row,
      rowId: `${machineId}`,
      horizontal_LAST_UPDATE_TIMESTAMP: formatDatetime(horizontal_LAST_UPDATE_TIMESTAMP, 'YYYY-MM-DD hh:mm:ss')
    }
  }
  const formatExcel = (row: ResponseData): ExcelData => {
    const _hasWorkingTime = `${row.hasWorkingTime}` === '1' ? i18nTranslate('select-true') : i18nTranslate('select-false')

    return {
      ...formatData(row),
      hasWorkingTime: _hasWorkingTime
    }
  }
  const formatTable = (row: ResponseData): TableData => {
    return formatData(row)
  }

  return {
    i18nTranslate, i18nTest, redirectInfo,
    formatParams, formatData, formatExcel, formatTable
  }
}
