import type { PropType } from 'vue'

import type { Option as CommonOption, CustomSize } from '@/components' // 系統組件

export const version = '__FormRadio_1.0.0__'

export interface Types {
  radioValue: number | string | boolean | null | any

  // props (Radio)
  option: CommonOption & {
    // custom
    data?: any
    color?: string

    // element plus ui
    value?: Types['radioValue']
    label?: string
    disabled?: boolean
    border?: boolean
    size?: CustomSize
    name?: string // 原生 name 屬性
  }
}

export interface Props {
  options: Array<Types['option']>
  radioType: 'radio' | 'button'

  modelValue: Types['radioValue']
  size: CustomSize
  disabled: boolean
  textColor: string
  fill: string
  validateEvent: boolean
  ariaLabel: string
  id: string
  name: string
}
export const props = {
  // custom
  options: {
    type: Array as PropType<Props['options']>,
    default: () => []
  },
  radioType: {
    type: String as PropType<Props['radioType']>,
    required: false,
    default: 'radio',
    description: `類型:
       radio: ElRadio
       button: ElRadioButton
    `
  },
  // element ui plus (RadioGroup)
  modelValue: {
    type: [Boolean, String, Number, null] as PropType<Props['modelValue']>,
    required: true
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  textColor: {
    type: String as PropType<Props['textColor']>,
    required: false,
    default: undefined,
    description: '按鈕形式的 Radio 啟動時的文字顏色'
  },
  fill: {
    type: String as PropType<Props['fill']>,
    required: false,
    default: undefined,
    description: '按鈕形式的 Radio 啟動時的填充色和邊框色'
  },
  validateEvent: {
    type: Boolean as PropType<Props['validateEvent']>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: '原生 id 屬性'
  },
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  }
}

export interface Emits {
  change: (value: Props['modelValue']) => void
}

export interface Expose {
  focus: () => void
  blur: () => void
}

