import type { PropType } from 'vue'

export const version = '1.0.0'

export const props = {
  text: {
    type: String as PropType<string>,
    default: '',
    description: 'markdown 內容'
  }
}
