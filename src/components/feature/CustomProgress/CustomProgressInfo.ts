import type { PropType } from 'vue'

export const version = '__CustomProgress_1.0.0__'

export interface Types {
  progressFunction: (percentage: number) => string
  progressColor: string
    | Array<{
        color: string
        percentage: number
      }>
    | Types['progressFunction']
}

export interface Props {
  percentage: number
  type: 'line' | 'circle' | 'dashboard'
  strokeWidth: number
  textInside: boolean
  status: '' | 'success' | 'exception' | 'warning'
  indeterminate: boolean
  duration: number
  color: Types['progressColor']
  showText: boolean
  strokeLinecap: 'butt' | 'round' | 'square'
  format: Types['progressFunction']
  striped: boolean
  stripedFlow: boolean
}
export const props = {
  percentage: {
    type: Number as PropType<Props['percentage']>,
    required: false,
    default: 0,
    description: '進度'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'line',
    description: '類型'
  },
  strokeWidth: {
    type: Number as PropType<Props['strokeWidth']>,
    required: false,
    default: 6,
    description: '進度條寬度'
  },
  textInside: {
    type: Boolean as PropType<Props['textInside']>,
    required: false,
    default: false,
    description: '文字是否在進度條中'
  },
  status: {
    type: String as PropType<Props['status']>,
    required: false,
    default: '',
    description: '進度條狀態'
  },
  indeterminate: {
    type: Boolean as PropType<Props['indeterminate']>,
    required: false,
    default: false,
    description: '是否為動畫進度條'
  },
  duration: {
    type: Number as PropType<Props['duration']>,
    required: false,
    default: 3,
    description: '控制動畫速度'
  },
  color: {
    type: [String, Function, Array] as PropType<Props['color']>,
    required: false,
    default: '',
    description: '自訂顏色'
  },
  showText: {
    type: Boolean as PropType<Props['showText']>,
    required: false,
    default: true,
    description: '是否顯示文字'
  },
  strokeLinecap: {
    type: String as PropType<Props['strokeLinecap']>,
    required: false,
    default: 'round',
    description: '兩端形狀'
  },
  format: {
    type: [Function, undefined] as PropType<Props['format']>,
    required: false,
    default: undefined,
    description: '格式化顯示文字'
  },
  striped: {
    type: Boolean as PropType<Props['striped']>,
    required: false,
    default: false,
    description: '進度條上顯示條紋'
  },
  stripedFlow: {
    type: Boolean as PropType<Props['stripedFlow']>,
    required: false,
    default: false,
    description: '條紋是否流動'
  }
}

export interface Emits {}

export interface Expose {}
