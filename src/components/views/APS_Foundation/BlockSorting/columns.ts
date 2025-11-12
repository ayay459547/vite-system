import { blockSortingTypes, checkInOptions } from '@/declare/declare_logicRestriction/scheduleBlock'
import type { Options } from '@/components' // 系統組件

export const defaultSortingByOptions: Options<number> = blockSortingTypes.filter(item => {
  return item.value < 999
})

export const defaultorderOptions: Options<string> = [
  { i18nLabel: 'asc-SmallToLarge', label: '遞增 (小→大)', value: 'ASC' },
  { i18nLabel: 'desc-LargeToSmall', label: '遞減 (大→小)', value: 'DESC' },
  { i18nLabel: 'crossAscDesc', label: '遞增遞減交錯 (小大交叉)', value: 'ASC_DESC_CROSS' },
  { i18nLabel: 'crossDescAsc', label: '遞減遞增交錯 (大小交叉)', value: 'DESC_ASC_CROSS' },
  { i18nLabel: 'descOneMaxMultMin', label: '大批量併多張小批量 (多小1大)', value: 'DESC_ONE_MAX_MULT_MIN' }
]

export const getSortingByCallback = (typeItemIndex: number | string) => {
  const blockSortingType = Number.parseInt(`${typeItemIndex}`)

  switch (blockSortingType) {
    case 1: // 開工區排程排序設定: fund-1426, fund-1441
      return ((optionTypeItemIndex: number) => optionTypeItemIndex === 995)
    case 2: // 插單區排程排序設定: fund-1426, fund-1441
      return ((optionTypeItemIndex: number) => optionTypeItemIndex === 996)
    case 3: // 鎖定區排程排序設定: fund-1426
      return ((optionTypeItemIndex: number) => optionTypeItemIndex === 997)
    case 4: // 預排區排程排序設定: fund-1426, fund-1441
      return ((optionTypeItemIndex: number) => optionTypeItemIndex <= 15)
    case 5: // 一般併批排程設定: fund-1429
      return ((optionTypeItemIndex: number) => optionTypeItemIndex <= 15)
    case 6: // PN併批排程設定: fund-1429
      return ((optionTypeItemIndex: number) => optionTypeItemIndex <= 15)
    case 7: // 緊急貨批工單區排程排序設定(super hot run): fund-1426
      return ((optionTypeItemIndex: number) => optionTypeItemIndex <= 15)
    default:
      return ((optionTypeItemIndex: number) => optionTypeItemIndex <= 999)
  }
}

export const getOrderingTypeOptions = (blockTypeItemIndex: number, typeItemIndex: number | string, isHiddenDescOneMaxMultMin?: boolean) => {
  const blockSortingType = Number.parseInt(`${typeItemIndex}`)

  // 遠近
  if ([2, 3, 15].includes(blockSortingType)) return [
    { i18nLabel: 'asc-NearToFar', label: '遞增 (近→遠)', value: 'ASC' },
    { i18nLabel: 'desc-FarToNear', label: '遞減 (遠→近)', value: 'DESC' }
  ]

  // 是否
  if ([8, 12].includes(blockSortingType)) return [
    { i18nLabel: 'asc-FalseToTrue', label: '遞增 (否→是)', value: 'ASC' },
    { i18nLabel: 'desc-TrueToFalse', label: '遞減 (是→否)', value: 'DESC' }
  ]

  if (typeof isHiddenDescOneMaxMultMin === 'boolean' && isHiddenDescOneMaxMultMin) {
    return [
      { i18nLabel: 'asc-SmallToLarge', label: '遞增 (小→大)', value: 'ASC' },
      { i18nLabel: 'desc-LargeToSmall', label: '遞減 (大→小)', value: 'DESC' },
      { i18nLabel: 'crossAscDesc', llabel: '遞增遞減交錯 (小大交叉)', value: 'ASC_DESC_CROSS' },
      { i18nLabel: 'crossDescAsc', label: '遞減遞增交錯 (大小交叉)', value: 'DESC_ASC_CROSS' }
    ]
  }

  // 大小
  switch(blockTypeItemIndex) {
    case 5: {
      return [
        { i18nLabel: 'asc-SmallToLarge', label: '遞增 (小→大)', value: 'ASC' },
        { i18nLabel: 'desc-LargeToSmall', label: '遞減 (大→小)', value: 'DESC' },
        { i18nLabel: 'crossAscDesc', llabel: '遞增遞減交錯 (小大交叉)', value: 'ASC_DESC_CROSS' },
        { i18nLabel: 'crossDescAsc', label: '遞減遞增交錯 (大小交叉)', value: 'DESC_ASC_CROSS' },
        { i18nLabel: 'descOneMaxMultMin', label: '大批量併多張小批量 (多小1大)', value: 'DESC_ONE_MAX_MULT_MIN' }
      ]
    }
    case 6: {
      return [
        { i18nLabel: 'asc-SmallToLarge', label: '遞增 (小→大)', value: 'ASC' },
        { i18nLabel: 'desc-LargeToSmall', label: '遞減 (大→小)', value: 'DESC' },
        { i18nLabel: 'crossAscDesc', llabel: '遞增遞減交錯 (小大交叉)', value: 'ASC_DESC_CROSS' },
        { i18nLabel: 'crossDescAsc', label: '遞減遞增交錯 (大小交叉)', value: 'DESC_ASC_CROSS' }
      ]
    }
    default: {
      return [
        { i18nLabel: 'asc-SmallToLarge', label: '遞增(小→大)', value: 'ASC' },
        { i18nLabel: 'desc-LargeToSmall', label: '遞減(大→小)', value: 'DESC' }
      ]
    }
  }
}

export const columnSetting = {
  label: '預排區排程排序設定',
  i18nLabel: 'sequence-reserve-schedule-set',
  sortingBy: {
    label: '排程優先區',
    i18nLabel: 'sequence-sortingType',
    i18nModule: 'fund_common',
    table: {
      minWidth: 150,
      required: true,
      sortable: false
    },
    form: {
      type: 'select',
      default: '',
      required: true,
      hiddenLabel: true,
      options: defaultSortingByOptions
    }
  },
  checkIn: {
    form: {
      label: '',
      type: 'select',
      i18nModule: 'fund_common',
      default: 3,
      required: true,
      hiddenLabel: true,
      clearable: false,
      options: checkInOptions
    }
  },
  order: {
    label: '排序方式',
    i18nLabel: 'sequence-order',
    i18nModule: 'fund_common',
    table: {
      minWidth: 150,
      required: true,
      sortable: false
    },
    form: {
      type: 'select',
      default: 'ASC',
      required: true,
      hiddenLabel: true,
      options: [
        { i18nLabel: 'asc', label: '遞增 (小→大)', value: 'ASC' },
        { i18nLabel: 'desc', label: '遞減 (大→小)', value: 'DESC' }
      ]
    }
  }
}
