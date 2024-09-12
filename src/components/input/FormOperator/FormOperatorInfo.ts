import type { PropType } from 'vue'

import type { Options as CommonOptions } from '@/components'

export const version = '__FormOperator_1.0.0__'

export declare namespace Types {
  type OperatorOptions = 'equal' | 'greatthan' | 'lessthan' | '' | string | null
  type OperatorValue = string | number | null
}

export declare namespace Props {
  type ModelValue = [Types.OperatorOptions, Types.OperatorValue]
  type ErrorMessage = string
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
    type: Array as unknown as PropType<Props.ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<Props.ErrorMessage>,
    default: ''
  },
  // 數字
  onlyNumber: {
    type: Boolean as PropType<Props.OnlyNumber>,
    default: false
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
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(e: any) => void>,
  onClear: Function as PropType<() => void>,
  onBlur: Function as PropType<(e: any) => void>,
  onChange: Function as PropType<(value: any) => void>,
  onInput: Function as PropType<(value: any) => void>
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

