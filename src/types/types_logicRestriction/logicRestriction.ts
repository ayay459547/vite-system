import type { Restrictions } from './restrictions'

export type CombineLogic = string | 'OR' | 'AND'

export type Positive = boolean

export type LogicRestriction_type = string
  | 'MachineProcessProductionConstraint'
  | 'MachineMergeConstraint'
  | 'MachineCategoryMergeConstraint'
  | 'MachineProcessChangeLine'
  | 'OneStopProducingConstraint'
  | 'RouteClassificationMatcher'
  | 'RouteClassifySettingConstraint'
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
