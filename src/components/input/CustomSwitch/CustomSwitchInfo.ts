import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Types {
  type Size = '' | 'large' | 'default' | 'small'
}

export declare namespace Props {
  type ModelValue = boolean
  type Style = string
  type ActiveText = string
  type InactiveText = string
  type Disabled = boolean
  type Loading = boolean
  type Size = Types.Size
  type Width = string | number
}

export const props = {
  modelValue: {
    type: Boolean as PropType<Props.ModelValue>,
    required: true
  },
  style: {
    type: String as PropType<Props.Style>,
    default: ''
  },
  activeText: {
    type: String as PropType<Props.ActiveText>,
    default: ''
  },
  inactiveText: {
    type: String as PropType<Props.InactiveText>,
    default: ''
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  loading: {
    type: Boolean as PropType<Props.Loading>,
    default: false
  },
  size: {
    type: String as PropType<Props.Size>,
    default: ''
  },
  width: {
    type: [String, Number] as PropType<Props.Width>,
    default: ''
  }
}

export declare namespace Emits {
  type Change = (val: string | number | boolean) => void
}

export declare namespace Expose {}
