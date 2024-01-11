import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-markdown__')

export const props = {
  text: {
    type: String as PropType<string>,
    default: '',
    description: 'markdown 內容'
  }
}
