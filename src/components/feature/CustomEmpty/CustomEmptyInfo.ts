import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Custom {}

export declare namespace Props {
  type Image = string
  type ImageSize = number
  type Description = string
}

export const props = {
  image: {
    type: String as PropType<Props.Image>,
    required: false,
    default: '',
    description: '圖片的 url'
  },
  imageSize: {
    type: Number as PropType<Props.ImageSize>,
    required: false,
    description: '圖片 寬度 width'
  },
  description: {
    type: String as PropType<Props.Description>,
    required: false,
    default: '',
    description: '文字訊息'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
