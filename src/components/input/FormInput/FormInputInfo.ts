import type { PropType } from 'vue'

export const version = '__FormInput_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type ModelValue = string | number | null
  type ErrorMessage = string

  type OnlyNumber = boolean
  type Round = number | null
  type Floor = number | null
  type Ceil = number | null
  type Max = number | null
  type Min = number | null

  type Clearable = boolean
  type Disabled = boolean
  type Type = string
  type Rows = number
  type ShowPassword = boolean
  type Placeholder = string
}
export const props = {
  modelValue: {
    type: [String, Number, null] as PropType<Props.ModelValue>,
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
  floor: {
    type: [Number, null] as PropType<Props.Floor>,
    default: null
  },
  ceil: {
    type: [Number, null] as PropType<Props.Ceil>,
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
  type: {
    type: String as PropType<Props.Type>,
    default: 'text'
  },
  rows: {
    type: Number as PropType<Props.Rows>,
    default: 2
  },
  showPassword: {
    type: Boolean as PropType<Props.ShowPassword>,
    default: false
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(e: FocusEvent) => void>,
  onClear: Function as PropType<() => void>,
  onBlur: Function as PropType<(e: FocusEvent) => void>,
  onChange: Function as PropType<(value: string | number) => void>,
  onInput: Function as PropType<(value: string | number) => void>
}

export declare namespace Emits {
  type Focus = ($event: FocusEvent) => void
  type Clear = () => void
  type Blur = ($event: FocusEvent) => void
  type Change = (value: Props.ModelValue) => void
  type Input = (value: Props.ModelValue) => void
  type Click = ($event: MouseEvent) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
}

