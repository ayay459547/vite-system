import type { PropType } from 'vue'

export const version = '__CustomHelp_1.0.0__'

export interface Types {}

export interface Props {
  filePath: string
  isSupportI18n: boolean
  title: string
}
export const props = {
  filePath: {
    type: String as PropType<Props['filePath']>,
    required: false,
    default: '',
    description: 'PDF檔案路徑'
  },
  isSupportI18n: {
    type: Boolean as PropType<Props['isSupportI18n']>,
    required: false,
    default: false,
    description: `是否支援 i18n (目前無功能)
      依據當前語言, 讀取對應的檔案
    `
  },
  title: {
    title: String as PropType<Props['title']>,
    required: false,
    default: '',
    description: '標題'
  }
}

export interface Emits {
  click: ($event: Event) => void
}

export interface Expose {}
