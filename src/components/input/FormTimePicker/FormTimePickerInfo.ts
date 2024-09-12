import type { PropType } from 'vue'
import type { Dayjs } from 'dayjs'

export const version = '__FormTimePicker_1.0.0__'

export declare namespace Types {
  type BaseValue = string | Date | null

  type GetDisabledHours = (
    role: string,
    comparingDate?: Dayjs
  ) => number[]

  type GetDisabledMinutes = (
    hour: number,
    role: string,
    comparingDate?: Dayjs
  ) => number[]

  type GetDisabledSeconds = (
    hour: number,
    minute: number,
    role: string,
    comparingDate?: Dayjs
  ) => number[]

  type TimePickerType = 'time' | 'timerange'
}

export declare namespace Props {
  type ModelValue = Types.BaseValue | [Types.BaseValue, Types.BaseValue]
  type ErrorMessage = string
  type Type = Types.TimePickerType
  type IsRange = boolean
  type Clearable = boolean
  type Disabled = boolean
  type Format = string
  type RangeSeparator = string
  type DisabledHours = Types.GetDisabledHours
  type DisabledMinutes = Types.GetDisabledMinutes
  type DisabledSeconds = Types.GetDisabledSeconds
  type Placeholder = string
}
export const props = {
  modelValue: {
    type: [Array, String, null] as PropType<Props.ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<Props.ErrorMessage>,
    default: ''
  },
  type: {
    type: String as PropType<Props.Type>,
    default: 'time'
  },
  // element ui plus
  isRange: {
    type: Boolean as PropType<Props.IsRange>,
    required: false,
    default: false
  },
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    required: false,
    default: false
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  format: {
    type: String as PropType<Props.Format>,
    default: 'HH:mm:ss'
  },
  rangeSeparator: {
    type: String as PropType<Props.RangeSeparator>,
    default: '-'
  },
  disabledHours: {
    type: Function as PropType<Props.DisabledHours>,
    default: () => []
  },
  disabledMinutes: {
    type: Function as PropType<Props.DisabledMinutes>,
    default: () => []
  },
  disabledSeconds: {
    type: Function as PropType<Props.DisabledSeconds>,
    default: () => []
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(e: FocusEvent) => void>,
  onBlur: Function as PropType<(e: FocusEvent) => void>,
  onChange: Function as PropType<(e: Props.ModelValue) => void>
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

