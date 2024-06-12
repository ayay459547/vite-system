import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type LeftWidth = number | null
  type DraggablePosition = 'left' | 'right' |'center' | 'custom'
}

export const props = {
  leftWidth: {
    type: [Number, null] as PropType<Props.LeftWidth>,
    required: false,
    default: null,
    description: '左邊預設大小 單位(px)'
  },
  position: {
    type: String as PropType<Props.DraggablePosition>,
    required: false,
    default: 'center',
    description: '分割線的位置'
  }
}