import type { PropType } from 'vue'

import type { PopoverProps } from '@/components'

export const version = '1.0.0'

export const props = {
  columns: {
    type: Object as PropType<Record<string, any>>,
    default: () => {
      return {}
    },
    required: false
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '55vw'
  },
  class: {
    type: String as PropType<string>,
    default: ''
  },
  placement: {
    type: String as PropType<PopoverProps.Placement>,
    default: 'bottom-start'
  }
}
