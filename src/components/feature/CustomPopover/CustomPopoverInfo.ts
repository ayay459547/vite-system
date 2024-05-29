import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type Visible = boolean | null
  type Width = number | string
  type Title = string
  type Placement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
  type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'
  type PopperStyle = string
  type ShowArrow = boolean
  type Offset = number
}

export const props = {
  visible: {
    type: Boolean as PropType<Props.Visible>,
    required: false,
    default: null,
    description: '是否顯示'
  },
  width: {
    type: [Number, String] as PropType<Props.Width>,
    required: false,
    default: 150,
    description: '寬度'
  },
  title: {
    type: String as PropType<Props.Title>,
    required: false,
    default: '',
    description: '標題'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'bottom',
    description: '顯示位置'
  },
  trigger: {
    type: String as PropType<Props.Trigger>,
    required: false,
    default: 'click',
    description: '觸發方式'
  },
  popperStyle: {
    type: String as PropType<Props.PopperStyle>,
    required: false,
    default: '',
    description: '樣式'
  },
  showArrow: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: false,
    default: true,
    description: '是否顯示箭頭'
  },
  offset: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 0,
    description: '定位偏移量'
  }
}
