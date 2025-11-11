import type { PropType } from 'vue'

export const version = '__ModalSelect_1.0.0__'

export interface Types {}

export interface Props {
  modelValue?: any
  searchType?: string // 檢視 ModalSelectManagement
  multiple?: boolean
  multipleLimit?: number
}

export const props = {
  modelValue: {
    type: [Object, Array, String, Number, undefined, null] as PropType<Props['modelValue']>,
    required: false,
    default: null,
    description: '綁定值 v-model="..." '
  },
  searchType: {
    type: String as PropType<Props['searchType']>,
    required: false,
    default: '',
    description: '選擇資料的類型類型(工單, 機台, 製程......)'
  },
  multiple: {
    type: Boolean as PropType<Props['multiple']>,
    required: false,
    default: false,
    description: '是否多選'
  },
  multipleLimit: {
    type: Number as PropType<Props['multipleLimit']>,
    required: false,
    default: 0,
    description: 'multiple 屬性設定為 true 時，代表多重選擇場景下使用者最多可選擇的項目數， 為 0 則不限制'
  }
}

export interface Emits {}

export interface Expose {}
