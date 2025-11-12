export { useFormSetting } from './useFormSetting'
export { useFormListSetting } from './useFormListSetting'
export { useTableSetting } from './useTableSetting'
export { useSimpleTableSetting } from './useSimpleTableSetting'

export type DisplayData = {
  data: any
  rowData?: any
  subRowData?: any
  i18nTranslate: ((...args: any[]) => any)
}
