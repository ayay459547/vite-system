import type { PropType } from 'vue'

export const version = '1.0.0'

export const minModalIndex = 2005

export declare namespace Custom {
  type Size = 'fill' | 'large' | 'default' | 'small' | 'extraSmall' | 'fitContent'
}

export declare namespace Props {
  type ModelValue = boolean
  type IsKeepAlive = boolean
  type Loading = boolean
  type Title = string
  type ClickOutside = boolean
  type Width = string
  type Height = string
  type WidthSize = Custom.Size
  type HeightSize = Custom.Size
  type Modal = boolean
  type AutoClose = boolean
  type Draggable = boolean
  type XPosition = 'start' | 'center' | 'end'
  type YPosition = 'top' | 'center' | 'bottom'
  type HiddenFooter = boolean
  type HiddenSubmit = boolean
  type HiddenCancel = boolean
}

export const props = {
  modelValue: {
    type: Boolean as PropType<Props.ModelValue>,
    default: false,
    description: 'v-model 綁定是否顯示'
  },
  isKeepAlive: {
    type: Boolean as PropType<Props.IsKeepAlive>,
    default: false,
    description: `是否暫存
      true: v-show
      false: v-if
    `
  },
  loading: {
    type: Boolean as PropType<Props.Loading>,
    default: false,
    description: 'loading 遮罩'
  },
  title: {
    type: String as PropType<Props.Title>,
    default: '',
    description: '標題'
  },
  clickOutside: {
    type: Boolean as PropType<Props.ClickOutside>,
    default: false,
    description: '點擊外面是否會關閉'
  },
  width: {
    type: String as PropType<Props.Width>,
    default: '',
    description: 'style width'
  },
  height: {
    type: String as PropType<Props.Height>,
    default: '',
    description: 'style height'
  },
  widthSize: {
    type: String as PropType<Props.WidthSize>,
    default: 'default',
    description: '寬度尺寸類型'
  },
  heightSize: {
    type: String as PropType<Props.HeightSize>,
    default: 'default',
    description: '高度尺寸類型'
  },
  modal: {
    type: Boolean as PropType<Props.Modal>,
    default: true,
    description: '是否需要遮罩'
  },
  autoClose: {
    type: Boolean as PropType<Props.AutoClose>,
    default: true,
    description: '是否點擊x 或 取消 自動關閉'
  },
  draggable: {
    type: Boolean as PropType<Props.Draggable>,
    default: false,
    description: '是否可拖拉'
  },
  xPosition: {
    type: String as PropType<Props.XPosition>,
    default: 'center',
    description: '拖拉預設X軸位置'
  },
  yPosition: {
    type: String as PropType<Props.YPosition>,
    default: 'center',
    description: '拖拉預設Y軸位置'
  },
  hiddenFooter: {
    type: Boolean as PropType<Props.HiddenFooter>,
    default: false,
    description: '是否隱藏footer'
  },
  hiddenSubmit: {
    type: Boolean as PropType<Props.HiddenSubmit>,
    default: false,
    description: '是否隱藏 確認按鈕'
  },
  hiddenCancel: {
    type: Boolean as PropType<Props.HiddenCancel>,
    default: false,
    description: '是否隱藏 取消按鈕'
  }
}

export declare namespace Emits {
  type Close = () => void
  type Cancel = () => void
  type Submit = () => void
}
