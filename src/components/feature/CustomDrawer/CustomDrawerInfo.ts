import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Props {
  type ModelValue = boolean
  type Direction = 'rtl' | 'ltr' | 'ttb' | 'btt'
  type Title = string
  type DestroyOnClose = boolean
  type CustomClass = string
  type Modal = boolean
  type ModalClass = string
  type Size = number | string
}

export const props = {
  modelValue: {
    type: Boolean as PropType<Props.ModelValue>,
    default: false,
    description: '是否顯示'
  },
  direction: {
    type: String as PropType<Props.Direction>,
    default: 'rtl',
    description: '打開方向'
  },
  title: {
    type: String as PropType<Props.Title>,
    default: '',
    description: '標題'
  },
  destroyOnClose: {
    type: Boolean as PropType<Props.DestroyOnClose>,
    default: false,
    description: '是否在關閉抽屜之後將子元素全部銷毀'
  },
  customClass: {
    type: String as PropType<Props.CustomClass>,
    default: '',
    description: 'Drawer自訂class'
  },
  modal: {
    type: Boolean as PropType<Props.Modal>,
    default: true,
    description: '是否需要遮罩'
  },
  modalClass: {
    type: String as PropType<Props.ModalClass>,
    default: '',
    description: '遮罩自訂class'
  },
  size: {
    type: [Number, String] as PropType<Props.Size>,
    default: '',
    description: '視窗大小'
  }
}
