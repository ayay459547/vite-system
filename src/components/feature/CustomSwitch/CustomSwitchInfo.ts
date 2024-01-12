import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-switch__')

export type Size = '' | 'large'| 'default'| 'small'
export type ModelValue = boolean

export const props = {
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    required: true
  },
  style: {
    type: String as PropType<string>,
    default: ''
  },
  activeText: {
    type: String as PropType<string>,
    default: ''
  },
  inactiveText: {
    type: String as PropType<string>,
    default: ''
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  size: {
    type: String as PropType<Size>,
    default: ''
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  }
}
