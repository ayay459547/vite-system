import type { PropType } from 'vue'

export const version = '__CustomMarkdown_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Text = string
  type ReadOnly = boolean
  type Disabled = boolean
  type AutoDetectCode = boolean
  type ShowCodeRowNumber = boolean
  type AutoFoldThreshold = number
  type Preview = boolean
}
export const props = {
  text: {
    type: String as PropType<Props.Text>,
    default: '',
    description: 'markdown 內容'
  },
  readOnly: {
    type: Boolean as PropType<Props.ReadOnly>,
    default: false,
    description: '是否只能讀取'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false,
    description: '是否不能編輯'
  },
  autoDetectCode: {
    type: Boolean as PropType<Props.AutoDetectCode>,
    default: true,
    description: '是否啟用自動識別貼上代碼類別, 目前僅支援從vscode複製的內容。'
  },
  showCodeRowNumber: {
    type: Boolean as PropType<Props.ShowCodeRowNumber>,
    default: true,
    description: '是否顯示代碼行數'
  },
  autoFoldThreshold: {
    type: Number as PropType<Props.AutoFoldThreshold>,
    default: 1000,
    description: '觸發摺疊代碼的行數'
  },
  preview: {
    type: Boolean as PropType<Props.Preview>,
    default: true,
    description: '是否顯示預覽'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
