import type { Options } from '@/components' // 系統組件

// 箭頭
export const arrow = '➜'

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
  { label: 'not null', value: 'NotNull' },
  { label: 'is blank', value: 'IsBlank' },
  { label: 'not blank', value: 'NotBlank' },
  { label: 'in', value: 'In' },
  { label: 'not in', value: 'NotIn' }
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
