import type { PropType } from 'vue'

export const version = '1.0.0'

export type StatusType = 'wait' | 'process' | 'finish' | 'error' | 'success'

export type Options = {
  label?: string
  description?: string
  status?: StatusType | ''
} & any

export const props = {
  space: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'horizontal'
  },
  active: {
    type: Number as PropType<number>,
    default: 0
  },
  processStatus: {
    type: String as PropType<StatusType>,
    default: 'process'
  },
  finishStatus: {
    type: String as PropType<StatusType>,
    default: 'finish'
  },
  alignCenter: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  simple: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  options: {
    type: Array as PropType<Options[]>,
    default () {
      return []
    }
  }
}
