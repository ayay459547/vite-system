import type { Component, PropType } from 'vue'

import type { CustomSize } from '@/components' // 系統組件

export const version = '__CustomText_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Size = CustomSize
  type Type = '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  type Truncated = boolean
  type LineClamp = number
  type Tag = string | Component

  type Label = string
}
export const props = {
  // Element UI
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: undefined,
    description: '類型'
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '尺寸'
  },
  truncated: {
    type: Boolean as PropType<Props.Truncated>,
    required: false,
    default: false,
    description: '顯示省略號'
  },
  lineClamp: {
    type: Number as PropType<Props.LineClamp>,
    required: false,
    default: undefined,
    description: '最大行數'
  },
  tag: {
    type: [String, Object] as PropType<Props.Tag>,
    required: false,
    default: 'span',
    description: '自訂元素標籤'
  },
  // Custom
  label: {
    type: String as PropType<Props.Label>,
    required: false,
    default: '',
    description: '文字'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
