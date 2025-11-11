import type { PropType } from 'vue'

export const version = '__CustomDrawer_1.0.0__'

export interface Types {}

export interface Props {
  modelValue: boolean
  appendToBody: boolean
  appendTo: string
  lockScroll: boolean
  // done 是 function type 接受一個 boolean 參數, 執行 done 使用 true 參數或不提供參數將會終止關閉
  beforeClose: (done: (cancel?: boolean) => void) => void
  closeOnClickModal: boolean
  closeOnPressEscape: boolean
  openDelay: number
  closeDelay: number
  destroyOnClose: boolean
  modal: boolean
  direction: 'rtl' | 'ltr' | 'ttb' | 'btt'
  showClose: boolean
  size: number | string
  title: string
  withHeader: boolean
  modalClass: string
  zIndex: number
  headerAriaLevel: string
}
export const props = {
  modelValue: {
    type: Boolean as PropType<Props['modelValue']>,
    default: false,
    description: '是否顯示'
  },
  appendToBody: {
    type: Boolean as PropType<Props['appendToBody']>,
    default: false,
    description: 'Drawer 本身是否插入至 body 元素上。嵌套的 Drawer 必須指定該屬性並賦值為 true'
  },
  appendTo: {
    type: String as PropType<Props['appendTo']>,
    default: 'body',
    description: '掛載到哪個 DOM 元素 會覆寫 append-to-body'
  },
  lockScroll: {
    type: Boolean as PropType<Props['lockScroll']>,
    default: true,
    description: '是否在 Drawer 出現時將 body 滾動鎖定'
  },
  beforeClose: {
    type: Function as PropType<Props['beforeClose']>,
    default: undefined,
    description: '關閉前的回調，會暫停 Drawer 的關閉'
  },
  closeOnClickModal: {
    type: Boolean as PropType<Props['closeOnClickModal']>,
    default: true,
    description: '是否可以透過點擊 modal 關閉 Drawer'
  },
  closeOnPressEscape: {
    type: Boolean as PropType<Props['closeOnPressEscape']>,
    default: true,
    description: '是否可以按下 ESC 關閉 Drawer'
  },
  openDelay: {
    type: Number as PropType<Props['openDelay']>,
    default: 0,
    description: 'Drawer 打開的延遲時間，單位毫秒'
  },
  closeDelay: {
    type: Number as PropType<Props['closeDelay']>,
    default: 0,
    description: 'Drawer 關閉的延遲時間，單位毫秒'
  },
  destroyOnClose: {
    type: Boolean as PropType<Props['destroyOnClose']>,
    default: false,
    description: '控制是否在關閉 Drawer 之後將子元素全部銷毀'
  },
  modal: {
    type: Boolean as PropType<Props['modal']>,
    default: true,
    description: '是否需要遮罩'
  },
  direction: {
    type: String as PropType<Props['direction']>,
    default: 'rtl',
    description: '打開方向'
  },
  showClose: {
    type: Boolean as PropType<Props['showClose']>,
    default: true,
    description: '是否顯示關閉按鈕'
  },
  size: {
    type: [Number, String] as PropType<Props['size']>,
    default: '30%',
    description: '視窗大小'
  },
  title: {
    type: String as PropType<Props['title']>,
    default: undefined,
    description: 'Drawer 的標題，也可透過具名 slot 傳入'
  },
  withHeader: {
    type: Boolean as PropType<Props['withHeader']>,
    default: true,
    description: '控制是否顯示 header 欄, 預設為 true, 當此項為 false 時, title attribute 和 title slot 皆不生效'
  },
  modalClass: {
    type: String as PropType<Props['modalClass']>,
    default: '',
    description: '遮罩自訂class'
  },
  zIndex: {
    type: Number as PropType<Props['zIndex']>,
    default: undefined,
    description: '設定 z-index'
  },
  headerAriaLevel: {
    type: String as PropType<Props['headerAriaLevel']>,
    default: undefined,
    description: 'header 的 aria-level 屬性'
  }
}

export interface Emits {
  open: () => void
  opened: () => void
  close: () => void
  closed: () => void
  openAutoFocus: () => void
  closeAutoFocus: () => void
}

export interface Expose {
  handleClose: () => void
}
