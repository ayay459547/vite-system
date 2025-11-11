import type { PropType } from 'vue'

export const version = '__CustomDividerView_1.0.0__'

export interface Types {}

export interface Props {
  leftWidth: number | null
  draggablePosition: 'left' | 'right' |'center' | 'custom'
}

export const props = {
  leftWidth: {
    type: [Number, null] as PropType<Props['leftWidth']>,
    required: false,
    default: null,
    description: '左邊預設大小 單位(px)'
  },
  position: {
    type: String as PropType<Props['draggablePosition']>,
    required: false,
    default: 'center',
    description: '分割線的位置'
  }
}

export interface Emits {
  change: () => void
}

export interface Expose {
  initDefaultCenter: () => void
}
