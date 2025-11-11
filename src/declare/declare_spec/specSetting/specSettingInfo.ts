import { formatDatetime } from '@/lib/lib_format' // 格式化

import type { Params, ResponseData, ExcelData, TableData } from '@/types/types_spec/specSetting'

export const formatParams = (params: any): Params => {
  const {
    specId = '',
    specName = '',
    specContent = '',
    specTypeId = '',
    LAST_UPDATE_TIMESTAMP = ''
  } = params

  return {
    specId,
    specName,
    specContent,
    specTypeId,
    LAST_UPDATE_TIMESTAMP
  }
}

// 顯示資料格式化
const formatData = (row: ResponseData): ExcelData | TableData => {
  const { specId, specName, specContent, specTypeId, LAST_UPDATE_TIMESTAMP } = row
  return {
    ...row,
    specId,
    specName,
    specContent,
    specTypeId,
    LAST_UPDATE_TIMESTAMP: formatDatetime(LAST_UPDATE_TIMESTAMP, 'YYYY-MM-DD HH:mm:ss')
  }
}
export const formatExcel = (row: ResponseData): ExcelData => formatData(row)
export const formatTable = (row: ResponseData): TableData => formatData(row)
