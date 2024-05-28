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
}

export interface SettingData {
  version: string
  settingKey: string
  columns: Array<ColumnItem>
}

export interface Option extends Record<string, any> {
  label: string
  value: string | number | null
  i18nLabel?: string
  disabled?: boolean
  data?: any
}

export type Options = Array<Option>
