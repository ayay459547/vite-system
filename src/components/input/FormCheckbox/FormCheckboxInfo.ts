import type { PropType } from 'vue'
import type { CheckboxValueType, CheckboxGroupValueType } from 'element-plus'

import type { Option as CommonOption } from '@/components' // 系統組件

export const version = '__FormCheckbox_1.0.0__'

export declare namespace Types {
  type Option = CommonOption & {
    label: string
    value: string | number | boolean | null
    disabled?: boolean
    data?: any
    color?: string
  }
}

export declare namespace Props {
  type ModelValue = CheckboxValueType | CheckboxGroupValueType | any
  type ErrorMessage = string
  type Options = Array<Types.Option>
  type Label = string

  type Disabled = boolean
  type Indeterminate = boolean
}
export const props = {
  modelValue: {
    type: [Array, String, Number, Boolean] as PropType<Props.ModelValue>,
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
  label: {
    type: String as PropType<Props.Label>,
    default: ''
  },
  // element ui plus
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  indeterminate: {
    type: Boolean as PropType<Props.Indeterminate>,
    default: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onChange: Function as PropType<(e: CheckboxGroupValueType | CheckboxValueType) => void>
}

export declare namespace Emits {
  // CheckboxGroupValueType | CheckboxValueType
  type Change<T> = (value: T) => void
}

export declare namespace Expose {}

