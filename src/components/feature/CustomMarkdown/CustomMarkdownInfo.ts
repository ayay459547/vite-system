import type { PropType } from 'vue'

export const version = '__CustomMarkdown_1.0.0__'

export declare namespace Types {}

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

export declare namespace Emits {}

export declare namespace Expose {}
