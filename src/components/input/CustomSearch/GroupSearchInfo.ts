import type { PropType } from 'vue'

export const version = '__GroupSearch_1.0.0__'

export interface Types {}

export interface Props {
  columns: Record<string, Record<string, any>>
  class: string
  size: string | number
}

export const props = {
  columns: {
    type: Object as PropType<Props['columns']>,
    default: () => {
      return {}
    },
    required: false
  },
  class: {
    type: String as PropType<Props['class']>,
    default: ''
  },
  size: {
    type: [String, Number] as PropType<Props['size']>,
    default: 360
  }
}

export interface Emits {}

export interface Expose {}
