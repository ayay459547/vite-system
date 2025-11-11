export type SettingMode = string[]

export type BlockTypes = Record<string, number>

export type BlockTypesSortSeq = Record<string, {
  typeItemIndex: number
  label: string
  i18nLabel: string
  sortSeq: number // 前端顯示順序
}>

export type SupportedSortingSetting = {
  scheduleBlockType: number
  sortingType: {
    ASC?: string
    DESC?: string
  }
  blockSortingType: Record<string, number>
}
export type SupportedSortingSettings = Array<SupportedSortingSetting>
