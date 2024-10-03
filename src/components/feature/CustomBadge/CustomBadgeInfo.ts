import type { PropType, CSSProperties } from 'vue'

export const version = '__CustomBadge_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Value = string | number
  type Max = number
  type IsDot = boolean
  type Hidden = boolean
  type Type = 'primary' | 'success' | 'warning' | 'danger' | 'info'
  type ShowZero = boolean
  type Color = string
  type Offset = [number, number]
  type BadgeStyle = CSSProperties
  type BadgeClass = string
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
  },
  showZero: {
    type: Boolean as PropType<Props.ShowZero>,
    required: false,
    default: true,
    description: '是否顯示0'
  },
  color: {
    type: String as PropType<Props.Color>,
    required: false,
    default: undefined,
    description: '背景色'
  },
  offset: {
    type: Array as unknown as PropType<Props.Offset>,
    required: false,
    default: undefined,
    description: '偏移量'
  },
  badgeStyle: {
    type: Object as PropType<Props.BadgeStyle>,
    required: false,
    default: undefined,
    description: '自訂style'
  },
  badgeClass: {
    type: String as PropType<Props.BadgeClass>,
    required: false,
    default: undefined,
    description: '自訂class'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
