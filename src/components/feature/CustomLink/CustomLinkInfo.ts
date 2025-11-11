import type { PropType } from 'vue'

export const version = '__CustomLink_1.0.0__'

export interface Types {
  linkType: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'
  linkOption: {
    fromPage?: string
    toPage: string
    description?: string
    i18nDescription?: string
    data?: string
    storageKey?: string
    disabled?: boolean | ((params?:any) => boolean)
    isModal?: boolean
  }
}

export interface Props {
  label: string | null
  type: Types['linkType']
  underline: boolean | null
  description: string | null
  fromPage: string | null
  data: string | null
  storageKey: string | null
  options: Array<Types['linkOption']>
  params: any
}
export const props = {
  // 預設El-link顯示內容
  label: {
    type: String as PropType<Props['label']>,
    required: false,
    default: '',
    description: 'ElLink 連結顯示文字內容'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'primary',
    description: 'ElLink 連結顯示文字樣式'
  },
  underline: {
    type: Boolean as PropType<Props['underline']>,
    required: false,
    default: false,
    description: 'ElLink 連結顯示有無底線'
  },
  description: {
    type: String as PropType<Props['description']>,
    required: false,
    default: null,
    description: 'ToolTip 顯示提示文字'
  },
  // 跳轉用參數
  fromPage: {
    type: String as PropType<Props['fromPage']>,
    required: true,
    description: '連結跳轉來源(當前頁面)'
  },
  data: {
    type: String as PropType<Props['data']>,
    required: false,
    default: '',
    description: '路由夾帶資料'
  },
  storageKey: {
    type: String as PropType<Props['storageKey']>,
    required: false,
    default: null,
    description: 'localStorage 設置Key'
  },
  options: {
    type: Array as PropType<Props['options']>,
    required: true,
    description: `
      ToolTip 連結選項
      LinkOptions []
      type LinkOptions {
        toPage: string 跳轉目標
        description: string 目標敘述
        i18nDescription: string 敘述i18nKey
        data?: string 非必填,無填寫則參考props.storageKey
        storageKey?: string 非必填,無填寫則參考props.storageKey
        disabled?: boolean 連結是否可以使用
      }
    `
  },
  params: {
    type: Object as PropType<Props['params']>,
    required: false,
    description: `
      提供給函式用的參數
      (params)=> {}
    `
  }
}

export interface Emits {}

export interface Expose {}
