import type { PropType } from 'vue'

export const version = '1.0.0'

export const props = {
  columns: {
    type: Object as PropType<Record<string, Record<string, any>>>,
    default: () => {
      return {}
    },
    required: false
  },
  class: {
    type: String as PropType<string>,
    default: ''
  },
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 360
  }
}
