import type { PropType } from 'vue'

export const version = '__CustomMarkdown_1.0.0__'

export interface Types {}

export interface Props {
  text: string
  readOnly: boolean
  disabled: boolean
  autoDetectCode: boolean
  showCodeRowNumber: boolean
  autoFoldThreshold: number
  preview: boolean
}
export const props = {
  text: {
    type: String as PropType<Props['text']>,
    default: '',
    description: 'markdown 內容'
  },
  readOnly: {
    type: Boolean as PropType<Props['readOnly']>,
    default: false,
    description: '是否只能讀取'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    default: false,
    description: '是否不能編輯'
  },
  autoDetectCode: {
    type: Boolean as PropType<Props['autoDetectCode']>,
    default: true,
    description: '是否啟用自動識別貼上代碼類別, 目前僅支援從vscode複製的內容。'
  },
  showCodeRowNumber: {
    type: Boolean as PropType<Props['showCodeRowNumber']>,
    default: true,
    description: '是否顯示代碼行數'
  },
  autoFoldThreshold: {
    type: Number as PropType<Props['autoFoldThreshold']>,
    default: 1000,
    description: '觸發摺疊代碼的行數'
  },
  preview: {
    type: Boolean as PropType<Props['preview']>,
    default: true,
    description: '是否顯示預覽'
  }
}

export interface Emits {}

export interface Expose {}
