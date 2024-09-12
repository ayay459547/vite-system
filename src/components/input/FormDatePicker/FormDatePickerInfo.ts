import type { PropType } from 'vue'

import type { Option as CommonOption } from '@/components'

export const version = '__FormDatePicker_1.0.0__'

export declare namespace Types {
  type BaseValue = string | null
  type Option = CommonOption & {
    label?: string
    value?: string | number | boolean | null
    disabled?: boolean
    data?: any
    color?: string
  }

  type DatePickerType =
    | 'year'
    | 'month'
    | 'date'
    | 'dates'
    | 'datetime'
    | 'week'
    | 'datetimerange'
    | 'daterange'
    | 'monthrange'

  type Shortcut = {
    i18nLabel?: string
    text: string
    value: () => [number, number]
  }
}

export declare namespace Props {
  type ModelValue = Types.BaseValue | [Types.BaseValue, Types.BaseValue]
  type ErrorMessage = string
  type Type = Types.DatePickerType

  type Clearable = boolean
  type Disabled = boolean
  type Format = string
  type ValueFormat = string
  type Shortcuts = Array<Types.Shortcut>
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
  // element ui plus
  type: {
    type: String as PropType<Props.Type>,
    default: 'date'
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
    default: 'YYYY-MM-DD'
  },
  valueFormat: {
    type: String as PropType<Props.ValueFormat>,
    default: 'YYYY-MM-DD'
  },
  shortcuts: {
    type: Array as PropType<Props.Shortcuts>,
    required: false
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
  type Blur = ($event: FocusEvent) => void
  type Change = (value: Props.ModelValue) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
}

