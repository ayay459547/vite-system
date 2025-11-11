import type { PropType } from 'vue'

export const version = '__CustomImage_1.0.0__'

export interface Types {}

export interface Props {
  src: string
  fit: '' | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  hideOnClickModal: boolean
  loading: 'eager' | 'lazy'
  lazy: boolean
  scrollContainer: string | HTMLElement
  alt: string
  referrerpolicy: string
  crossorigin: '' | 'anonymous' | 'use-credentials'
  previewSrcList: string[]
  zIndex: number
  initialIndex: number
  closeOnPressEscape: boolean
  previewTeleported: boolean
  infinite: boolean
  zoomRate: number
  minScale: number
  maxScale: number
}
export const props = {
  src: {
    type: String as PropType<Props['src']>,
    required: false,
    default: '',
    description: '圖片網址'
  },
  fit: {
    type: String as PropType<Props['fit']>,
    required: false,
    default: '',
    description: '圖片如何適應容器 css object-fit'
  },
  hideOnClickModal: {
    type: Boolean as PropType<Props['hideOnClickModal']>,
    required: false,
    default: false,
    description: '是否可點及遮罩關閉預覽'
  },
  loading: {
    type: String as PropType<Props['loading']>,
    required: false,
    default: undefined,
    description: '原生屬性 loading'
  },
  lazy: {
    type: Boolean as PropType<Props['lazy']>,
    required: false,
    default: false,
    description: '是否使用懶加載'
  },
  scrollContainer: {
    type: [String, Object] as PropType<Props['scrollContainer']>,
    required: false,
    default: undefined,
    description: '開啟懶加載功能後，監聽滾動事件的容器預設情況下，開啟懶加載功能後，監聽滾動事件的容器'
  },
  alt: {
    type: String as PropType<Props['alt']>,
    required: false,
    default: undefined,
    description: '原生屬性 alt'
  },
  referrerpolicy: {
    type: String as PropType<Props['referrerpolicy']>,
    required: false,
    default: undefined,
    description: '原生屬性 referrerpolicy'
  },
  crossorigin: {
    type: String as PropType<Props['crossorigin']>,
    required: false,
    default: undefined,
    description: '原生屬性 crossorigin'
  },
  previewSrcList: {
    type: Array as PropType<Props['previewSrcList']>,
    required: false,
    default: () => [],
    description: '圖片預覽列表'
  },
  zIndex: {
    type: Number as PropType<Props['zIndex']>,
    required: false,
    default: undefined,
    description: '預覽圖片的 z-index'
  },
  initialIndex: {
    type: Number as PropType<Props['initialIndex']>,
    required: false,
    default: 0,
    description: '預覽圖片的索引值'
  },
  closeOnPressEscape: {
    type: Boolean as PropType<Props['closeOnPressEscape']>,
    required: false,
    default: true,
    description: '是否可使用ESC關閉預覽'
  },
  previewTeleported: {
    type: Boolean as PropType<Props['previewTeleported']>,
    required: false,
    default: false,
    description: 'image-viewer 是否插入至 body 元素上'
  },
  infinite: {
    type: Boolean as PropType<Props['previewTeleported']>,
    required: false,
    default: true,
    description: '是否可無限循環'
  },
  zoomRate: {
    type: Number as PropType<Props['zoomRate']>,
    required: false,
    default: 1.2,
    description: '瀏覽圖片縮放比'
  },
  minScale: {
    type: Number as PropType<Props['minScale']>,
    required: false,
    default: 0.2,
    description: '瀏覽圖片縮放比(最小)'
  },
  maxScale: {
    type: Number as PropType<Props['maxScale']>,
    required: false,
    default: 7,
    description: '瀏覽圖片縮放比(最大)'
  }
}

export interface Emits {
  load: (evt: Event) => void
  error: (evt: Event) => any
  switch: (val: number) => void
  close: () => void
  show: () => void
}

export interface Expose {}
