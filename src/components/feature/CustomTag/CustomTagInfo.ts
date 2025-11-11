import type { PropType } from 'vue'

import type { CustomSize } from '@/components' // 系統組件
import type { CustomIconProps } from '@/components/feature' // 系統組件: 功能

export const version = '__CustomTag_1.0.0__'

export interface Types {}

export interface Props {
  label: string
  iconType: CustomIconProps['type']
  iconName: string
  iconMove: 'none' | 'translate' | 'rotate' | 'scale'

  type: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  closeable: boolean
  disableTransitions: boolean
  hit: boolean
  color: string | undefined
  size: CustomSize
  effect: 'dark' | 'light' | 'plain'
  round: boolean
}
export const props = {
  // custom
  label: {
    type: String as PropType<Props['label']>,
    required: false,
    default: ''
  },
  iconType: {
    type: String as PropType<Props['iconType']>,
    required: false,
    default: 'fas'
  },
  iconName: {
    type: String as PropType<Props['iconName']>,
    required: false,
    default: ''
  },
  iconMove: {
    type: String as PropType<Props['iconMove']>,
    required: false,
    default: 'none'
  },
  // element plus ui
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'primary'
  },
  closeable: {
    type: Boolean as PropType<Props['closeable']>,
    required: false,
    default: false
  },
  disableTransitions: {
    type: Boolean as PropType<Props['disableTransitions']>,
    required: false,
    default: false
  },
  hit: {
    type: Boolean as PropType<Props['hit']>,
    required: false,
    default: false
  },
  color: {
    type: String as PropType<Props['color']>,
    required: false,
    default: undefined
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: 'default'
  },
  effect: {
    type: String as PropType<Props['effect']>,
    required: false,
    default: 'light'
  },
  round: {
    type: Boolean as PropType<Props['round']>,
    required: false,
    default: false
  }
}

export interface Emits {
  click: (evt: MouseEvent) => void
  close: (evt: MouseEvent) => void
}

export interface Expose {}
