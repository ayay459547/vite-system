import type { PropType } from 'vue'

import type { CustomSize } from '@/components' // 系統組件

export const version = '__CustomText_1.0.0__'

export interface Types {}

export interface Props {
  type: '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  size: CustomSize
  truncated: boolean
  lineClamp: number
  tag: string

  label: string
}
export const props = {
  // Element UI
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: undefined,
    description: '類型'
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '尺寸'
  },
  truncated: {
    type: Boolean as PropType<Props['truncated']>,
    required: false,
    default: false,
    description: '顯示省略號'
  },
  lineClamp: {
    type: Number as PropType<Props['lineClamp']>,
    required: false,
    default: undefined,
    description: '最大行數'
  },
  tag: {
    type: String as PropType<Props['tag']>,
    required: false,
    default: 'span',
    description: '自訂元素標籤'
  },
  // Custom
  label: {
    type: String as PropType<Props['label']>,
    required: false,
    default: '',
    description: '文字'
  }
}

export interface Emits {}

export interface Expose {}
