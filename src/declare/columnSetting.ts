export interface ColumnItem {
  isShow: boolean
  key: string
  label: string
  i18nLabel?: string
  isOperations: boolean
  width?: number | null
  minWidth?: number | null
}

export interface SettingData {
  version: string
  settingKey: string
  columns: ColumnItem[]
}
