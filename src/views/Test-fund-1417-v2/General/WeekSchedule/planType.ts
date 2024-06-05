type BasePlanTime = {
  start: string
  startSecond?: number
  end: string
  endSecond?: number
}

type BasePlanStyle = {
  top: number
  height: number
}

export type PlanItem = {
  id?: string
  day: number
  status?: 'new' | 'update' | 'old'
  start: string
  end: string
}
export type PlanList = Array<PlanItem>

// 實際資料分配
export type DataPlanTime = BasePlanTime & {
  id?: string
  status?: 'new' | 'update' | 'old'
}
export type DataPlanStyle = BasePlanStyle & {
  zIndex?: number
  cursor?: 'default' | 's-resize' | 'move' | 'pointer'
}

// 滑鼠點擊 建立暫時的分配
export type TempPlanTime = BasePlanTime & {}
export type TempPlanStyle = BasePlanStyle & {
  left: number
  display: 'none' | 'block'
}

export type Origin = {
  originTop: number
  originHeight: number
  originStartSecond: number
  originEndSecond: number
}

export type PlanData = {
  time: DataPlanTime
  style: DataPlanStyle
}
