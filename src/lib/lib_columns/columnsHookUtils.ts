import type {
  // ColumnItem, // 欄位屬性
  InputRefItem // 輸入框
} from '@/types/types_columnSetting'

import { systemLog, tipLog, getUuid, isEmpty } from '@/lib/lib_utils' // 工具
import { object_forEach } from '@/lib/lib_object'


/**
 * @author Caleb
 * @description 取得單一欄位所需資料
 * @param {Object} column 欄位資料
 * @param {Object} options 選項
 *                 type: 類型 ex: table, form, filter
 *                 key
 * @param {Object} refMap 設定輸入框的ref (call by reference)
 * @returns {Object}
 */
export const getColumnData = (
  column: Record<string, any>,
  options: { type: string, key: string },
  refMap: Record<string, any>
): Record<string, any> => {
  const { type, key } = options

  let _column: any = {}
  for (const attrKey in column) {
    // 取得所有非物件類型的屬性
    const attrValue = column[attrKey]
    if (typeof attrValue !== 'object') {
      _column[attrKey] = column[attrKey]
    }
  }
  // 設定 指定類型下的所有屬性
  _column = {
    ..._column,
    ...(column[type] ?? {})
  }

  // 子欄位
  const _columns: any[] = []
  if (!isEmpty(_column?.children)) {
    object_forEach(_column?.children, (subClumn: Record<string, any>, subKey: string) => {
      _columns.push(getColumnData(
        { ...subClumn, __parentKey__: key },
        { type, key: subKey },
        refMap
      ))
    })
  }

  // 是否為操作用欄位 ex: 編輯/刪除
  const _isOperations = _column?.isOperations ?? false

  // 確保不要重複
  const _checkDomSet = new Set()
  return {
    __key__: key,

    // 通用
    ref: (el: InputRefItem) => {
      if (
        el &&
        !_checkDomSet.has(el) &&
        typeof el?.getDom === 'function' // CustomInput
      ) {
        const validateKey = getUuid()
        refMap[validateKey] = el
        _checkDomSet.add(el)
      }
      return el
    },
    key: key,
    label: _column?.label,
    i18nLabel: _column?.i18nLabel,
    i18nModule: _column?.i18nModule,

    // CustomTable
    prop: _column?.prop ?? key,
    slotKey: _column?.slotKey ?? key,
    resizable: _column?.resizable ?? true,
    isOperations: _isOperations,
    isShow: _column?.isShow ?? true,
    columns: _columns,

    // element ui 單排用
    sortable: !_isOperations ? (_column?.sortable ?? false) : false,
    // 專案用 多排
    isSorting: !_isOperations ? (_column?.isSorting ?? true) : false, // 是否顯示排序
    order: _column?.order ?? 'none', // ascending | descending | none
    orderIndex: _column?.orderIndex ?? -1,

    /**
     * 由於 HTML 內建 title 會 tooltip 文字
     * 所以移除此屬性
     * VxeTable > VxeColumn 新增label參數
     */
    // title: _column?.label ?? '',

    // CustomInput
    type: _column?.type ?? 'text', // 輸入框類型
    default: _column?.default ?? null, // 預設值
    isValidate: _column?.isValidate ?? true, // 是否需要驗證
    required: _column?.required ?? false, // 是否必填
    clearable: _column?.clearable ?? true, // 是否可清除
    validate: _column?.validate ?? [], // 驗證類型 lib_validate

    // CustomSearch
    isCondition: _column?.isCondition ?? false, // 進階搜尋

    // 其他
    ..._column
  }
}

// 確認是否有資料
export const checkColumns = (resColumns: any, columns: any, type: string) => {
  if (isEmpty(resColumns)) {
    systemLog(columns, 'table')
    tipLog('無欄位資料', ['檢查 columns.ts 中的 欄位的 key', `傳入 type 值 => ${type}`])
  }
}
