import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type Value = string | number
  type Max = number
  type IsDot = boolean
  type Hidden = boolean
  type Type = 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

export const props = {
  value: {
    type: [String, Number] as PropType<Props.Value>,
    required: false,
    default: '',
    description: '顯示的值'
  },
  max: {
    type: Number as PropType<Props.Max>,
    required: false,
    default: 99,
    description: '最大值'
  },
  isDot: {
    type: Boolean as PropType<Props.IsDot>,
    required: false,
    default: false,
    description: '是否顯示小圓點'
  },
  hidden: {
    type: Boolean as PropType<Props.Hidden>,
    required: false,
    default: false,
    description: '是否隱藏標記'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'primary',
    description: '類型'
  }
}
