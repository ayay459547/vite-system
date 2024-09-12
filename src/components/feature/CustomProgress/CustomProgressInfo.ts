import type { PropType } from 'vue'

export const version = '__CustomProgress_1.0.0__'

export declare namespace Types {
  type ProgressFunction = (percentage: number) => string
  type ProgressColor =
    | string
    | Array<{
        color: string
        percentage: number
      }>
    | ProgressFunction
}

export declare namespace Props {
  type Percentage = number
  type Type = 'line' | 'circle' | 'dashboard'
  type StrokeWidth = number
  type TextInside = boolean
  type Status = '' | 'success' | 'exception' | 'warning'
  type Indeterminate = boolean
  type Duration = number
  type Color = Types.ProgressColor
  type ShowText = boolean
  type StrokeLinecap = 'butt' | 'round' | 'square'
  type Format = Types.ProgressFunction
  type Striped = boolean
  type StripedFlow = boolean
}
export const props = {
  percentage: {
    type: Number as PropType<Props.Percentage>,
    required: false,
    default: 0,
    description: '進度'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'line',
    description: '類型'
  },
  strokeWidth: {
    type: Number as PropType<Props.StrokeWidth>,
    required: false,
    default: 6,
    description: '進度條寬度'
  },
  textInside: {
    type: Boolean as PropType<Props.TextInside>,
    required: false,
    default: false,
    description: '文字是否在進度條中'
  },
  status: {
    type: String as PropType<Props.Status>,
    required: false,
    default: '',
    description: '進度條狀態'
  },
  indeterminate: {
    type: Boolean as PropType<Props.Indeterminate>,
    required: false,
    default: false,
    description: '是否為動畫進度條'
  },
  duration: {
    type: Number as PropType<Props.Duration>,
    required: false,
    default: 3,
    description: '控制動畫速度'
  },
  color: {
    type: [String, Function, Array] as PropType<Props.Color>,
    required: false,
    default: '',
    description: '自訂顏色'
  },
  showText: {
    type: Boolean as PropType<Props.ShowText>,
    required: false,
    default: true,
    description: '是否顯示文字'
  },
  strokeLinecap: {
    type: String as PropType<Props.StrokeLinecap>,
    required: false,
    default: 'round',
    description: '兩端形狀'
  },
  format: {
    type: [Function, undefined] as PropType<Props.Format>,
    required: false,
    default: undefined,
    description: '格式化顯示文字'
  },
  striped: {
    type: Boolean as PropType<Props.Striped>,
    required: false,
    default: false,
    description: '進度條上顯示條紋'
  },
  stripedFlow: {
    type: Boolean as PropType<Props.StripedFlow>,
    required: false,
    default: false,
    description: '條紋是否流動'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
