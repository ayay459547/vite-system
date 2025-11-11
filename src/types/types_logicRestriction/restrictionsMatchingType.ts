// 不同類型的資料 對應可用比對方式
export type StrMatchingType = string
  | 'FULL' // 完全符合
  | 'FROM_HEAD' // 開頭符合
  | 'FROM_TAIL' // 結尾符合
  | 'INCLUDE' // 包含
  | 'INCLUDE_CHARACTER_ORDER_ONLY' // 支援*A*B matched: AB, xxxAxxxB, xxxABxxx
  | 'REGEX' // 正規

export type NumMatchingType = string
  | 'LARGE_THAN'
  | 'LARGE_EQUAL_THAN'
  | 'LESS_THAN'
  | 'LESS_EQUAL_THAN'
  | 'EQUAL'
  | 'BETWEEN'
  | 'CONTAIN'
  | 'PRODUCT_LARGE_THAN'
  | 'PRODUCT_LARGE_EQUAL_THAN'
  | 'PRODUCT_LESS_THAN'
  | 'PRODUCT_LESS_EQUAL_THAN'
  | 'PRODUCT_EQUAL'

export type DateMatchingType = string
  | 'BETWEEN'

// 大駝峰
export interface PascalCaseMatchingKeyMap {
  StrMatchingType?: StrMatchingType
  NumMatchingType?: NumMatchingType
  DateMatchingType?: DateMatchingType
}
export type PascalCaseMatchingType = keyof PascalCaseMatchingKeyMap

// 小駝峰
export interface CamelCaseMatchingKeyMap {
  strMatchingType?: StrMatchingType
  numMatchingType?: NumMatchingType
  dateMatchingType?: DateMatchingType
}
export type CamelCaseMatchingType = keyof CamelCaseMatchingKeyMap

// RestrictionType 的資料型態
export interface MatchingKeyMap extends PascalCaseMatchingKeyMap, CamelCaseMatchingKeyMap {}
export type MatchingType = keyof MatchingKeyMap

// 比對方式
export type MatchingTypeValue = MatchingKeyMap[keyof MatchingKeyMap]
