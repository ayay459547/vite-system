import type { Restrictions } from './restrictions'

export type CombineLogic = string | 'OR' | 'AND'

export type Positive = boolean

export type LogicRestriction_type = string
  // fund-1435 機台生產限制管理
  | 'MachineProcessProductionConstraint'
  // fund-1419 機台合併條件限制管理
  // | 'MergeConstraint'
  | 'MachineMergeConstraint'
  | 'MachineCategoryMergeConstraint'
  // fund-1422 機台換線管理
  | 'MachineProcessChangeLine'
  // fund-1427 一貫機連續生產規則管理
  | 'OneStopProducingConstraint'
  // fund-1434 途程型態分類管理
  | 'RouteClassificationMatcher'
  | 'RouteClassifySettingConstraint'
  // fund-1431 併批製程識別管理
  | 'OrderRelaySetting'


export type LogicRestriction_value = {
  // 更新人員
  employeeName?: string
  // 條件結合邏輯: OR/AND
  combineLogic?: CombineLogic
  // 表列方式: 正負向
  positive?: Positive
  // 邏輯設定
  logicRestrictions?: Array<LogicRestriction>
  // 比對設定
  restrictions?: Restrictions

  // 後端屬性 前端不設定
  // constraintType?: string | 'engineering'
  // lastVersion?: string | 'IsLast'
  // autoGeneratingId?: boolean
  // factoryNo?: string | 'IsLast'
  // hiberversion?: any
}

// 對應 LogicRestrictionForm
export interface LogicRestriction {
  _type: LogicRestriction_type
  _value: LogicRestriction_value
}
export type LogicRestrictions = Array<LogicRestriction>
