import type { PropType } from 'vue'

export const version = '__CustomDialog_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type ModelValue = boolean
  type Title = string
  type Width = string | number
  type Fullscreen = boolean
  type Top = string
  type Modal = boolean
  type ModalClass = string
  type AppendToBody = boolean
  type LockScroll = boolean
  type Draggable = boolean
}
export const props = {
  modelValue: {
    type: Boolean as PropType<Props.ModelValue>,
    default: false,
    description: 'v-model 綁定是否顯示'
  },
  title: {
    type: String as PropType<Props.Title>,
    default: '',
    description: '標題'
  },
  width: {
    type: [String, Number] as PropType<Props.Width>,
    default: '',
    description: '寬度'
  },
  fullscreen: {
    type: Boolean as PropType<Props.Fullscreen>,
    default: false,
    description: '是否全屏'
  },
  top: {
    type: String as PropType<Props.Top>,
    default: '',
    description: 'dialog CSS 中的 margin-top值'
  },
  modal: {
    type: Boolean as PropType<Props.Modal>,
    default: false,
    description: '是否需要遮罩'
  },
  modalClass: {
    type: String as PropType<Props.ModalClass>,
    default: '',
    description: '自訂遮罩class'
  },
  appendToBody: {
    type: Boolean as PropType<Props.AppendToBody>,
    default: false,
    description: '是否插入至body'
  },
  lockScroll: {
    type: Boolean as PropType<Props.LockScroll>,
    default: true,
    description: '是否再出現時鎖住 bodey 的 scroll'
  },
  draggable: {
    type: Boolean as PropType<Props.Draggable>,
    default: false,
    description: '是否可拖拉'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
