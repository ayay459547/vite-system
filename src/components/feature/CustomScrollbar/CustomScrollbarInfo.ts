import type { PropType, Ref, CSSProperties } from 'vue'

export const version = '1.0.0'

export type OnScrollParams = { scrollLeft: number; scrollTop: number }

export type HandleScroll = () => void
export type ScrollTo = (options: ScrollToOptions | number, yCoord?: number) => void
export type SetScrollTop = (scrollTop: number) => void
export type SetScrollLeft = (scrollLeft: number) => void
export type Update = () => void
export type WrapRef = () => Ref<HTMLDivElement> | void


export declare namespace Props {
  type Height = string | number
  type MaxHeight = string | number
  type WrapStyle = CSSProperties | CSSProperties[] | string[]
  type WrapClass = string
  type ViewStyle = CSSProperties | CSSProperties[] | string[]
  type ViewClass = string
  type Noresize = boolean
  type Tag = string
  type Always = boolean
  type MinSize = number
  type Id = string
  type Role = string
  type AriaLabel = string
  type AriaOrientation = 'horizontal' | 'vertical'
}

export const props = {
  height: {
    type: [String, Number] as PropType<Props.Height>,
    required: false,
    description: '滾動條高度'
  },
  maxHeight: {
    type: [String, Number] as PropType<Props.MaxHeight>,
    required: false,
    description: '滾動條最大高度'
  },
  wrapStyle: {
    type: [Array, String] as PropType<Props.WrapStyle>,
    required: false,
    default: '',
    description: '容器自訂style'
  },
  wrapClass: {
    type: String as PropType<Props.WrapClass>,
    required: false,
    default: '',
    description: '容器自訂class'
  },
  viewStyle: {
    type: [Array, String] as PropType<Props.ViewStyle>,
    required: false,
    default: '',
    description: '視圖自訂style'
  },
  viewClass: {
    type: String as PropType<Props.ViewClass>,
    required: false,
    default: '',
    description: '視圖自訂class'
  },
  noresize: {
    type: Boolean as PropType<Props.Noresize>,
    required: false,
    default: false,
    description: '是否不應容器變化'
  },
  tag: {
    type: String as PropType<Props.Tag>,
    required: false,
    default: 'div',
    description: '視圖標籤'
  },
  always: {
    type: Boolean as PropType<Props.Always>,
    required: false,
    default: false,
    description: '滾動條是否總是顯示'
  },
  minSize: {
    type: Number as PropType<Props.MinSize>,
    required: false,
    default: 20,
    description: '滾動條最小尺寸'
  },
  id: {
    type: String as PropType<Props.Id>,
    required: false,
    description: '視圖id'
  },
  role: {
    type: String as PropType<Props.Role>,
    required: false,
    description: '視圖角色'
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    description: '視圖 aria-label'
  },
  ariaOrientation: {
    type: String as PropType<Props.AriaOrientation>,
    required: false,
    description: '視圖 aria-orientation'
  }
}
