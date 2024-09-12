import type { Options } from '@/components'

// 配合後端格式
export const operatorOptions: Options<string> = [
  { label: '=', value: 'equal' },
  { label: '<>', value: 'notEqual' },
  { label: '>', value: 'greatterThan' },
  { label: '>=', value: 'greatterThanOrEqualTo' },
  { label: '<', value: 'lessThan' },
  { label: '<=', value: 'lessThanOrEqualTo' }
]

export const conditionOptions: Options<string> = [
  { label: 'like', value: 'like' },
  { label: 'not like', value: 'notLike' },
  { label: '=', value: 'equal' },
  { label: '!=', value: 'notEqual' },
  { label: '>', value: 'greatterThan' },
  { label: '>=', value: 'greatterThanOrEqualTo' },
  { label: '<', value: 'lessThan' },
  { label: '<=', value: 'lessThanOrEqualTo' },
  { label: 'is blank', value: 'isBlank' },
  { label: 'not blank', value: 'notBlank' },
  { label: 'is null', value: 'isNull' },
  { label: 'not null', value: 'notNull' }
]

export const comparisonOptions: Options<string> = [
  { label: '=', value: 'Equal' },
  { label: '>', value: 'LargeThan' },
  { label: '>=', value: 'LargeEqualThan' },
  { label: '<', value: 'LessThan' },
  { label: '<=', value: 'LessEqualThan' },
  { label: '<>', value: 'NotEqual' },
  { label: 'like', value: 'Like' },
  { label: 'is null', value: 'IsNull' },
  { label: 'is not null', value: 'IsNotNull' },
  { label: 'in', value: 'IN' },
  { label: 'not in', value: 'Not IN' }
]
