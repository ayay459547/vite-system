import type { PropType } from 'vue'

export const version = '__CustomDivider_1.0.0__'

export interface Types {}

export interface Props {
  direction: 'horizontal' | 'vertical'
  borderStyle: 'none' | 'hidden'
    | 'dotted' | 'dashed' | 'solid' | 'double'
    | 'groove' | 'ridge' | 'inset' | 'outset'
  contentPosition: 'left' | 'right' | 'center'
}

export const props = {
  direction: {
    type: String as PropType<Props['direction']>,
    required: false,
    default: 'horizontal',
    description: `方向
      horizontal: 水平
      vertical: 垂直`
  },
  borderStyle: {
    type: String as PropType<Props['borderStyle']>,
    required: false,
    default: 'solid',
    description: `線的類型
      css border 的 style
    `
  },
  contentPosition: {
    type: String as PropType<Props['contentPosition']>,
    required: false,
    default: 'center',
    description: '文字位置'
  }
}

export interface Emits {}

export interface Expose {}
