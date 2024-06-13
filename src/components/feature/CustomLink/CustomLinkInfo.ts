import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Custom {
  type LinkType = 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'
  type LinkOption = {
    fromPage?: string
    toPage: string
    description?: string
    i18nDescription?: string
    data?: string
    storageKey?: string
    disabled?: boolean
    isModal?: boolean
  }
}

export declare namespace Props {
  type Label = string | null
  type Type = Custom.LinkType
  type Underline = boolean | null
  type Description = string | null
  type FromPage = string | null
  type Data = string | null
  type StorageKey = string | null
  type Options = Array<Custom.LinkOption>
}

export const props = {
  // 預設El-link顯示內容
  label: {
    type: String as PropType<Props.Label>,
    required: false,
    default: '',
    description: `
      ElLink 連結顯示文字內容`
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'primary',
    description: `
      ElLink 連結顯示文字樣式`
  },
  underline: {
    type: Boolean as PropType<Props.Underline>,
    required: false,
    default: false,
    description: `
      ElLink 連結顯示有無底線`
  },
  description: {
    type: String as PropType<Props.Description>,
    required: false,
    default: null,
    description: `
      ToolTip 顯示提示文字`
  },
  // 跳轉用參數
  fromPage: {
    type: String as PropType<Props.FromPage>,
    required: true,
    description: `
      連結跳轉來源(當前頁面)`
  },
  data: {
    type: String as PropType<Props.Data>,
    required: false,
    default: '',
    description: `
      路由夾帶資料
    `
  },
  storageKey: {
    type: String as PropType<Props.StorageKey>,
    required: false,
    default: null,
    description: `
      localStorage 設置Key
    `
  },
  options: {
    type: Array as PropType<Props.Options>,
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
  }

}
