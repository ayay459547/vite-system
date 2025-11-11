import type { CSSProperties, PropType } from 'vue'

export const version = '__CustomCard_1.0.0__'

export interface Types {}

export interface Props {
  header: string
  footer: string
  bodyStyle: CSSProperties
  bodyClass: string
  shadow: 'always' | 'never' | 'hover'
}
export const props = {
  header: {
    type: String as PropType<Props['header']>,
    required: false,
    default: '',
    description: '標題'
  },
  footer: {
    type: String as PropType<Props['footer']>,
    required: false,
    default: '',
    description: '頁尾文字'
  },
  bodyStyle: {
    type: Object as PropType<Props['bodyStyle']>,
    required: false,
    default: () => {
      return {}
    },
    description: 'body 的自訂 Style CSSProperties'
  },
  bodyClass: {
    type: String as PropType<Props['bodyClass']>,
    required: false,
    default: '',
    description: 'body 的自訂 Class 名稱'
  },
  shadow: {
    type: String as PropType<Props['shadow']>,
    required: false,
    default: 'hover',
    description: '卡片陰影顯示時機'
  }
}

export interface Emits {}

export interface Expose {}
