import type { PropType } from 'vue'

export const version = '1.0.0'

export const props = {
  text: {
    type: String as PropType<string>,
    required: true,
    description: 'text'
  },
  size: {
    type: Number as PropType<number>,
    required: false,
    default: 200,
    description: 'qucode size'
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
