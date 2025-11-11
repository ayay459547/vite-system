import type { PropType, Ref, CSSProperties } from 'vue'

export const version = '__CustomScrollbar_1.0.0__'

export interface Types {
  style: CSSProperties | CSSProperties[] | string[]
  onScrollParams: {
    scrollLeft: number
    scrollTop: number
  }
}

export interface Props {
  height: string | number
  maxHeight: string | number
  native: boolean
  wrapStyle: Types['style']
  wrapClass: string
  viewStyle: Types['style']
  viewClass: string
  noresize: boolean
  tag: string
  always: boolean
  minSize: number
  id: string
  role: string
  ariaLabel: string
  ariaOrientation: 'horizontal' | 'vertical'
  tabindex: number | string
}
export const props = {
  height: {
    type: [String, Number] as PropType<Props['height']>,
    required: false,
    default: undefined,
    description: '滾動條高度'
  },
  maxHeight: {
    type: [String, Number] as PropType<Props['maxHeight']>,
    required: false,
    default: undefined,
    description: '滾動條最大高度'
  },
  native: {
    type: Boolean as  PropType<Props['native']>,
    required: false,
    default: false,
    description: '是否採用原有捲軸樣式'
  },
  wrapStyle: {
    type: [Array, String] as PropType<Props['wrapStyle']>,
    required: false,
    default: undefined,
    description: '容器自訂style'
  },
  wrapClass: {
    type: String as PropType<Props['wrapClass']>,
    required: false,
    default: undefined,
    description: '容器自訂class'
  },
  viewStyle: {
    type: [Array, String] as PropType<Props['viewStyle']>,
    required: false,
    default: undefined,
    description: '視圖自訂style'
  },
  viewClass: {
    type: String as PropType<Props['viewClass']>,
    required: false,
    default: undefined,
    description: '視圖自訂class'
  },
  noresize: {
    type: Boolean as PropType<Props['noresize']>,
    required: false,
    default: false,
    description: '是否不應容器變化'
  },
  tag: {
    type: String as PropType<Props['tag']>,
    required: false,
    default: 'div',
    description: '視圖標籤'
  },
  always: {
    type: Boolean as PropType<Props['always']>,
    required: false,
    default: false,
    description: '滾動條是否總是顯示'
  },
  minSize: {
    type: Number as PropType<Props['minSize']>,
    required: false,
    default: 20,
    description: '滾動條最小尺寸'
  },
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: '視圖id'
  },
  role: {
    type: String as PropType<Props['role']>,
    required: false,
    default: undefined,
    description: '視圖角色'
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '視圖 aria-label'
  },
  ariaOrientation: {
    type: String as PropType<Props['ariaOrientation']>,
    required: false,
    default: undefined,
    description: '視圖 aria-orientation'
  },
  tabindex: {
    type: [String, Number] as PropType<Props['tabindex']>,
    required: false,
    default: undefined,
    description: '容器的tabindex'
  }
}

export interface Emits {
  scroll: ($event: Types['onScrollParams']) => void
}

export interface Expose {
  handleScroll: () => void
  scrollTo: (options: ScrollToOptions | number, yCoord?: number) => void
  setScrollTop: (scrollTop: number) => void
  setScrollLeft: (scrollLeft: number) => void
  update: () => void
  wrapRef: () => Ref<HTMLDivElement> | void
}
