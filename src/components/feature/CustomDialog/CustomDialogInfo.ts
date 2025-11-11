import type { PropType } from 'vue'

export const version = '__CustomDialog_1.0.0__'

export interface Types {}

export interface Props {
  modelValue: boolean
  title: string
  width: string | number
  fullscreen: boolean
  top: string
  modal: boolean
  modalClass: string
  appendToBody: boolean
  lockScroll: boolean
  draggable: boolean
}
export const props = {
  modelValue: {
    type: Boolean as PropType<Props['modelValue']>,
    default: false,
    description: 'v-model 綁定是否顯示'
  },
  title: {
    type: String as PropType<Props['title']>,
    default: '',
    description: '標題'
  },
  width: {
    type: [String, Number] as PropType<Props['width']>,
    default: '',
    description: '寬度'
  },
  fullscreen: {
    type: Boolean as PropType<Props['fullscreen']>,
    default: false,
    description: '是否全屏'
  },
  top: {
    type: String as PropType<Props['top']>,
    default: '',
    description: 'dialog CSS 中的 margin-top值'
  },
  modal: {
    type: Boolean as PropType<Props['modal']>,
    default: false,
    description: '是否需要遮罩'
  },
  modalClass: {
    type: String as PropType<Props['modalClass']>,
    default: '',
    description: '自訂遮罩class'
  },
  appendToBody: {
    type: Boolean as PropType<Props['appendToBody']>,
    default: false,
    description: '是否插入至body'
  },
  lockScroll: {
    type: Boolean as PropType<Props['lockScroll']>,
    default: true,
    description: '是否再出現時鎖住 bodey 的 scroll'
  },
  draggable: {
    type: Boolean as PropType<Props['draggable']>,
    default: false,
    description: '是否可拖拉'
  }
}

export interface Emits {}

export interface Expose {}
