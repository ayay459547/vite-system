import type { PropType } from 'vue'
import type { ValidateType } from '@/lib/lib_validate'
import type { Shortcuts, PickerType } from '@/components'

export type ModelValue = any | null | undefined
export type InputType = (
  'text' | 'textarea' | 'password' |
  'select' | 'checkbox' | 'radio' |
  'autocomplete' | 'operator' |
  PickerType
)
export type Option = {
  label: string
  value: string | number | boolean | null
  disabled?: boolean
  color?: string
}
export type Options = Array<Option>

export const custom = {
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<ModelValue>,
    required: true,
    description: '綁定值 v-model="..." '
  },
  isValidate: {
    type: Boolean as PropType<boolean>,
    require: false,
    default: false,
    description: `
      是否為驗證輸入框
      會引響高度 部分元素是否顯示`
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
    required: false,
    default: 'column',
    description: '方向 column:直 row:橫'
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '文字'
  },
  hiddenLabel: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否隱藏文字'
  },
  hiddenErrorMessage: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否隱藏驗證錯誤訊息'
  },
  onlyNumber: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否只能輸入數字'
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否必填'
  },
  validate: {
    type: [Array, String, null] as PropType<ValidateType[] | ValidateType>,
    required: false,
    default: null,
    description: `
      驗證同時符合 多個條件 :validate="[keyword, keyword, keyword ......]"
      驗證符合一個條件 validate="keyword"
      參考檔案: lib_validate.ts `
  },
  text: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示純文字 隱藏輸入框 顯示 modelValue 的值'
  }
}

// element ui plus
export const elCommon = {
  type: {
    type: String as PropType<InputType>,
    required: false,
    default: 'text',
    description: '輸入框類型'
  },
  clearable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否禁止輸入'
  },
  options: {
    type: Array as PropType<Option[]>,
    required: false,
    default () {
      return []
    },
    description: '選項'
  }
}

export const elInput = {
  rows: {
    type: Number as PropType<number>,
    required: false,
    default: 2,
    description: `顯示的行數
      type="textarea" 才有效果 `
  },
  showPassword: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: `切換是否顯示密碼的按鈕
      type="password" 才有效果 `
  }
}

export const elSelect = {
  loading: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否讀取中'
  },
  remote: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '選項是否來自函數'
  },
  remoteMethod: {
    type: Function as PropType<Function>,
    required: false,
    description: '函數取的選項'
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否多選'
  },
  multipleLimit: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: '多選限制最多幾個'
  },
  maxCollapseTags: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
    description: '多選顯示標籤數量'
  },
  filterable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可輸入文字過濾'
  },
  allowCreate: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可依照輸入文字建立選項'
  }
}

export const elDatePicker = {
  format: {
    type: String as PropType<string>,
    required: false,
    default: 'YYYY-MM-DD'
  },
  valueFormat: {
    type: String as PropType<string>,
    required: false,
    default: 'YYYY-MM-DD'
  },
  shortcuts: {
    type: Array as PropType<Shortcuts[]>,
    required: false
  }
}

export const elCheckbox = {}

export const elRadio = {}
