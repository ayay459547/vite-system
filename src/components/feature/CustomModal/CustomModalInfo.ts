import type { PropType } from 'vue'

export const version = '1.0.0'

export const minModalIndex = 2005

type Size = 'fill' | 'large'| 'default'| 'small' | 'extraSmall' | 'fitContent'
export type WidthSize = Size
export type HeightSize = Size
export type ModelValue = boolean
export type XPosition = 'start' | 'center' | 'end'
export type YPosition = 'top' | 'center' | 'bottom'

export const props = {
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    default: false,
    description: 'v-model 綁定是否顯示'
  },
  isKeepAlive: {
    type: Boolean as PropType<ModelValue>,
    default: false,
    description: `是否暫存
      true: v-show
      false: v-if
    `
  },
  loading: {
    type: Boolean as PropType<ModelValue>,
    default: false,
    description: 'loading 遮罩'
  },
  title: {
    type: String as PropType<string>,
    default: '',
    description: '標題'
  },
  clickOutside: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '點擊外面是否會關閉'
  },
  width: {
    type: String as PropType<string>,
    default: '',
    description: 'style width'
  },
  height: {
    type: String as PropType<string>,
    default: '',
    description: 'style height'
  },
  widthSize: {
    type: String as PropType<WidthSize>,
    default: 'default',
    description: '寬度尺寸類型'
  },
  heightSize: {
    type: String as PropType<HeightSize>,
    default: 'default',
    description: '高度尺寸類型'
  },
  modal: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否需要遮罩'
  },
  autoClose: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否點擊x 或 取消 自動關閉'
  },
  draggable: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否可拖拉'
  },
  xPosition: {
    type: String as PropType<XPosition>,
    default: 'center',
    description: '拖拉預設X軸位置'
  },
  yPosition: {
    type: String as PropType<YPosition>,
    default: 'center',
    description: '拖拉預設Y軸位置'
  },
  hiddenFooter: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏footer'
  },
  hiddenSubmit: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏 確認按鈕'
  },
  hiddenCancel: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏 取消按鈕'
  }
}
