import type { PropType } from 'vue'

import type { Option as CommonOption, CustomSize } from '@/components' // 系統組件

export const version = '__FormRadio_1.0.0__'

export declare namespace Types {
  type RadioValue = number | string | boolean | null | any

  // props (Radio)
  type Option = CommonOption & {
    // custom
    data?: any
    color?: string

    // element plus ui
    value?: Types.RadioValue
    label?: string
    disabled?: boolean
    border?: boolean
    size?: CustomSize
    name?: string // 原生 name 屬性
  }
}

export declare namespace Props {
  type Options = Array<Types.Option>
  type RadioType = 'radio' | 'button'

  type ModelValue = Types.RadioValue
  type Size = CustomSize
  type Disabled = boolean
  type TextColor = string
  type Fill = string
  type ValidateEvent = boolean
  type AriaLabel = string
  type Id = string
  type Name = string
}
export const props = {
  // custom
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  },
  radioType: {
    type: String as PropType<Props.RadioType>,
    required: false,
    default: 'radio',
    description: `類型:
       radio: ElRadio
       button: ElRadioButton
    `
  },
  // element ui plus (RadioGroup)
  modelValue: {
    type: [Boolean, String, Number, null] as PropType<Props.ModelValue>,
    required: true
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  textColor: {
    type: String as PropType<Props.TextColor>,
    required: false,
    default: undefined,
    description: '按鈕形式的 Radio 啟動時的文字顏色'
  },
  fill: {
    type: String as PropType<Props.Fill>,
    required: false,
    default: undefined,
    description: '按鈕形式的 Radio 啟動時的填充色和邊框色'
  },
  validateEvent: {
    type: Boolean as PropType<Props.ValidateEvent>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  id: {
    type: String as PropType<Props.Id>,
    required: false,
    default: undefined,
    description: '原生 id 屬性'
  },
  name: {
    type: String as PropType<Props.Name>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  }
}

export declare namespace Emits {
  type Change = (value: Props.ModelValue) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
}

