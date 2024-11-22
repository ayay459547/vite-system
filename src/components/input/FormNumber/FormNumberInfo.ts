import type { PropType } from 'vue'

import type { CustomSize } from '@/components'
export const version = '__FormNumber_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Round = number
  type Floor = number
  type Ceil = number

  type ModelValue = number
  type Min = number
  type Max = number
  type Step = number
  type StepStrictly = boolean
  type Precision = number
  type Size = CustomSize
  type Readonly = boolean
  type Disabled = boolean
  type Controls = boolean
  type ControlsPosition = string | '' | 'right' | any
  type Name = string
  type AriaLabel = string
  type Placeholder = string
  type Id = string
  type ValueOnClear = string | number | boolean | Function
  type ValidateEvent = boolean
  type Clearable = boolean
}
export const props = {
  // custom
  round: {
    type: Number as PropType<Props.Round>,
    required: false,
    default: undefined,
    description: '四捨五入 取小數點到第幾位，type === number'
  },
  floor: {
    type: Number as PropType<Props.Floor>,
    required: false,
    default: undefined,
    description: '無條件捨去 取小數點到第幾位，type === number'
  },
  ceil: {
    type: Number as PropType<Props.Ceil>,
    required: false,
    default: undefined,
    description: '無條件進位 取小數點到第幾位，type === number'
  },
  // element ui plus
  modelValue: {
    type: [String, Number] as PropType<Props.ModelValue>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  min: {
    type: Number as PropType<Props.Min>,
    required: false,
    default: undefined,
    description: '最小值，type === number'
  },
  max: {
    type: Number as PropType<Props.Max>,
    required: false,
    default: undefined,
    description: '最大值，type === number'
  },
  step: {
    type: Number as PropType<Props.Step>,
    required: false,
    default: 1,
    description: '計數器步長'
  },
  stepStrictly: {
    type: Boolean as PropType<Props.StepStrictly>,
    required: false,
    default: false,
    description: '是否只能輸入 step 的倍數'
  },
  precision: {
    type: Number as PropType<Props.Precision>,
    required: false,
    default: undefined,
    description: '數值精度'
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  readonly: {
    type: Boolean as PropType<Props.Readonly>,
    required: false,
    default: false,
    description: '原生 readonly 屬性, 是否唯讀'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  controls: {
    type: Boolean as PropType<Props.Controls>,
    required: false,
    default: false,
    description: '是否使用控制按鈕'
  },
  controlsPosition: {
    type: String as PropType<Props.ControlsPosition>,
    required: false,
    default: undefined,
    description: '控制按鈕位置'
  },
  name: {
    type: String as PropType<Props.Name>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  id: {
    type: String as PropType<Props.Id>,
    required: false,
    default: undefined,
    description: '等價於原生 input id 屬性'
  },
  valueOnClear: {
    type: [String, Number, Boolean, Function] as PropType<Props.ValueOnClear>,
    required: false,
    default: null,
    description: '組件的空值配置 參考 Config Provider'
  },
  validateEvent: {
    type: Boolean as PropType<Props.ValidateEvent>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  }
}

export declare namespace Emits {
  type Blur = (event: FocusEvent) => void
  type Focus = (event: FocusEvent) => void
  type Change = (value: Props.ModelValue) => void
}

export declare namespace Expose {
  type Blur = () => void
  type Focus = () => void
}
