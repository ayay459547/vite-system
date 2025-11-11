import type { PropType } from 'vue'

export const version = '__CustomEmpty_1.0.0__'

export interface Types {}

export interface Props {
  image: string
  imageSize: number
  description: string
}
export const props = {
  image: {
    type: String as PropType<Props['image']>,
    required: false,
    default: '',
    description: '圖片的 url'
  },
  imageSize: {
    type: Number as PropType<Props['imageSize']>,
    required: false,
    description: '圖片 寬度 width'
  },
  description: {
    type: String as PropType<Props['description']>,
    required: false,
    default: '',
    description: '文字訊息'
  }
}

export interface Emits {}

export interface Expose {}
