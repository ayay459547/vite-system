import type { PropType } from 'vue'

export const version = '1.0.0'

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
export type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'

export declare namespace Props {
  type Visible = boolean | null
  type PopperClass = string
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
  placement: {
    type: String as PropType<Placement>,
    required: false,
    default: 'bottom',
    description: '顯示位置'
  },
  trigger: {
    type: String as PropType<Trigger>,
    required: false,
    default: 'hover',
    description: '觸發方式'
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: '',
    description: 'class'
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
