import type { PropType } from 'vue'

import type { CustomButtonProps } from '@/components/feature' // 系統組件: 功能

export const version = '__CustomButtonGroup_1.0.0__'

export interface Types {}

export interface Props {
  size: CustomButtonProps['size']
  type: CustomButtonProps['type']
}
export const props = {
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '尺寸'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: undefined,
    description: '類型'
  }
}

export interface Emits {}

export interface Expose {}
