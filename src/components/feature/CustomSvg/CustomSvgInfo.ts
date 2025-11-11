import type { PropType } from 'vue'

export const version = '__CustomSvg_1.0.0__'

export interface Types {}

export interface Props {
  name: string
}
export const props = {
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: '',
    description: '圖示名稱'
  }
}

export interface Emits {}

export interface Expose {}
