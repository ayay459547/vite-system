import type { Options } from '@/components' // 系統組件

// 配合後端格式
export const operatorOptions: Options<string> = [
  { label: '=', value: 'equal' },
  { label: '!=', value: 'notEqual' },
  { label: '>=', value: 'greatterThanOrEqualTo' },
  { label: '>', value: 'greatterThan' },
  { label: '<=', value: 'lessThanOrEqualTo' },
  { label: '<', value: 'lessThan' }
]

// CustomSearch
export const conditionOptions: Options<string> = [
  { label: 'like', value: 'Like' },
  { label: 'not like', value: 'NotLike' },
  { label: '=', value: 'Equal' },
  { label: '!=', value: 'NotEqual' },
  { label: '>=', value: 'GreatterThanOrEqualTo' },
  { label: '>', value: 'GreatterThan' },
  { label: '<=', value: 'LessThanOrEqualTo' },
  { label: '<', value: 'LessThan' },
  { label: 'is null', value: 'IsNull' },
  { label: 'not null', value: 'notNull' },
  { label: 'is blank', value: 'IsBlank' },
  { label: 'not blank', value: 'NotBlank' }
]

// 看板 (使用api)
export const comparisonOptions: Array<any> = [
  { text: 'like', value: 'Like' },
  // { text: 'not like', value: 'NotLike' }, // 不開放
  { text: '=', value: 'Equal' },
  { text: '!=', value: 'NotEqual' },
  { text: '>=', value: 'GreatterThanOrEqualTo' },
  { text: '>', value: 'GreatterThan' },
  { text: '<=', value: 'LessThanOrEqualTo' },
  { text: '<', value: 'LessThan' },
  { text: 'is not null', value: 'NotNull' },
  { text: 'is null', value: 'IsNull' },
  { text: 'is blank', value: 'IsBlank' },
  { text: 'not blank', value: 'NotBlank' },
  { text: 'in', value: 'In' },
  { text: 'not in', value: 'NotIn' }
]

// 排程順序
export const checkInOptions: Options<number> = [
  { label: '年', value: 16, i18nLabel: 'BlockSortingType-typeItemIndex-checkIn-16' },
  { label: '月', value: 17, i18nLabel: 'BlockSortingType-typeItemIndex-checkIn-17' },
  { label: '日', value: 18, i18nLabel: 'BlockSortingType-typeItemIndex-checkIn-18' },
  { label: '時', value: 19, i18nLabel: 'BlockSortingType-typeItemIndex-checkIn-19' },
  { label: '分', value: 20, i18nLabel: 'BlockSortingType-typeItemIndex-checkIn-20' },
  { label: '秒', value: 3, i18nLabel: 'BlockSortingType-typeItemIndex-checkIn-3' }
]

export const blockSortingTypes: Options<number> = [
  { label: '優先權值', value: 1, i18nLabel: 'BlockSortingType-typeItemIndex-1' },
  { label: '需求日期', value: 2, i18nLabel: 'BlockSortingType-typeItemIndex-2' },
  {
    label: '到站時間',
    value: 3,
    i18nLabel: 'BlockSortingType-typeItemIndex-checkIn'
    // options: checkInOptions
  },
  { label: '工單編號', value: 4, i18nLabel: 'BlockSortingType-typeItemIndex-4' },
  { label: '批量大小', value: 5, i18nLabel: 'BlockSortingType-typeItemIndex-5' },
  { label: '工單緊急度', value: 6, i18nLabel: 'BlockSortingType-typeItemIndex-6' },
  { label: 'DateCode', value: 7, i18nLabel: 'BlockSortingType-typeItemIndex-7' },
  { label: '是否有PN', value: 8, i18nLabel: 'BlockSortingType-typeItemIndex-8' },
  { label: 'CSN生產順序', value: 9, i18nLabel: 'BlockSortingType-typeItemIndex-9' },
  { label: 'QtimeRisk', value: 10, i18nLabel: 'BlockSortingType-typeItemIndex-10' },
  { label: '機台分配', value: 11, i18nLabel: 'BlockSortingType-typeItemIndex-11' },
  { label: '是否到站', value: 12, i18nLabel: 'BlockSortingType-typeItemIndex-12' },
  { label: '產品(內部產品)', value: 13, i18nLabel: 'BlockSortingType-typeItemIndex-13' },
  { label: '客戶型號', value: 14, i18nLabel: 'BlockSortingType-typeItemIndex-14' },
  { label: '貨批站點距離', value: 15, i18nLabel: 'BlockSortingType-typeItemIndex-15' },
  { label: '開工時間', value: 995, i18nLabel: 'BlockSortingType-typeItemIndex-995' },
  { label: '插單順序', value: 996, i18nLabel: 'BlockSortingType-typeItemIndex-996' },
  { label: '鎖定順序', value: 997, i18nLabel: 'BlockSortingType-typeItemIndex-997' },
  { label: '工單途程順序', value: 998, i18nLabel: 'BlockSortingType-typeItemIndex-998' },
  { label: '隨機順序', value: 999, i18nLabel: 'BlockSortingType-typeItemIndex-999' }
]
