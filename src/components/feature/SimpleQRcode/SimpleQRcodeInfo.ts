import type { PropType } from 'vue'

export const version = '__SimpleQRcode_1.0.0__'

export interface Types {}

export interface Props {
  text: string
  size: number
  bgSrc: string
  logoSrc: string
}
export const props = {
  text: {
    type: String as PropType<Props['text']>,
    required: true,
    description: 'text'
  },
  size: {
    type: Number as PropType<Props['size']>,
    required: false,
    default: 200,
    description: 'qucode size'
  },
  bgSrc: {
    type: String as PropType<Props['bgSrc']>,
    required: false,
    default: null,
    description: '背景圖片 src'
  },
  logoSrc: {
    type: String as PropType<Props['logoSrc']>,
    required: false,
    default: null,
    description: '中心logo src'
  }
}

export interface Emits {}

export interface Expose {}
