export interface ColumnItem {
  isShow: boolean
  key: string
  label: string
  isOperations: boolean
  width?: number | null
  minWidth?: number | null
}
export interface SettingData {
  version: string
  settingKey: string
  columns: ColumnItem[]
}
