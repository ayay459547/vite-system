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
  type Options = Array<Types.Option>
  type Label = string

  type ModelValue = CheckboxValueType | CheckboxGroupValueType | any
  type Disabled = boolean
  type Indeterminate = boolean
}
export const props = {
  options: {
    type: Array as PropType<Props.Options>,
    required: false,
    default() {
      return []
    },
    description: '選項'
  },
  label: {
    type: String as PropType<Props.Label>,
    default: ''
  },
  // element ui plus
  modelValue: {
    type: [Array, String, Number, Boolean] as PropType<Props.ModelValue>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  indeterminate: {
    type: Boolean as PropType<Props.Indeterminate>,
    default: false
  }
}

export declare namespace Emits {
  // CheckboxGroupValueType | CheckboxValueType
  type Change<T> = (value: T) => void
}

export declare namespace Expose {}

