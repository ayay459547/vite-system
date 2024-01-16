import type { PropType } from 'vue'

export const version = '1.0.0'

export type ImageFit = '' | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
export type ImageLoading = 'eager' | 'lazy'

export const props = {
  src: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '圖片網址'
  },
  fit: {
    type: String as PropType<ImageFit>,
    required: false,
    default: '',
    description: '圖片如何適應容器 css object-fit'
  },
  alt: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '原生屬性 alt'
  },
  loading: {
    type: String as PropType<ImageLoading>,
    required: false,
    description: '原生屬性 loading'
  },
  referrerpolicy: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '原生屬性 referrerpolicy'
  },
  zoomRate: {
    type: Number as PropType<number>,
    required: false,
    default: 1.2,
    description: '瀏覽圖片縮放比'
  },
  initialIndex: {
    type: Number as PropType<number>,
    default: 0,
    description: '預覽圖片的索引值'
  },
  previewSrcList: {
    type: Array as PropType<string[]>,
    required: false,
    default () {
      return []
    },
    description: '圖片預覽列表'
  },
  hideOnClickModal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可點及遮罩關閉預覽'
  },
  previewTeleported: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: 'image-viewer 是否插入至 body 元素上'
  }
}
