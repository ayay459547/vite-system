import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-badge__')

export type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export const props = {
  value: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: '',
    description: '顯示的值'
  },
  max: {
    type: Number as PropType<number>,
    required: false,
    default: 99,
    description: '最大值'
  },
  isDot: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示小圓點'
  },
  hidden: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否隱藏標記'
  },
  type: {
    type: String as PropType<BadgeType>,
    required: false,
    default: 'primary',
    description: '類型'
  }
}
