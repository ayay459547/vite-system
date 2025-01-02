import type { PropType } from 'vue'

export const version = '__CustomDrawer_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type ModelValue = boolean
  type AppendToBody = boolean
  type AppendTo = string
  type LockScroll = boolean
  // done 是 function type 接受一個 boolean 參數, 執行 done 使用 true 參數或不提供參數將會終止關閉
  type BeforeClose = (done: (cancel?: boolean) => void) => void
  type CloseOnClickModal = boolean
  type CloseOnPressEscape = boolean
  type OpenDelay = number
  type CloseDelay = number
  type DestroyOnClose = boolean
  type Modal = boolean
  type Direction = 'rtl' | 'ltr' | 'ttb' | 'btt'
  type ShowClose = boolean
  type Size = number | string
  type Title = string
  type WithHeader = boolean
  type ModalClass = string
  type ZIndex = number
  type HeaderAriaLevel = string
}
export const props = {
  modelValue: {
    type: Boolean as PropType<Props.ModelValue>,
    default: false,
    description: '是否顯示'
  },
  appendToBody: {
    type: Boolean as PropType<Props.AppendToBody>,
    default: false,
    description: 'Drawer 本身是否插入至 body 元素上。嵌套的 Drawer 必須指定該屬性並賦值為 true'
  },
  appendTo: {
    type: String as PropType<Props.AppendTo>,
    default: 'body',
    description: '掛載到哪個 DOM 元素 會覆寫 append-to-body'
  },
  lockScroll: {
    type: Boolean as PropType<Props.LockScroll>,
    default: true,
    description: '是否在 Drawer 出現時將 body 滾動鎖定'
  },
  beforeClose: {
    type: Function as PropType<Props.BeforeClose>,
    default: undefined,
    description: '關閉前的回調，會暫停 Drawer 的關閉'
  },
  closeOnClickModal: {
    type: Boolean as PropType<Props.CloseOnClickModal>,
    default: true,
    description: '是否可以透過點擊 modal 關閉 Drawer'
  },
  closeOnPressEscape: {
    type: Boolean as PropType<Props.CloseOnPressEscape>,
    default: true,
    description: '是否可以按下 ESC 關閉 Drawer'
  },
  openDelay: {
    type: Number as PropType<Props.OpenDelay>,
    default: 0,
    description: 'Drawer 打開的延遲時間，單位毫秒'
  },
  closeDelay: {
    type: Number as PropType<Props.CloseDelay>,
    default: 0,
    description: 'Drawer 關閉的延遲時間，單位毫秒'
  },
  destroyOnClose: {
    type: Boolean as PropType<Props.DestroyOnClose>,
    default: false,
    description: '控制是否在關閉 Drawer 之後將子元素全部銷毀'
  },
  modal: {
    type: Boolean as PropType<Props.Modal>,
    default: true,
    description: '是否需要遮罩'
  },
  direction: {
    type: String as PropType<Props.Direction>,
    default: 'rtl',
    description: '打開方向'
  },
  showClose: {
    type: Boolean as PropType<Props.ShowClose>,
    default: true,
    description: '是否顯示關閉按鈕'
  },
  size: {
    type: [Number, String] as PropType<Props.Size>,
    default: '30%',
    description: '視窗大小'
  },
  title: {
    type: String as PropType<Props.Title>,
    default: undefined,
    description: 'Drawer 的標題，也可透過具名 slot 傳入'
  },
  withHeader: {
    type: Boolean as PropType<Props.WithHeader>,
    default: true,
    description: '控制是否顯示 header 欄, 預設為 true, 當此項為 false 時, title attribute 和 title slot 皆不生效'
  },
  modalClass: {
    type: String as PropType<Props.ModalClass>,
    default: '',
    description: '遮罩自訂class'
  },
  zIndex: {
    type: Number as PropType<Props.ZIndex>,
    default: undefined,
    description: '設定 z-index'
  },
  headerAriaLevel: {
    type: String as PropType<Props.HeaderAriaLevel>,
    default: undefined,
    description: 'header 的 aria-level 屬性'
  }
}

export declare namespace Emits {
  type Open = () => void
  type Opened = () => void
  type Close = () => void
  type Closed = () => void
  type OpenAutoFocus = () => void
  type CloseAutoFocus = () => void
}

export declare namespace Expose {
  type HandleClose = () => void
}
