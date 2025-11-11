import type { LogicRestriction } from './logicRestriction'

// 配合 MatcherConstraintForm
export interface MatcherConstraint {
  positiveConstraint?: LogicRestriction | null
  negativeConstraint?: LogicRestriction | null
}

// 配合 MatcherForm
export interface Matcher extends MatcherConstraint {
  // 匹配模式 (目前只有 RouteClassifySettingConstraint 使用)
  matchingMode?: string | 'singleTarget' | 'continueObject'
}
