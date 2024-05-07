import type { PropType, Ref, CSSProperties } from 'vue'

export const version = '1.0.0'

export type AriaOrientation = 'horizontal' | 'vertical'
export type OnScrollParams = { scrollLeft: number; scrollTop: number }

export type HandleScroll = () => void
export type ScrollTo = (options: ScrollToOptions | number, yCoord?: number) => void
export type SetScrollTop = (scrollTop: number) => void
export type SetScrollLeft = (scrollLeft: number) => void
export type Update = () => void
export type WrapRef = () => Ref<HTMLDivElement> | void

export const props = {
  height: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    description: '滾動條高度'
  },
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    description: '滾動條最大高度'
  },
  wrapStyle: {
    type: [Array, String] as PropType<CSSProperties | CSSProperties[] | string[]>,
    required: false,
    default: '',
    description: '容器自訂style'
  },
  wrapClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '容器自訂class'
  },
  viewStyle: {
    type: [Array, String] as PropType<CSSProperties | CSSProperties[] | string[]>,
    required: false,
    default: '',
    description: '視圖自訂style'
  },
  viewClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '視圖自訂class'
  },
  noresize: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否不應容器變化'
  },
  tag: {
    type: String as PropType<string>,
    required: false,
    default: 'div',
    description: '視圖標籤'
  },
  always: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '滾動條是否總是顯示'
  },
  minSize: {
    type: Number as PropType<number>,
    required: false,
    default: 20,
    description: '滾動條最小尺寸'
  },
  id: {
    type: String as PropType<string>,
    required: false,
    description: '視圖id'
  },
  role: {
    type: String as PropType<string>,
    required: false,
    description: '視圖角色'
  },
  ariaLabel: {
    type: String as PropType<string>,
    required: false,
    description: '視圖 aria-label'
  },
  ariaOrientation: {
    type: String as PropType<AriaOrientation>,
    required: false,
    description: '視圖 aria-orientation'
  }
}
