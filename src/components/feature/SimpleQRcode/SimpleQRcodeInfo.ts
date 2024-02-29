import type { PropType } from 'vue'

export const version = '1.0.0'

export const props = {
  text: {
    type: String as PropType<string>,
    required: true,
    description: 'text'
  },
  width: {
    type: String as PropType<string>,
    required: false,
    default: '200px',
    description: 'style width'
  },
  height: {
    type: String as PropType<string>,
    required: false,
    default: '200px',
    description: 'style height'
  },
  bgSrc: {
    type: String as PropType<string>,
    required: false,
    default: null,
    description: '背景圖片 src'
  },
  logoSrc: {
    type: String as PropType<string>,
    required: false,
    default: null,
    description: '中心logo src'
  }
}
