import type { PropType } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

export const version = '__SimpleFilter_1.0.0__'

export interface Types {}

export interface Props {
  columns: Record<string, any>
  width: string | number
  class: string
  placement: ElPlacement
}

export const props = {
  columns: {
    type: Object as PropType<Props['columns']>,
    default: () => {
      return {}
    },
    required: false
  },
  width: {
    type: [String, Number] as PropType<Props['width']>,
    default: '55vw'
  },
  class: {
    type: String as PropType<Props['class']>,
    default: ''
  },
  placement: {
    type: String as PropType<Props['placement']>,
    default: 'bottom-start'
  }
}

export interface Emits {}

export interface Expose {}
