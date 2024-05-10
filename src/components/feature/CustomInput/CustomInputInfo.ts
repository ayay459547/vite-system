import type { PropType } from 'vue'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'
import type { ValidateType } from '@/lib/lib_validate'

import type { Shortcuts, FetchSuggestions, DatePickerType, TimePickerType } from '@/components'

export const version = '1.0.0'

export type ModelValue = any | null | undefined
export type InputType =
  | 'text'
  | 'textarea'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'autocomplete'
  | 'operator'
  | DatePickerType
  | TimePickerType
export type Option = {
  label: string
  i18nLabel?: string
  value: string | number | boolean | null
  disabled?: boolean
  color?: string
  data?: any
}
export type Options = Array<Option>

const custom = {
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
    default: 'field',
    description: `
      驗證用的 key 值
      useField 綁定用
      會以 class 綁定在 dom
    `
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
  round: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      四捨五入 取小數點到第幾位`
  },
  floor: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      無條件捨去 取小數點到第幾位`
  },
  ceil: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      無條件進位 取小數點到第幾位`
  },
  max: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      最大值`
  },
  min: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      最小值`
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: `
      isValidate 必須為 true
      是否必填`
  },
  validate: {
    type: [Array, String, null] as PropType<ValidateType[] | ValidateType>,
    required: false,
    default: null,
    description: `
      驗證同時符合 多個條件 :validate="[keyword, keyword, keyword ......]"
      驗證符合一個條件 validate="keyword"
      參考檔案: lib_validate.ts`
  },
  text: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示純文字 隱藏輸入框 顯示 modelValue 的值'
  },
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: defaultModuleType,
    description: `
      label, options 使用 i18nLabel 時套用的翻譯模組
    `
  },
  i18nLabel: {
    type: String as PropType<string>,
    required: false,
    default: null,
    description: `
     提供翻譯檔參照用的 i18nLabel
     翻譯結果有效時會把原先的 label 替換掉
    `
  }
}

// element ui plus
const elCommon = {
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
  placeholder: {
    type: String as PropType<string>,
    required: false,
    description: '尚未填入時顯示文字'
  },
  options: {
    type: Array as PropType<Option[]>,
    required: false,
    default() {
      return []
    },
    description: '選項'
  }
}

const elInput = {
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
    description: `
      切換是否顯示密碼的按鈕
      type="password" 才有效果`
  }
}

const elSelect = {
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
    description: 'api 搜尋'
  },
  remoteShowSuffix: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: 'api 搜尋 是否顯示箭頭'
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
  },
  defaultFirstOption: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: `
      是否在輸入框按下Enter時 選擇第一個符合項目
      需配合 filterable 或 remote 使用`
  }
}

const elDatePicker = {
  format: {
    type: String as PropType<string>,
    required: false,
    description: '顯示格式'
  },
  valueFormat: {
    type: String as PropType<string>,
    required: false,
    description: '資料格式'
  },
  shortcuts: {
    type: Array as PropType<Shortcuts[]>,
    required: false
  }
}

const elTimePicker = {
  // format: {
  //   type: String as PropType<string>,
  //   required: false,
  //   description: '資料及顯示格式'
  // },
  isRange: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可選區間'
  },
  rangeSeparator: {
    type: String as PropType<string>,
    default: '-',
    description: '間格文字'
  }
}

const elCheckbox = {
  indeterminate: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '用在有選但非全選狀態'
  }
}

const elRadio = {}

const elAutocomplete = {
  valueKey: {
    type: String as PropType<string>,
    required: false,
    default: 'value'
  },
  fitInputWidth: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  fetchSuggestions: {
    type: Function as PropType<FetchSuggestions>,
    required: false
  }
}

export const props = {
  ...custom,
  ...elCommon,
  ...elInput,
  ...elSelect,
  ...elDatePicker,
  ...elTimePicker,
  ...elCheckbox,
  ...elRadio,
  ...elAutocomplete
}
