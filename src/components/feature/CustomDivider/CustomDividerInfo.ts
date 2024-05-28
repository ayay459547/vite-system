import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type Direction = 'horizontal' | 'vertical'
  type BorderStyle =
    | 'none'
    | 'hidden'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset'
  type ContentPosition = 'left' | 'right' | 'center'
}

export const props = {
  direction: {
    type: String as PropType<Props.Direction>,
    required: false,
    default: 'horizontal',
    description: `
      horizontal: 橫線
      vertical: 直線`
  },
  borderStyle: {
    type: String as PropType<Props.BorderStyle>,
    required: false,
    default: 'solid',
    description: `
      線的類型
      css border 的 style`
  },
  contentPosition: {
    type: String as PropType<Props.ContentPosition>,
    required: false,
    default: 'center',
    description: '文字位置'
  }
}
