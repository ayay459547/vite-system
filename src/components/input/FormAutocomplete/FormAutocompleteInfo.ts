import type { PropType } from 'vue'

export const version = '__FormAutocomplete_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type ModelValue = string | number | null
  type ErrorMessage = string

  type Clearable = boolean
  type Disabled = boolean
  type ValueKey = string
  type FitInputWidth = boolean
  type FetchSuggestions = (queryString: string, callback: (data: any) => void) => void
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
  // element ui plus
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  valueKey: {
    type: String as PropType<Props.ValueKey>,
    default: 'value'
  },
  fitInputWidth: {
    type: Boolean as PropType<Props.FitInputWidth>,
    default: false
  },
  fetchSuggestions: {
    type: Function as PropType<Props.FetchSuggestions>,
    required: false
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onSelect: Function as PropType<(item: Props.ModelValue) => void>,
  onChange: Function as PropType<(value: string | number) => void>
}

export declare namespace Emits {
  type Select = (item: Props.ModelValue) => void
  type Blur = (event: FocusEvent) => void
  type Change = (value: Props.ModelValue) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
}

