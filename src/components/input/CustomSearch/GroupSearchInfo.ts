import type { PropType } from 'vue'

export const version = '__GroupSearch_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Columns = Record<string, Record<string, any>>
  type Class = string
  type Size = string | number
}

export const props = {
  columns: {
    type: Object as PropType<Props.Columns>,
    default: () => {
      return {}
    },
    required: false
  },
  class: {
    type: String as PropType<Props.Class>,
    default: ''
  },
  size: {
    type: [String, Number] as PropType<Props.Size>,
    default: 360
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
