import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Custom {
  type Option = {
    label: string
    value: any
    color: string
  }

  // 分配時間
  type PlanTime = {
    uuid?: string
    id?: string
    dayId?: number
    // 新增 | 修改 | 舊資料(無變更) | 刪除
    status?: 'new' | 'update' | 'old' | 'delete'

    start?: string
    startSecond?: number
    end?: string
    endSecond?: number
  }

  // 分配樣式
  type PlanStyle = {
    top?: number
    height?: number
    display?: 'none' | 'block'
  }

  // 分配原始位置
  type Origin = {
    originStart?: string
    originStartSecond?: number
    originEnd?: string
    originEndSecond?: number

    originTop?: number
    originHeight?: number
  }

  // 確認是否存在
  type CheckTimeIsExist = (
    startSecond: number,
    endSecond: number,
    filterId?: Array<string> | string | null | undefined
  ) => boolean
}

export declare namespace Props {
  type Title = string
  type ScheduleList = Array<Custom.PlanTime>
  type Options = Array<Custom.Option>

}

export const props = {
  title: {
    type: String as PropType<Props.Title>,
    required: false,
    default: '',
    description: '標題'
  },
  options: {
    type: Array as PropType<Props.Options>,
    required: false,
    default () {
      return []
    },
    description: '類型選項(暫時沒用到)'
  },
  scheduleList: {
    type: Array as PropType<Props.ScheduleList>,
    required: false,
    default () {
      return []
    },
    description: '資料列表'
  },
  isCreate: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可新增'
  },
  isUpdate: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可編輯'
  },
  isRemove: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可刪除'
  }
}

