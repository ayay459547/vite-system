import type { PropType } from 'vue'

import type { CustomSize } from '@/components'
export const version = '__FormNumber_1.0.0__'

export interface Types {}

export interface Props {
  round: number
  floor: number
  ceil: number

  modelValue: number
  min: number
  max: number
  step: number
  stepStrictly: boolean
  precision: number
  size: CustomSize
  readonly: boolean
  disabled: boolean
  controls: boolean
  controlsPosition: string | '' | 'right' | any
  name: string
  ariaLabel: string
  placeholder: string
  id: string
  valueOnClear: string | number | boolean | Function
  validateEvent: boolean
  Clearable: boolean
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
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  min: {
    type: Number as PropType<Props['min']>,
    required: false,
    default: undefined,
    description: '最小值，type === number'
  },
  max: {
    type: Number as PropType<Props['max']>,
    required: false,
    default: undefined,
    description: '最大值，type === number'
  },
  step: {
    type: Number as PropType<Props['step']>,
    required: false,
    default: 1,
    description: '計數器步長'
  },
  stepStrictly: {
    type: Boolean as PropType<Props['stepStrictly']>,
    required: false,
    default: false,
    description: '是否只能輸入 step 的倍數'
  },
  precision: {
    type: Number as PropType<Props['precision']>,
    required: false,
    default: undefined,
    description: '數值精度'
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  readonly: {
    type: Boolean as PropType<Props['readonly']>,
    required: false,
    default: false,
    description: '原生 readonly 屬性, 是否唯讀'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  controls: {
    type: Boolean as PropType<Props['controls']>,
    required: false,
    default: false,
    description: '是否使用控制按鈕'
  },
  controlsPosition: {
    type: String as PropType<Props['controlsPosition']>,
    required: false,
    default: undefined,
    description: '控制按鈕位置'
  },
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  placeholder: {
    type: String as PropType<Props['placeholder']>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: '等價於原生 input id 屬性'
  },
  valueOnClear: {
    type: [String, Number, Boolean, Function] as PropType<Props['valueOnClear']>,
    required: false,
    default: null,
    description: '組件的空值配置 參考 Config Provider'
  },
  validateEvent: {
    type: Boolean as PropType<Props['validateEvent']>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  }
}

export interface Emits {
  blur: (event: FocusEvent) => void
  focus: (event: FocusEvent) => void
  change: (value: Props['modelValue']) => void
}

export interface Expose {
  blur: () => void
  focus: () => void
}
