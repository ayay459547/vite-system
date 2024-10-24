import type { PropType } from 'vue'

import type { Option as CommonOption } from '@/components' // 系統組件

export const version = '__FormOperator_1.0.0__'

export declare namespace Types {
  type Option = CommonOption & {
    disabled?: boolean
    data?: any
    color?: string
  }
}

export declare namespace Props {
  type ModelValue = number | string | boolean | null
  type ErrorMessage = string
  type Options = Array<Types.Option>
  type Disabled = boolean
}
export const props = {
  modelValue: {
    type: [Boolean, String, Number, null] as PropType<Props.ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<Props.ErrorMessage>,
    default: ''
  },
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  },
  // element ui plus
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onChange: Function as PropType<(e: Props.ModelValue) => void>
}

export declare namespace Emits {
  type Change = (value: Props.ModelValue) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
}

