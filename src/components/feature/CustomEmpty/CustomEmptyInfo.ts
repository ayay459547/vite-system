import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-empty__')

export const props = {
  image: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '圖片的 url'
  },
  imageSize: {
    type: Number as PropType<number>,
    required: false,
    description: '圖片 寬度 width'
  },
  description: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '文字訊息'
  }
}
