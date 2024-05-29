import type { PropType } from 'vue'

import type { CustomSize, IconProps } from '@/components'

export const version = '1.0.0'

export declare namespace Props {
  type Label = string
  type Type = 'primary' | 'success' | 'info' | 'warning' | 'danger'
  type Closeable = boolean
  type DisableTransitions = boolean
  type Hit = boolean
  type Color = string | undefined
  type Size = CustomSize
  type Effect = 'dark' | 'light' | 'plain'
  type Round = boolean
  type IconType = IconProps.Type
  type IconName = string
  type IconMove = 'none' | 'translate' | 'rotate' | 'scale'
}

export const props = {
  label: {
    type: String as PropType<Props.Label>,
    required: false,
    default: ''
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'default'
  },
  closeable: {
    type: Boolean as PropType<Props.Closeable>,
    required: false,
    default: false
  },
  disableTransitions: {
    type: Boolean as PropType<Props.DisableTransitions>,
    required: false,
    default: false
  },
  hit: {
    type: Boolean as PropType<Props.Hit>,
    required: false,
    default: false
  },
  color: {
    type: String as PropType<Props.Color>,
    required: false,
    default: undefined
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: 'default'
  },
  effect: {
    type: String as PropType<Props.Effect>,
    required: false,
    default: 'light'
  },
  round: {
    type: Boolean as PropType<Props.Round>,
    required: false,
    default: false
  },
  iconType: {
    type: String as PropType<Props.IconType>,
    required: false,
    default: 'fas'
  },
  iconName: {
    type: String as PropType<Props.IconName>,
    required: false,
    default: ''
  },
  iconMove: {
    type: String as PropType<Props.IconMove>,
    required: false,
    default: 'none'
  }
}

export declare namespace Emits {
  type Click = ($event: Event) => void
}
