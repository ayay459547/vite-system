import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-popover__')

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
export type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'

export declare namespace Props {
  type Visible = boolean | null
  type Width = number | string
  type Title = string
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
    type: Number as PropType<Props.Width>,
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
    type: String as PropType<Placement>,
    required: false,
    default: 'bottom',
    description: '顯示位置'
  },
  trigger: {
    type: String as PropType<Trigger>,
    required: false,
    default: 'click',
    description: '觸發方式'
  },
  popperStyle: {
    type: String as PropType<Props.PopperStyle>,
    required: false,
    default: 'click',
    description: '觸發方式'
  },
  showArrow: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: true,
    default: null,
    description: '是否顯示箭頭'
  },
  offset: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 0,
    description: '定位偏移量'
  }
}
