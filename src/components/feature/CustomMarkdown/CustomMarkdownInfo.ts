import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type Text = string
}

export const props = {
  text: {
    type: String as PropType<Props.Text>,
    default: '',
    description: 'markdown 內容'
  }
}
