import type { PropType, Component, StyleValue } from 'vue'
// import type { InputProps, InputEmits } from 'element-plus'

import type { CustomSize } from '@/components'
export const version = '__FormInput_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type ErrorMessage = string
  type Round = number
  type Floor = number
  type Ceil = number

  type Type = string
    | 'text' | 'textarea' | 'password' | 'button'
    | 'checkbox' | 'file' | 'number' | 'radio'
  type ModelValue = string | number
  type Maxlength = string | number
  type Minlength = string | number
  type ShowWordLimit = boolean
  type Placeholder = string
  type Clearable = boolean
  type Formatter = (value: string | number) => string
  type Parser = (value: string) => string
  type ShowPassword = boolean
  type Disabled = boolean
  type Size = CustomSize
  type PrefixIcon = string | Component
  type SuffixIcon = string | Component
  type Rows = number
  type Autosize = boolean | { minRows?: number, maxRows?: number }
  type Autocomplete = string
  type Name = string
  type Readonly = boolean
  type Max = number
  type Min = number
  type Step = string
  type Resize = 'none' | 'both' | 'horizontal' | 'vertical'
  type Autofocus = boolean
  type Form = string
  type AriaLabel = string
  type Tabindex = string | number
  type ValidateEvent = boolean
  type InputStyle = StyleValue
  // type Label = string
}
export const props = {
  // custom
  errorMessage: {
    type: String as PropType<Props.ErrorMessage>,
    required: false,
    default: '',
    description: '錯誤訊息'
  },
  round: {
    type: Number as PropType<Props.Round>,
    required: false,
    default: undefined,
    description: `
      type === 'number'
      四捨五入 取小數點到第幾位
    `
  },
  floor: {
    type: Number as PropType<Props.Floor>,
    required: false,
    default: undefined,
    description: `
      type === 'number'
      無條件捨去 取小數點到第幾位
    `
  },
  ceil: {
    type: Number as PropType<Props.Ceil>,
    required: false,
    default: undefined,
    description: `
      type === 'number'
      無條件進位 取小數點到第幾位
    `
  },
  // element ui plus
  modelValue: {
    type: [String, Number] as PropType<Props.ModelValue>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'text',
    description: '類型，原生 type 屬性'
  },
  maxlength: {
    type: [String, Number] as PropType<Props.Maxlength>,
    required: false,
    default: undefined,
    description: '最大輸入長度，原生 maxlength 屬性'
  },
  minlength: {
    type: [String, Number] as PropType<Props.Minlength>,
    required: false,
    default: undefined,
    description: '最小輸入長度，原生 minlength 屬性'
  },
  showWordLimit: {
    type: Boolean as PropType<Props.ShowWordLimit>,
    required: false,
    default: false,
    description: '是否顯示統計字數，type === textarea'
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕，type !== textarea'
  },
  formatter: {
    type: Function as PropType<Props.Formatter>,
    required: false,
    default: undefined,
    description: '指定輸入值的格式，type === text'
  },
  parser: {
    type: Function as PropType<Props.Parser>,
    required: false,
    default: undefined,
    description: '指定從格式化器輸入中提取的值，type === text'
  },
  showPassword: {
    type: Boolean as PropType<Props.ShowPassword>,
    default: false,
    description: '是否顯示切換密碼圖示'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '輸入框尺寸，type !== textarea'
  },
  prefixIcon: {
    type: [String, Object] as PropType<Props.PrefixIcon>,
    required: false,
    default: undefined,
    description: '自訂前綴圖標'
  },
  suffixIcon: {
    type: [String, Object] as PropType<Props.SuffixIcon>,
    required: false,
    default: undefined,
    description: '自訂後綴圖標'
  },
  rows: {
    type: Number as PropType<Props.Rows>,
    required: false,
    default: 2,
    description: '顯示的行數，type === textarea'
  },
  autosize: {
    type: [Boolean, Object] as PropType<Props.Autosize>,
    required: false,
    default: false,
    description: '高度是否自適應，type === textarea'
  },
  autocomplete: {
    type: String as PropType<Props.Autocomplete>,
    required: false,
    default: 'off',
    description: '原生 autocomplete 屬性'
  },
  name: {
    type: String as PropType<Props.Name>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  readonly: {
    type: Boolean as PropType<Props.Readonly>,
    required: false,
    default: false,
    description: '原生 readonly 屬性, 是否唯讀'
  },
  max: {
    type: Number as PropType<Props.Max>,
    required: false,
    default: undefined,
    description: '最大值，type === number'
  },
  min: {
    type: Number as PropType<Props.Min>,
    required: false,
    default: undefined,
    description: '最小值，type === number'
  },
  step: {
    type: String as PropType<Props.Step>,
    required: false,
    default: undefined,
    description: '原生屬性，設定輸入欄位的數字間隔'
  },
  resize: {
    type: String as PropType<Props.Resize>,
    required: false,
    default: undefined,
    description: '控制是否能被使用者縮放'
  },
  autofocus: {
    type: Boolean as PropType<Props.Autofocus>,
    required: false,
    default: undefined,
    description: '原生屬性，自動取得焦點'
  },
  form: {
    type: String as PropType<Props.Form>,
    required: false,
    default: undefined,
    description: '原生屬性'
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  tabindex: {
    type: [String, Number] as PropType<Props.Tabindex>,
    required: false,
    default: undefined,
    description: '輸入框的 tabindex'
  },
  validateEvent: {
    type: Boolean as PropType<Props.ValidateEvent>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  inputStyle: {
    type: [String, Object] as PropType<Props.InputStyle>,
    required: false,
    default: '',
    description: 'input 或 textarea 的 style'
  }
}

export declare namespace Emits {
  type Blur = (event: FocusEvent) => void
  type Focus = (event: FocusEvent) => void
  type Change = (value: Props.ModelValue) => void
  type Input = (value: Props.ModelValue) => void
  type Clear = () => void
}

export declare namespace Expose {
  type Blur = () => void
  type Clear = () => void
  type Focus = () => void
  type ResizeTextarea = () => void
  type Select = () => void
}
