import type { PropType } from 'vue'
import type { BackgroundProps } from '@vue-flow/background'

export const version = '__FlowBackground_1.0.0__'

export interface Types {}

export interface Props {
  id: BackgroundProps['id']
  variant: BackgroundProps['variant']
  gap: BackgroundProps['gap']
  size: BackgroundProps['size']
  color: BackgroundProps['color']
  x: BackgroundProps['x']
  y: BackgroundProps['y']
  offset: BackgroundProps['offset']
}

/**
 * https://vueflow.dev/guide/components/background.html
 */
export const props = {
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: '唯一值'
  },
  variant: {
    type: String as PropType<Props['variant']>,
    required: false,
    default: undefined,
    description: 'The background pattern variant'
  },
  gap: {
    type: [Number, Array] as PropType<Props['gap']>,
    required: false,
    default: undefined,
    description: 'Background pattern gap'
  },
  size: {
    type: Number as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: 'Background pattern size'
  },
  color: {
    type: String as PropType<Props['color']>,
    required: false,
    default: undefined,
    description: 'Background pattern color'
  },
  x: {
    type: Number as PropType<Props['x']>,
    required: false,
    default: undefined,
    description: 'Background x-coordinate (offset x)'
  },
  y: {
    type: Number as PropType<Props['y']>,
    required: false,
    default: undefined,
    description: 'Background y-coordinate (offset y)'
  },
  offset: {
    type: [Number, Array] as PropType<Props['offset']>,
    required: false,
    default: undefined,
    description: 'Background offset'
  }
}

export interface Emits {}

export interface Expose {}
