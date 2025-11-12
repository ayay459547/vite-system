import type { PropType, Component, StyleValue } from 'vue'
// import type { InputProps, InputEmits } from 'element-plus'

import type { CustomSize } from '@/components'
export const version = '__FormInput_1.0.0__'

export interface Types {}

export interface Props {
  round: number
  floor: number
  ceil: number

  type: string
    | 'text' | 'textarea' | 'password' | 'button'
    | 'checkbox' | 'file' | 'number' | 'radio'
  modelValue: string | number
  maxlength: string | number
  minlength: string | number
  showWordLimit: boolean
  placeholder: string
  clearable: boolean
  formatter: (value: string | number) => string
  parser: (value: string) => string
  showPassword: boolean
  disabled: boolean
  size: CustomSize
  prefixIcon: string | Component
  suffixIcon: string | Component
  rows: number
  autosize: boolean | { minRows?: number, maxRows?: number }
  autocomplete: AutoFill
  name: string
  readonly: boolean
  max: number
  min: number
  step: string
  resize: 'none' | 'both' | 'horizontal' | 'vertical'
  autofocus: boolean
  form: string
  ariaLabel: string
  tabindex: string | number
  validateEvent: boolean
  inputStyle: StyleValue
  // type Label = string
}
export const props = {
  // custom
  round: {
    type: Number as PropType<Props['round']>,
    required: false,
    default: undefined,
    description: '四捨五入 取小數點到第幾位，type === number'
  },
  floor: {
    type: Number as PropType<Props['floor']>,
    required: false,
    default: undefined,
    description: '無條件捨去 取小數點到第幾位，type === number'
  },
  ceil: {
    type: Number as PropType<Props['ceil']>,
    required: false,
    default: undefined,
    description: '無條件進位 取小數點到第幾位，type === number'
  },
  // element ui plus
  modelValue: {
    type: [String, Number] as PropType<Props['modelValue']>,
    required: false,
    default: '',
    description: '綁定值 v-model="..." '
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'text',
    description: '類型，原生 type 屬性'
  },
  maxlength: {
    type: [String, Number] as PropType<Props['maxlength']>,
    required: false,
    default: undefined,
    description: '最大輸入長度，原生 maxlength 屬性'
  },
  minlength: {
    type: [String, Number] as PropType<Props['minlength']>,
    required: false,
    default: undefined,
    description: '最小輸入長度，原生 minlength 屬性'
  },
  showWordLimit: {
    type: Boolean as PropType<Props['showWordLimit']>,
    required: false,
    default: false,
    description: '是否顯示統計字數，type === textarea'
  },
  placeholder: {
    type: String as PropType<Props['placeholder']>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  clearable: {
    type: Boolean as PropType<Props['clearable']>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕，type !== textarea'
  },
  formatter: {
    type: Function as PropType<Props['formatter']>,
    required: false,
    default: undefined,
    description: '指定輸入值的格式，type === text'
  },
  parser: {
    type: Function as PropType<Props['parser']>,
    required: false,
    default: undefined,
    description: '指定從格式化器輸入中提取的值，type === text'
  },
  showPassword: {
    type: Boolean as PropType<Props['showPassword']>,
    default: false,
    description: '是否顯示切換密碼圖示'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '輸入框尺寸，type !== textarea'
  },
  prefixIcon: {
    type: [String, Object] as PropType<Props['prefixIcon']>,
    required: false,
    default: undefined,
    description: '自訂前綴圖標'
  },
  suffixIcon: {
    type: [String, Object] as PropType<Props['suffixIcon']>,
    required: false,
    default: undefined,
    description: '自訂後綴圖標'
  },
  rows: {
    type: Number as PropType<Props['rows']>,
    required: false,
    default: 2,
    description: '顯示的行數，type === textarea'
  },
  autosize: {
    type: [Boolean, Object] as PropType<Props['autosize']>,
    required: false,
    default: false,
    description: '高度是否自適應，type === textarea'
  },
  autocomplete: {
    type: String as PropType<Props['autocomplete']>,
    required: false,
    default: 'off',
    description: '原生 autocomplete 屬性'
  },
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  readonly: {
    type: Boolean as PropType<Props['readonly']>,
    required: false,
    default: false,
    description: '原生 readonly 屬性, 是否唯讀'
  },
  max: {
    type: Number as PropType<Props['max']>,
    required: false,
    default: undefined,
    description: '最大值，type === number'
  },
  min: {
    type: Number as PropType<Props['min']>,
    required: false,
    default: undefined,
    description: '最小值，type === number'
  },
  step: {
    type: String as PropType<Props['step']>,
    required: false,
    default: undefined,
    description: '原生屬性，設定輸入欄位的數字間隔'
  },
  resize: {
    type: String as PropType<Props['resize']>,
    required: false,
    default: undefined,
    description: '控制是否能被使用者縮放'
  },
  autofocus: {
    type: Boolean as PropType<Props['autofocus']>,
    required: false,
    default: undefined,
    description: '原生屬性，自動取得焦點'
  },
  form: {
    type: String as PropType<Props['form']>,
    required: false,
    default: undefined,
    description: '原生屬性'
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  tabindex: {
    type: [String, Number] as PropType<Props['tabindex']>,
    required: false,
    default: undefined,
    description: '輸入框的 tabindex'
  },
  validateEvent: {
    type: Boolean as PropType<Props['validateEvent']>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  inputStyle: {
    type: [String, Object] as PropType<Props['inputStyle']>,
    required: false,
    default: '',
    description: 'input 或 textarea 的 style'
  }
}

export interface Emits {
  blur: (event: FocusEvent) => void
  focus: (event: FocusEvent) => void
  change: (value: Props['modelValue']) => void
  input: (value: Props['modelValue']) => void
  clear: () => void
}

export interface Expose {
  blur: () => void
  clear: () => void
  focus: () => void
  resizeTextarea: () => void
  select: () => void
}
