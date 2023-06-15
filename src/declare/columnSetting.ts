export interface ColumnItem {
  isShow: boolean
  key: string
  label: string
  isOperations: boolean
}
export interface SettingData {
  version: string
  settingKey: string
  columns: ColumnItem[]
}
