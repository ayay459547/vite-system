import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-divider__')

export type DividerDirection = 'horizontal' | 'vertical'

export type DividerBorderStyle = 'none'| 'hidden'| 'dotted'| 'dashed'| 'solid'| 'double'| 'groove'| 'ridge'| 'inset'| 'outset'

export type DividerContentPosition = 'left' | 'right' | 'center'

export const props = {
  direction: {
    type: String as PropType<DividerDirection>,
    required: false,
    default: 'horizontal',
    description: `horizontal: 橫線
    vertical: 直線`
  },
  borderStyle: {
    type: String as PropType<DividerBorderStyle>,
    required: false,
    default: 'solid',
    description: `線的類型
      css border 的 style`
  },
  contentPosition: {
    type: String as PropType<DividerContentPosition>,
    required: false,
    default: 'center',
    description: '文字位置'
  }
}
