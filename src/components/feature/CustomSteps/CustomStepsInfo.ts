import type { PropType } from 'vue'

export const version = '__CustomSteps_1.0.0__'

export interface Types {
  statusType: 'wait' | 'process' | 'finish' | 'error' | 'success'
  option: {
    label?: string
    description?: string
    status?: Types['statusType'] | ''
    [key: string]: any
  }
}

export interface Props {
  space: string | number
  direction: 'vertical' | 'horizontal'
  active: number
  processStatus: Types['statusType']
  finishStatus: Types['statusType']
  alignCenter: boolean
  simple: boolean
  options: Array<Types['option']>
}
export const props = {
  space: {
    type: [String, Number] as PropType<Props['space']>,
    default: ''
  },
  direction: {
    type: String as PropType<Props['direction']>,
    default: 'horizontal'
  },
  active: {
    type: Number as PropType<Props['active']>,
    default: 0
  },
  processStatus: {
    type: String as PropType<Props['processStatus']>,
    default: 'process'
  },
  finishStatus: {
    type: String as PropType<Props['finishStatus']>,
    default: 'finish'
  },
  alignCenter: {
    type: Boolean as PropType<Props['alignCenter']>,
    default: false
  },
  simple: {
    type: Boolean as PropType<Props['simple']>,
    default: false
  },
  options: {
    type: Array as PropType<Props['options']>,
    default: () => []
  }
}

export interface Emits {}

export interface Expose {}
