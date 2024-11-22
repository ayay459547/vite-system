import type { PropType } from 'vue'

import type { Options as CommonOptions } from '@/components' // 系統組件

export const version = '__FormOperator_1.0.0__'

export declare namespace Types {
  type OperatorOptions = 'equal' | 'greatthan' | 'lessthan' | '' | string | null
  type OperatorValue = string | number | null
}

export declare namespace Props {
  type ModelValue = [Types.OperatorOptions, Types.OperatorValue] | any
  type Type = string
  type OnlyNumber = boolean
  type Round = number | null
  type Max = number | null
  type Min = number | null
  type Clearable = boolean
  type Disabled = boolean
  type Options = CommonOptions
  type Placeholder = string
}
export const props = {
  modelValue: {
    type: Array as PropType<Props.ModelValue>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  // 數字
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'text',
    description: '類型'
  },
  round: {
    type: [Number, null] as PropType<Props.Round>,
    default: null
  },
  max: {
    type: [Number, null] as PropType<Props.Max>,
    default: null
  },
  min: {
    type: [Number, null] as PropType<Props.Min>,
    default: null
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return [
        // { label: '=', value: 'equal' },
        // { label: '>', value: 'greatterThan' },
        // { label: '>=', value: 'greatterThanOrEqualTo' },
        // { label: '<', value: 'lessThan' },
        // { label: '<=', value: 'lessThanOrEqualTo' },
        // { label: '<>', value: 'notEqual' }
      ]
    }
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false
  }
}

export declare namespace Emits {
  type Focus = ($event: FocusEvent) => void
  type Clear = () => void
  type Blur = ($event: FocusEvent) => Promise<void>
  type Change = (value: Props.ModelValue) => void
  type Input = (value: Props.ModelValue) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
}

