import type { CSSProperties, PropType } from 'vue'

export const version = '1.0.0'

export type CardShadow = 'always' | 'never' | 'hover'

export enum ElShadow {
  always = 'always',
  never = 'never',
  hover = 'hover'
}

export const props = {
  header: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '標題'
  },
  footer: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '頁尾文字'
  },
  bodyStyle: {
    type: Object as PropType<CSSProperties>,
    required: false,
    default: () => {
      return {}
    },
    description: 'body 的自訂 Style CSSProperties'
  },
  bodyClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: 'body 的自訂 Class 名稱'
  },
  shadow: {
    type: String as PropType<CardShadow>,
    required: false,
    default: 'hover',
    description: '卡片陰影顯示時機'
  }
}
