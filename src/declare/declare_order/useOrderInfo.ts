import { inject } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import { webViewFormat } from '@/lib/lib_format' // 格式化
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { formatDatetime } from '@/lib/lib_format' // 格式化
import type { Params, ResponseData, ExcelData, TableData } from '@/types/types_order'

import { columnSetting } from './columns'

export const useOrderInfo = (options: {
  i18nModule?: ScopeKey
}) => {
  const { i18nModule = defaultModuleType } = options

  const useHook = inject('useHook') as UseHook
  const {
    i18nTranslate, i18nTest,
    redirectInfo, swal, permission
  } = useHook({ i18nModule })

  // api 格式
  const formatParams = (params: any): Params => {
    const {
      id = '',
      custDeviceNo = '',
      bomId = '',
      bomRevision = '',
      classCode = '',
      custName = '',
      customerId = '',
      productGroupId = '',
      status = '',

      acquiredDate,
      createDate,
      lastUpdateTimestamp,
      numPriority = null
    } = params

    return {
      id,
      custDeviceNo,
      bomId,
      bomRevision,
      classCode,
      custName,
      customerId,
      productGroupId,
      status,
      ...webViewFormat.dateTimeRange('acquiredDate', acquiredDate),
      ...webViewFormat.dateTimeRange('create-date', createDate),
      ...webViewFormat.dateTimeRange('lastUpdateTimestamp', lastUpdateTimestamp, {
        startPrefix: 'isStartDateTime_',
        endPrefix: 'isEndDateTime_'
      }),
      ...webViewFormat.operator('numPriority', numPriority)
    }
  }

  // 顯示資料格式化
const formatData = (data: ResponseData): ExcelData | TableData => {
  const {
    id,
    custDeviceNo,
    bomId,
    bomRevision,
    classCode,
    custName,
    customerId,
    productGroupId,
    status,
    acquiredDate,
    createDate,
    lastUpdateTimestamp,
    numPriority
  } = data

  return {
    rowId: `${id}`,
    id,
    custDeviceNo,
    bomId,
    bomRevision,
    classCode: columnSetting.classCode.getValue(classCode),
    custName,
    customerId,
    productGroupId,
    status,
    acquiredDate: formatDatetime(acquiredDate, 'YYYY-MM-DD HH:mm:ss'),
    createDate: formatDatetime(createDate, 'YYYY-MM-DD HH:mm:ss'),
    lastUpdateTimestamp: formatDatetime(lastUpdateTimestamp, 'YYYY-MM-DD HH:mm:ss'),
    numPriority
  }
}
const formatExcel = (row: ResponseData): ExcelData => formatData(row)
const formatTable = (row: ResponseData): TableData => formatData(row)

  return {
    i18nTranslate, i18nTest,
    redirectInfo, swal, permission,
    formatParams, formatExcel, formatTable
  }
}
