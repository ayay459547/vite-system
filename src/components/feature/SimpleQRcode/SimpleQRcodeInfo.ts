import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Custom {}

export declare namespace Props {
  type Text = string
  type Size = number
  type BgSrc = string
  type LogoSrc = string
}

export const props = {
  text: {
    type: String as PropType<Props.Text>,
    required: true,
    description: 'text'
  },
  size: {
    type: Number as PropType<Props.Size>,
    required: false,
    default: 200,
    description: 'qucode size'
  },
  bgSrc: {
    type: String as PropType<Props.BgSrc>,
    required: false,
    default: null,
    description: '背景圖片 src'
  },
  logoSrc: {
    type: String as PropType<Props.LogoSrc>,
    required: false,
    default: null,
    description: '中心logo src'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
