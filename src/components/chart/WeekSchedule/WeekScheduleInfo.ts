import type { PropType } from 'vue'

export const version = '__WeekSchedule_1.0.0__'

export interface Types {
  option: {
    label: string
    value: any
    color: string
  }
  // 分配時間
  planTime: {
    uuid?: string
    id?: string
    dayId?: number
    // 新增 | 修改 | 舊資料(無變更) | 刪除
    status?: 'new' | 'update' | 'old' | 'delete' | string

    start?: string
    startSecond?: number
    end?: string
    endSecond?: number
  }
  // 分配樣式
  planStyle: {
    top?: number
    height?: number
    display?: 'none' | 'block'
  }
  // 分配原始位置
  origin: {
    originStart?: string
    originStartSecond?: number
    originEnd?: string
    originEndSecond?: number

    originTop?: number
    originHeight?: number
  }
  // 確認是否存在
  checkTimeIsExistOptions: {
    startSecond: number,
    endSecond: number,
    filterId?: Array<string> | string | null | undefined
  }
  checkTimeIsExistReturn: {
    sameIdList: string[]
    existIdList: string[]
    isTimeExist: boolean
  }
  checkTimeIsExist: (options: Types['checkTimeIsExistOptions']) => Promise<Types['checkTimeIsExistReturn']>
}

export interface Props {
  title: string
  scheduleList: Array<Types['planTime']>
  options: Array<Types['option']>

}
export const props = {
  title: {
    type: String as PropType<Props['title']>,
    required: false,
    default: '',
    description: '標題'
  },
  scheduleList: {
    type: Array as PropType<Props['scheduleList']>,
    required: false,
    default: () => [],
    description: '資料列表'
  },
  options: {
    type: Array as PropType<Props['options']>,
    required: false,
    default: () => [],
    description: '類型選項(暫時沒用到)'
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

export interface Emits {}

export interface Expose {
  init: (scheduleList: Props['scheduleList']) => void
  getData: () => Promise<{
    create: Array<any>
    update: Array<any>
    remove: Array<any>
    old: Array<any>
    all: Array<any>
  }>
}
