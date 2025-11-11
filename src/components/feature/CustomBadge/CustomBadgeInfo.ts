import type { PropType, CSSProperties } from 'vue'

export const version = '__CustomBadge_1.0.0__'

export interface Types {}

export interface Props {
  value: string | number
  max: number
  isDot: boolean
  hidden: boolean
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  showZero: boolean
  color: string
  offset: [number, number]
  badgeStyle: CSSProperties
  badgeClass: string
}

export const props = {
  value: {
    type: [String, Number] as PropType<Props['value']>,
    required: false,
    default: '',
    description: '顯示的值'
  },
  max: {
    type: Number as PropType<Props['max']>,
    required: false,
    default: 99,
    description: '最大值'
  },
  isDot: {
    type: Boolean as PropType<Props['isDot']>,
    required: false,
    default: false,
    description: '是否顯示小圓點'
  },
  hidden: {
    type: Boolean as PropType<Props['hidden']>,
    required: false,
    default: false,
    description: '是否隱藏標記'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'primary',
    description: '類型'
  },
  showZero: {
    type: Boolean as PropType<Props['showZero']>,
    required: false,
    default: true,
    description: '是否顯示0'
  },
  color: {
    type: String as PropType<Props['color']>,
    required: false,
    default: undefined,
    description: '背景色'
  },
  offset: {
    type: Array as unknown as PropType<Props['offset']>,
    required: false,
    default: undefined,
    description: '偏移量'
  },
  badgeStyle: {
    type: Object as PropType<Props['badgeStyle']>,
    required: false,
    default: undefined,
    description: '自訂style'
  },
  badgeClass: {
    type: String as PropType<Props['badgeClass']>,
    required: false,
    default: undefined,
    description: '自訂class'
  }
}

export interface Emits {}

export interface Expose {}
