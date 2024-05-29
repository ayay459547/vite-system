import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type Src = string
  type Fit = '' | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  type Alt = string
  type Loading = 'eager' | 'lazy'
  type Referrerpolicy = string
  type ZoomRate = number
  type InitialIndex = number
  type PreviewSrcList = string[]
  type HideOnClickModal = boolean
  type PreviewTeleported = boolean
}

export const props = {
  src: {
    type: String as PropType<Props.Src>,
    required: false,
    default: '',
    description: '圖片網址'
  },
  fit: {
    type: String as PropType<Props.Fit>,
    required: false,
    default: '',
    description: '圖片如何適應容器 css object-fit'
  },
  alt: {
    type: String as PropType<Props.Alt>,
    required: false,
    default: '',
    description: '原生屬性 alt'
  },
  loading: {
    type: String as PropType<Props.Loading>,
    required: false,
    description: '原生屬性 loading'
  },
  referrerpolicy: {
    type: String as PropType<Props.Fit>,
    required: false,
    default: '',
    description: '原生屬性 referrerpolicy'
  },
  zoomRate: {
    type: Number as PropType<Props.ZoomRate>,
    required: false,
    default: 1.2,
    description: '瀏覽圖片縮放比'
  },
  initialIndex: {
    type: Number as PropType<Props.InitialIndex>,
    default: 0,
    description: '預覽圖片的索引值'
  },
  previewSrcList: {
    type: Array as PropType<Props.PreviewSrcList>,
    required: false,
    default() {
      return []
    },
    description: '圖片預覽列表'
  },
  hideOnClickModal: {
    type: Boolean as PropType<Props.HideOnClickModal>,
    required: false,
    default: false,
    description: '是否可點及遮罩關閉預覽'
  },
  previewTeleported: {
    type: Boolean as PropType<Props.PreviewTeleported>,
    required: false,
    default: false,
    description: 'image-viewer 是否插入至 body 元素上'
  }
}

type EventError = Error
export declare namespace Emits {
  type Load = (e: Event) => void
  type Error = (e: EventError) => void
  type Switch = (e: number) => void
  type Close = () => void
  type Show = () => void
}
