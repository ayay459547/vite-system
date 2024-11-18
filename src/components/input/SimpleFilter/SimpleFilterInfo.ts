import type { PropType } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

export const version = '1.0.0'

export declare namespace Types {}

export declare namespace Props {
  type Columns = Record<string, any>
  type Width = string | number
  type Class = string
  type Placement = ElPlacement
}

export const props = {
  columns: {
    type: Object as PropType<Props.Columns>,
    default: () => {
      return {}
    },
    required: false
  },
  width: {
    type: [String, Number] as PropType<Props.Width>,
    default: '55vw'
  },
  class: {
    type: String as PropType<Props.Class>,
    default: ''
  },
  placement: {
    type: String as PropType<Props.Placement>,
    default: 'bottom-start'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
