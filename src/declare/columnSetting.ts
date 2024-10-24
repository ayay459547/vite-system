import type { ComponentPublicInstance, Ref } from 'vue'
import type {
  TempCustomInputExpose,
  CustomTableTypes,
  CustomTableProps
} from '@/components' // 系統組件
import type { ScopeKey } from '@/i18n/i18n_setting'
import type { ValidateType } from '@/lib/lib_validate'

export interface InputRefItem extends Element, ComponentPublicInstance, TempCustomInputExpose {}

export interface FormColumnsItem {
  ref?: (el: InputRefItem) => void
  key?: string
  validateKey?: string
  clearable?: boolean
  default?: any
  validate?: ValidateType[] | ValidateType
  required?: boolean
  resizable?: boolean
  showOverflowTooltip?: boolean
  label?: string
}

export interface ColumnTypeSetting<T, K extends string> {
  [key: string]: {
    [keyType in K | 'label']: T | string
  }
}

export interface FormSetting<T> {
  refMap: Record<string, any>
  defaultValue: T
  columns: Record<string, any>
  forms: T
  activeForms: Record<string, boolean>
  activeConditions: Record<string, boolean>
  conditions: Record<string, Conditions>
  resetForms: (defaultValue?: Partial<T> | any) => void
  reset: (defaultValue?: Partial<T> | any) => void
  getActiveForms: (isShowEmpty: boolean) => Partial<T>
  validate: () => Promise<Array<any>>
  handleReset: () => void
  getConditionFilter: () => Conditions
}

export interface FormListSetting<T> {
  refMap: Record<string, any>
  defaultValue: T
  columns: Record<string, any>
  forms: Ref<Array<T>>
  reset: () => void
  validate: () => Promise<Array<any>>
  add: (value?: any) => void
  remove: (rowIndex: number) => void
  clear: () => void
}

export interface ColumnItem {
  key?: string
  prop?: string
  slotKey?: string
  title?: string
  // 顯示文字
  label: string
  i18nLabel?: string
  // 寬度
  width?: number | null
  minWidth?: number | null
  // 對齊
  align?: 'left' | 'center' | 'right'
  // 定住
  fixed?: 'left' | 'right'
  // 是否顯示
  isShow?: boolean
  // 是否為操作用特殊欄位
  isOperations?: boolean
  // 是否排序
  isSorting?: boolean
  // 排序方式
  order?: string | 'ascending' | 'descending' | 'none'
  // 排序順位 越小越前面
  orderIndex?: number
  // 是否為特殊查詢
  isCondition?: boolean

  // TimeLineTable
  timeLineType?: 'group' | 'date' | 'none' | null | undefined
  timeIndex?: number
  isTimeLineDate?: boolean // 是否是日期欄位
  isTimeLineDateActive?: boolean // 是否正在使用的日期欄位(只有一個)
}

export interface Condition {
  conditionType: string
  filterValue: string
}
export type Conditions = Array<Condition>


export interface TableRef extends Element, ComponentPublicInstance {
  [key: string]: any
}

export interface TableOptions {
  title: CustomTableProps.Title
  i18nTitle?: CustomTableProps.I18nTitle
  version: CustomTableProps.Version
  settingKey: CustomTableProps.SettingKey
  page?: CustomTableProps.Page
  size?: CustomTableProps.PageSize
  sort?: CustomTableProps.Sort
  rowKey?: CustomTableProps.RowKey
  isSorting?: CustomTableProps.IsSorting // 是否可多欄位排序
  isHiddenExcel?: CustomTableProps.IsHiddenExcel // 是否隱藏下載excel按鈕
  isHiddenColumnSetting?: CustomTableProps.IsHiddenColumnSetting // 是否隱藏欄位設定按鈕
  tableSize?: CustomTableProps.TableSize
  showType?: CustomTableProps.ShowType
  selection?: CustomTableProps.Selection
  lazy?: CustomTableProps.Lazy
  load?: CustomTableProps.Load // 懶加載
  treeProps?: CustomTableProps.TreeProps
  i18nModule?: CustomTableProps.I18nModule // 翻譯模組
  [key: string]: any
}

export interface TableSetting {
  tableRef: Ref<TableRef>
  tableSetting: {
    ref: (el: TableRef) => void
    title: string
    i18nTitle?: string
    version: string
    settingKey: string
    params: CustomTableTypes.TableParams
    page?: number
    pageSize?: number
    // 單一欄位的 sortable (原版)
    // 暫時不用 先保留功能
    sort?: CustomTableProps.Sort
    // 多欄位用的 isSorting (爆改版)
    isSorting?: boolean
    tableColumns: any[]
    tableSize?: CustomTableProps.TableSize
    isHiddenExcel?: boolean
    isHiddenColumnSetting?: boolean
    i18nModule?: ScopeKey
    // 其他 table 的 props
    [key: string]: any
  }
  downloadExcel: (tableData: Record<string, any>[]) => void
  resetScroll: (tableRef?: TableRef) => void
  toggleSelection: (rows: any[], tableRef?: TableRef) => void
  getSelectionRows: () => any[]
  getParams: (tableRef?: TableRef) => CustomTableTypes.TableParams | null
  setParams: (params: CustomTableTypes.TableParams, tableRef?: TableRef) => void
  changePage: (page?: number, pageSize?: number, tableRef?: TableRef) => void
}

export interface TableColumnsItem extends ColumnItem {
  // element ui 排序
  sortable?: boolean | 'custom'
  [key: string]: any
}

export interface SettingData {
  version: string
  settingKey: string
  columns: Array<ColumnItem>
}

export interface SimpleTableSetting {
  title: string
  tableColumns: any[]
  downloadExcel: (tableData: Record<string, any>[]) => void
}

export interface SimpleTableColumnsItem {
  key: string
  prop: string
  slotKey: string
  width?: number
  minWidth?: number
  label: string
  i18nLabel?: string
  title: string
  [key: string]: any
}

export interface Option<T = (string | number | null | undefined)> extends Record<string, any> {
  label: string
  i18nLabel?: string
  value: T
  disabled?: boolean
  data?: any
  [key: string]: any
}

export type Options<T = (string | number | null | undefined)> = Array<Option<T>>
