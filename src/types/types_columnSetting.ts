import type { ComponentPublicInstance, Ref } from 'vue'

import type { CustomTableTypes, CustomTableProps } from '@/components/table'
import type { CustomInputExpose } from '@/components/input'
import type { ScopeKey } from '@/types/types_i18n'
import type { ValidateType } from '@/lib/lib_validate'

import type { ModalSelectProps } from '@/components/input'

// 選項
export interface Option<T = (string | number | null | undefined)> extends Record<string, any> {
  label: string // 預設文字
  i18nLabel?: string // 翻譯文字
  value: T // 值
  disabled?: boolean // 是否可選擇
  data?: any // 其他資料
  [key: string]: any // 其他
}
export type Options<T = (string | number | null | undefined)> = Array<Option<T>>

// 欄位屬性
export interface ColumnItem {
  __key__?: string // 系統用

  // 通用
  key?: string // key
  prop?: string // table key
  slotKey?: string // slot 名稱
  title?: string // 顯示文字(滑鼠)
  label: string // 顯示文字
  i18nLabel?: string // 顯示文字(翻譯)
  isOperations?: boolean // 是否為操作用特殊欄位

  // table
  width?: number // 寬度
  minWidth?: number // 最小寬度
  resizable?: boolean // 是否可變更表格大小
  align?:  string | 'left' | 'center' | 'right' // 對齊
  fixed?: string | 'left' | 'right' // 定住
  isShow?: boolean // 是否顯示

  isSorting?: boolean // 是否排序
  order?: string | 'ascending' | 'descending' | 'none' // 排序方式
  orderIndex?: number // 排序順位 越小越前面
  columns?: Array<ColumnItem> // 子欄位

  // form
  ref?: (el: InputRefItem) => InputRefItem
  default?: any // 預設值
  validate?: ValidateType[] | ValidateType // 驗證
  required?: boolean // 是否必填
  isCondition?: boolean // 是否為特殊查詢
  clearable?: boolean // 使否顯示清除按鈕
  options?: Options // 選項

  // TimeLineTable
  timeLineType?: string | 'group' | 'date' | 'none' | null | undefined // 類型(決定在左/右/下)
  timeIndex?: number // 欄位顯示順序
  isTimeLineDate?: boolean // 是否是日期欄位
  isTimeLineDateActive?: boolean // 是否正在使用的日期欄位(只有一個)

  // ModalSelect
  modalSelect?: ModalSelectProps

  [key: string]: any // 其他
}

// 輸入框
export interface InputRefItem extends Element, ComponentPublicInstance {
  key: CustomInputExpose['key']
  value: CustomInputExpose['value']
  resetValidate: CustomInputExpose['resetValidate']
  validate: CustomInputExpose['validate']
  getDom: CustomInputExpose['getDom']
  focus: CustomInputExpose['focus']
  blur: CustomInputExpose['blur']
}

// useFormSetting
export interface FormOptions {
  version?: string // 版本 indexedDB
  settingKey?: string // 搜尋用的key
  i18nModule?: ScopeKey // 翻譯模組
  [key: string]: any // 其他
}
export type Conditions = Array<{
  conditionType?: string // 篩選類型, ex: >=, isNull, isBlank......
  filterValue?: string // 篩選值

  columnId?: string
  condition?: string
  value?: any
}>
interface ModelForm<T> {
  forms: T
  activeForms: Record<string, boolean>
  activeConditions: Record<string, boolean>
  conditions: Record<string, Conditions>
}
export interface FormSetting<T> extends ModelForm<T> {
  refMap: Record<string, any>
  defaultValue: T
  columns: Record<string, any>
  resetForms: (defaultValue?: Partial<T> | any) => void
  resetValidate: () => void
  reset: (defaultValue?: Partial<T> | any) => void
  getActiveForms: (isShowEmpty: boolean) => Partial<T>
  validate: () => Promise<Array<any>>
  getConditionFilter: () => Conditions
  setConditionFilter: (key: string, newConditions: Conditions) => void
  updateIDB: () => void | Promise<any> // 取消功能 記錄使用者過濾條件
}
// indexedDB
export interface FormIDBSetting<T> extends ModelForm<T> {
  version: string
  settingKey: string
}

// useFormListSetting
export interface FormListOptions {
  title?: string
  i18nTitle?: string
  version?: string
  settingKey?: string
  i18nModule?: ScopeKey // 翻譯模組
  [key: string]: any
}
export interface FormListSetting<T> {
  refMap: Record<string, any>
  defaultValue: T
  columns: Record<string, any>
  forms: Ref<Array<T>>
  reset: () => void
  validate: () => Promise<Array<any>>
  add: (value?: any) => any
  remove: (rowIndex: number) => any
  clear: () => void
}

// useTableSetting
export interface TableRef extends Element, ComponentPublicInstance {
  [key: string]: any
}
export interface TableOptions {
  title?: CustomTableProps['title'] // 表格名稱(預設)
  i18nTitle?: CustomTableProps['i18nTitle'] // 表格名稱(翻譯)
  version?: CustomTableProps['version'] // 設定idb 版本
  settingKey?: CustomTableProps['settingKey'] // 設定idb key
  page?: CustomTableProps['page'] // 分頁
  size?: CustomTableProps['pageSize'] // 顯示資料數
  sort?: CustomTableProps['sort'] // 單欄位排序(棄用), 使用多欄位排序
  rowKey?: CustomTableProps['rowKey'] // 每筆資料唯一值
  isSorting?: CustomTableProps['isSorting'] // 是否可多欄位排序
  isHiddenExcel?: CustomTableProps['isHiddenExcel'] // 是否隱藏下載excel按鈕
  isHiddenColumnSetting?: CustomTableProps['isHiddenColumnSetting'] // 是否隱藏欄位設定按鈕
  tableSize?: CustomTableProps['tableSize'] // 表格大小
  showType?: CustomTableProps['showType'] // 資料顯示類型
  selection?: CustomTableProps['selection'] // 是否顯示 checkbox
  selectable?: CustomTableProps['selectable'] // checkbox 是否可選擇
  lazy?: CustomTableProps['lazy'] // 是否使用懶加載(無分頁)
  load?: CustomTableProps['load'] // 懶加載
  treeProps?: CustomTableProps['treeProps']
  i18nModule?: CustomTableProps['i18nModule'] // 翻譯模組
  [key: string]: any
}
export interface TableSetting {
  tableRef: Ref<TableRef>
  tableSetting: {
    ref: ((el: TableRef) => TableRef) | any
    title: string
    i18nTitle?: string
    version: string
    settingKey: string
    params: CustomTableTypes['tableParams']
    page?: number
    pageSize?: number
    // element ui 排序 (單一欄位的)
    sortable?: boolean | 'custom'
    // 暫時不用 先保留功能
    sort?: CustomTableProps['sort']
    // 多欄位用的 isSorting (爆改版)
    isSorting?: boolean
    tableColumns: any[]
    tableSize?: CustomTableProps['tableSize']
    isHiddenExcel?: boolean
    isHiddenColumnSetting?: boolean
    i18nModule?: ScopeKey
    // 其他 table 的 props
    [key: string]: any
  }
  downloadExcel: (tableData: Record<string, any>[]) => void
  resetScroll: (tableRef?: TableRef | any) => void
  toggleSelection: (rows: any[], tableRef?: TableRef) => void
  getSelectionRows: () => any[]
  getParams: (tableRef?: TableRef | any) => CustomTableTypes['tableParams'] | null
  setParams: (params: CustomTableTypes['tableParams'], tableRef?: TableRef) => void
  changePage: (page?: number, pageSize?: number, tableRef?: TableRef) => void
  spanInfo: {
    leftProps: Array<string>
    topPropSubTableInfoMap: Record<string, any>
    basePropSubTableInfoMap: Record<string, any>
    subTableTree: any
    getSubTableData: (rowData: any, prop: string) => Record<string, Array<any>>
    getSubColumns:  (prop: string) => Array<string>
    getSubDisplayData: (rowData: any, subRowDat: any, subProp: any) => string
    spanMethod: (any: any) => [number, number] | void
  }
  getDisplayData: (rowData: any, prop: string) => any
}
// indexedDB
export interface TableIDBSetting {
  version: string
  settingKey: string
  columns: Array<ColumnItem>
}

// useSimpleTableSetting
export interface SimpleTableSetting {
  title: string
  tableColumns: any[]
  downloadExcel: (tableData: Record<string, any>[]) => void
}
