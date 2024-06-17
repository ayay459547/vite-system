import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type IsLock = boolean
  type Description = string
}

export const props = {
  isLock: {
    type: Boolean as PropType<Props.IsLock>,
    required: false,
    default: false,
    description: '是否鎖定'
  },
  description: {
    type: String as PropType<Props.Description>,
    required: false,
    default: '',
    description: '文字訊息'
  }
}
