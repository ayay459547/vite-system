import type { PropType } from 'vue'
import type { VeeRes, ValidateType } from '@/lib/lib_validate'

export type ModelValue = any
export type InputType = (
  'text' | 'textarea' | 'password' |
  'select' | 'checkbox' | 'radio' |
  'data' | 'datetime' | 'daterange' | 'dateitmerange'
)

export const custom = {
  modelValue: {
    type: [Array, String, Number, null, undefined] as PropType<ModelValue>,
    required: true,
    description: '綁定值 v-model="..." '
  },
  validateKey: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: `
      驗證用的 key 值
      會以 class 綁定在 dom `
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    default: 'column',
    description: '方向 column:直 row:橫'
  },
  label: {
    type: String as PropType<string>,
    default: '',
    description: '文字'
  },
  hiddenLabel: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏文字'
  },
  onlyNumber: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否只能輸入數字'
  },
  required: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否必填'
  },
  validate: {
    type: [Array, String, null] as PropType<ValidateType[] | ValidateType>,
    default: null,
    description: `
      驗證同時符合 多個條件 :validate="[keyword, keyword, keyword ......]"
      驗證符合一個條件 validate="keyword"
      參考檔案: lib_validate.ts `
  },
  text: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否顯示純文字 隱藏輸入框 顯示 modelValue 的值'
  }
}

// element ui plus
export const elCommon = {
  type: {
    type: String as PropType<InputType>,
    default: 'text',
    description: '輸入框類型'
  },
  clearable: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否顯示清除按鈕'
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否禁止輸入'
  }
}

export const elInput = {
  rows: {
    type: Number as PropType<number>,
    default: 2,
    description: `顯示的行數
      type="textarea" 才有效果 `
  },
  showPassword: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: `切換是否顯示密碼的按鈕
      type="password" 才有效果 `
  }
}