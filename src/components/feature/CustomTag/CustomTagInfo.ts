import type { PropType } from 'vue'

import type { IconType } from '@/components'

export const version = '1.0.0'

export type TagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type TagSize = 'large' | 'default' | 'small'
export type TagEffect = 'dark' | 'light' | 'plain'

export enum ElType {
  primary = 'primary',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger'
}

export enum ElSize {
  large = 'large',
  default = 'default',
  small = 'small'
}

export enum FontIconType {
  fas = 'fas',
  far = 'far',
  fab = 'fab'
}

export const props = {
  label: {
    type: String as PropType<string>,
    required: false,
    default: 'primary'
  },
  type: {
    type: String as PropType<TagType>,
    required: false,
    default: 'default'
  },
  closeable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  disableTransitions: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  hit: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  color: {
    type: String as PropType<string | undefined>,
    required: false,
    default: undefined
  },
  size: {
    type: String as PropType<TagSize>,
    required: false,
    default: 'default'
  },
  effect: {
    type: String as PropType<TagEffect>,
    required: false,
    default: 'light'
  },
  round: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  iconType: {
    type: String as PropType<IconType>,
    required: false,
    default: 'fas'
  },
  iconName: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  iconMove: {
    type: String as PropType<'none' | 'translate' | 'rotate' | 'scale'>,
    required: false,
    default: 'none'
  }
}
