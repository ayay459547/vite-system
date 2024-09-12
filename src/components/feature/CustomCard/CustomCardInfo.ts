import type { CSSProperties, PropType } from 'vue'

export const version = '__CustomCard_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Header = string
  type Footer = string
  type BodyStyle = CSSProperties
  type BodyClass = string
  type Shadow = 'always' | 'never' | 'hover'
}
export const props = {
  header: {
    type: String as PropType<Props.Header>,
    required: false,
    default: '',
    description: '標題'
  },
  footer: {
    type: String as PropType<Props.Footer>,
    required: false,
    default: '',
    description: '頁尾文字'
  },
  bodyStyle: {
    type: Object as PropType<Props.BodyStyle>,
    required: false,
    default: () => {
      return {}
    },
    description: 'body 的自訂 Style CSSProperties'
  },
  bodyClass: {
    type: String as PropType<Props.BodyClass>,
    required: false,
    default: '',
    description: 'body 的自訂 Class 名稱'
  },
  shadow: {
    type: String as PropType<Props.Shadow>,
    required: false,
    default: 'hover',
    description: '卡片陰影顯示時機'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
