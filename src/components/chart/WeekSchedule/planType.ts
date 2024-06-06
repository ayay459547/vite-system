// 分配時間
export type PlanTime = {
  id?: string
  dayId?: number
  status?: 'new' | 'update' | 'old'

  start?: string
  startSecond?: number
  end?: string
  endSecond?: number
}

// 分配樣式
export type PlanStyle = {
  top?: number
  height?: number
  display?: 'none' | 'block'
}

export type Origin = {
  originStart?: string
  originStartSecond?: number
  originEnd?: string
  originEndSecond?: number

  originTop?: number
  originHeight?: number
}

export type CheckTimeIsExist = (
  startSecond: number,
  endSecond: number,
  filterId?: Array<string> | string | null | undefined
) => boolean

// props
export type ScheduleList = Array<PlanTime>

export type Option = {
  label: string
  value: any
  color: string
}
export type Options = Array<Option>
