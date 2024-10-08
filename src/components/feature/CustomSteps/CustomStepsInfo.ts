import type { PropType } from 'vue'

export const version = '__CustomSteps_1.0.0__'

export declare namespace Types {
  type StatusType = 'wait' | 'process' | 'finish' | 'error' | 'success'
  type Option = {
    label?: string
    description?: string
    status?: StatusType | ''
    [key: string]: any
  }
}

export declare namespace Props {
  type Space = string | number
  type Direction = 'vertical' | 'horizontal'
  type Active = number
  type ProcessStatus = Types.StatusType
  type FinishStatus = Types.StatusType
  type AlignCenter = boolean
  type Simple = boolean
  type Options = Array<Types.Option>
}
export const props = {
  space: {
    type: [String, Number] as PropType<Props.Space>,
    default: ''
  },
  direction: {
    type: String as PropType<Props.Direction>,
    default: 'horizontal'
  },
  active: {
    type: Number as PropType<Props.Active>,
    default: 0
  },
  processStatus: {
    type: String as PropType<Props.ProcessStatus>,
    default: 'process'
  },
  finishStatus: {
    type: String as PropType<Props.FinishStatus>,
    default: 'finish'
  },
  alignCenter: {
    type: Boolean as PropType<Props.AlignCenter>,
    default: false
  },
  simple: {
    type: Boolean as PropType<Props.Simple>,
    default: false
  },
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
