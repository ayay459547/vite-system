import type { PropType } from 'vue'

export const version = '__CustomLockView_1.0.0__'

export interface Types {}

export interface Props {
  isLock: boolean
  description: string
}
export const props = {
  isLock: {
    type: Boolean as PropType<Props['isLock']>,
    required: false,
    default: false,
    description: '是否鎖定'
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
