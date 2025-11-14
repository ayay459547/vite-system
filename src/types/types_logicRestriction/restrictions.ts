import type { MatchingType, MatchingKeyMap } from './restrictionsMatchingType'

// 規格用
export type SchAdditionalSpecType = string
  | 'MachineProcessChangeLine'
  | 'MachineProcessProductionConstraint'
  | 'MachineMergeConstraint'
  | 'MachineCategoryMergeConstraint'
  | 'MachineCleanTiming' // 清機時機

// 比對類型
export type RestrictionType = string
  | 'CUSTOMER_NO' // 0 客戶編號
  | 'PRODUCT_NO' // 1 產品編號
  | 'PRODUCT_NAME' // 2 產品名稱
  | 'PRODUCT_CATEGORY' // 3 產品類別:產品本身被歸屬於何種分類
  | 'PRODUCT_SPECIFICATION' // 4 產品規格 (貼標規格)
  | 'MO_NO' // 5 一個生產工單(貨批)的編號
  | 'MO_ROUTE' // 6 一個生產工單(貨批)指定的生產流程
  | 'MO_ITEM_RECIPE' // 7 一個生產工單(貨批)所在製程站點指定的生產配方(半導體業 → 程式)
  | 'PRODUCTION_GROUP' // 8 生產群組
  | 'MO_ITEM_PROCESS' // 9 生產工單(貨批)指定的製程站點
  | 'MACHINE_SPECIFICATION' // 10 機台規格 (貼標規格)
  | 'CUST_PRODUCT' // 11 客戶產品
  | 'MO_ITEM_PROCESS_NAME' // 12 生產工單(貨批)指定的製程站點名稱
  | 'GENERAL_VALUE_INFO' // 13 RTDS 物件延伸資料
  | 'ORDER_SPECIFICATION' // 14 工單規格 (貼標規格)

// 比對
export type  Restriction_Type = string
  | 'StrGenericRestriction'
  | 'StrRestriction'
  | 'SlotRestriction'
  | 'NumRestriction'
  | 'DateRestriction'

export interface Restriction_Value<T = any> extends MatchingKeyMap {
  restrictionTypeAttr: {
    /**
     * 一般: RestrictionType
     * 規格: SchAdditionalSpecType + SpecTypeId
     */
    id: RestrictionType
  }
  // 由 RestrictionType 控制 PRODUCT_NO | PRODUCT_NAME
  // attrPath: string | 'process.id' | 'process.name' | ''
  // positive: boolean
  valueInArray: T
  mark?: string
}


// 對應 LogicRestrictionForm
export type Restriction<T = any> = {
  _type: Restriction_Type
  _value: Restriction_Value<T>
}
export type Restrictions<T = any> = Array<Restriction<T>>

// 取資料
export type RestrictionInfo = {
  val: number
  cnName: string
  type: string
}

export interface MaintainRestrictionType2DataType {
  _type: Restriction_Type,
  matchingType: MatchingType,
  restrictionType: RestrictionInfo
  restrictionTypeAttr: {
    id: string
  }
  specType?: {
    id: string
    name: string
  }
}
