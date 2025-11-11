import type { PropType } from 'vue'

export const version = '__CustomModal_1.0.0__'

export const minModalIndex = 2005

export interface Types {
  size: 'fill' | 'large' | 'default' | 'small' | 'extraSmall'
}

export interface Props {
  modelValue: boolean
  isKeepAlive: boolean
  loading: boolean
  title: string
  clickOutside: boolean
  widthSize: Types['size']
  heightSize: Types['size']
  modal: boolean
  autoClose: boolean
  draggable: boolean
  hiddenFooter: boolean
  hiddenSubmit: boolean
  hiddenCancel: boolean
  useResize: boolean
  hiddenCollapse: boolean // 廢棄
  xPosition: 'start' | 'center' | 'end' // 廢棄
  yPosition: 'top' | 'center' | 'bottom' // 廢棄
}
export const props = {
  modelValue: {
    type: Boolean as PropType<Props['modelValue']>,
    default: false,
    description: 'v-model 綁定是否顯示'
  },
  isKeepAlive: {
    type: Boolean as PropType<Props['isKeepAlive']>,
    default: false,
    description: `是否暫存
      true: v-show
      false: v-if
    `
  },
  loading: {
    type: Boolean as PropType<Props['loading']>,
    default: false,
    description: 'loading 遮罩'
  },
  title: {
    type: String as PropType<Props['title']>,
    default: '',
    description: '標題'
  },
  clickOutside: {
    type: Boolean as PropType<Props['clickOutside']>,
    default: false,
    description: '點擊外面是否會關閉'
  },
  widthSize: {
    type: String as PropType<Props['widthSize']>,
    default: 'default',
    description: '寬度尺寸類型'
  },
  heightSize: {
    type: String as PropType<Props['heightSize']>,
    default: 'default',
    description: '高度尺寸類型'
  },
  modal: {
    type: Boolean as PropType<Props['modal']>,
    default: true,
    description: '是否需要遮罩'
  },
  autoClose: {
    type: Boolean as PropType<Props['autoClose']>,
    default: true,
    description: '是否點擊x 或 取消 自動關閉'
  },
  draggable: {
    type: Boolean as PropType<Props['draggable']>,
    default: true,
    description: '是否可拖拉'
  },
  hiddenFooter: {
    type: Boolean as PropType<Props['hiddenFooter']>,
    default: false,
    description: '是否隱藏footer'
  },
  hiddenSubmit: {
    type: Boolean as PropType<Props['hiddenSubmit']>,
    default: false,
    description: '是否隱藏 確認按鈕'
  },
  hiddenCancel: {
    type: Boolean as PropType<Props['hiddenCancel']>,
    default: false,
    description: '是否隱藏 取消按鈕'
  },
  useResize: {
    type: Boolean as PropType<Props['useResize']>,
    default: true,
    description: '是否允許 調整視窗大小'
  },
  hiddenCollapse: {
    type: Boolean as PropType<Props['hiddenCollapse']>,
    default: true,
    description: '是否隱藏 縮小按鈕'
  },
  /**
   * @deprecated 廢棄
   * 由於定位邏輯變更 統一預設位置在中間
   */
  xPosition: {
    type: String as PropType<Props['xPosition']>,
    default: 'center',
    description: '拖拉預設X軸位置'
  },
  /**
   * @deprecated 廢棄
   * 由於定位邏輯變更 統一預設位置在中間
   */
  yPosition: {
    type: String as PropType<Props['yPosition']>,
    default: 'center',
    description: '拖拉預設Y軸位置'
  }
}

export interface Emits {
  close: () => void
  cancel: () => void
  submit: () => void
}

export interface Expose {}
