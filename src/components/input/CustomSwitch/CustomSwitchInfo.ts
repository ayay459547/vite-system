import type { PropType, Component } from 'vue'

export const version = '__CustomSwitch_1.0.0__'

export declare namespace Types {
  type Size = '' | 'large' | 'default' | 'small'
}

export declare namespace Props {
  type ModelValue = boolean
  type Disabled = boolean
  type Loading = boolean
  type Size = Types.Size
  type Width = string | number
  type InlinePrompt = boolean
  type ActiveIcon = string | Component
  type InactiveIcon = string | Component
  type ActiveActionIcon = string | Component
  type InactiveActionIcon = string | Component
  type ActiveText = string
  type InactiveText = string
  type ActiveValue = boolean | string | number
  type InactiveValue = boolean | string | number
  type Name = string
  type ValidateEvent = boolean
  type BeforeChange = () => (Promise<boolean> | boolean)
  type Id = string
  type Tabindex = string | number
  type AriaLabel = string
}

export const props = {
  modelValue: {
    type: Boolean as PropType<Props.ModelValue>,
    required: true
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  loading: {
    type: Boolean as PropType<Props.Loading>,
    default: false
  },
  size: {
    type: String as PropType<Props.Size>,
    default: ''
  },
  width: {
    type: [String, Number] as PropType<Props.Width>,
    default: ''
  },
  inlinePrompt: {
    type: Boolean as PropType<Props.InlinePrompt>,
    required: false,
    default: false,
    description: '無論圖示或文字是否顯示在點內，只會呈現文字的第一個字符'
  },
  activeIcon: {
    type: [String, Object] as PropType<Props.ActiveIcon>,
    required: false,
    default: undefined,
    description: 'switch 狀態為 on 時所顯示圖標，設定此項目會忽略 active-text'
  },
  inactiveIcon: {
    type: [String, Object] as PropType<Props.InactiveIcon>,
    required: false,
    default: undefined,
    description: 'switch 狀態為 off 時所顯示圖標，設定此項目會忽略 inactive-text'
  },
  activeActionIcon: {
    type: [String, Object] as PropType<Props.ActiveActionIcon>,
    required: false,
    default: undefined,
    description: 'on狀態下顯示的圖示組件'
  },
  inactiveActionIcon: {
    type: [String, Object] as PropType<Props.InactiveActionIcon>,
    required: false,
    default: undefined,
    description: 'off狀態下顯示的圖示組件'
  },
  activeText: {
    type: String as PropType<Props.ActiveText>,
    required: false,
    default: '',
    description: 'switch 狀態為 on 時的值的文字描述'
  },
  inactiveText: {
    type: String as PropType<Props.InactiveText>,
    required: false,
    default: '',
    description: 'switch 狀態為 off 時的值的文字描述'
  },
  activeValue: {
    type: [Boolean, String, Number] as PropType<Props.ActiveValue>,
    required: false,
    default: true,
    description: 'switch 狀態為 on 時的值'
  },
  inactiveValue: {
    type: [Boolean, String, Number] as PropType<Props.InactiveValue>,
    required: false,
    default: false,
    description: 'switch的狀態為 off 時的值'
  },
  name: {
    type: String as PropType<Props.Name>,
    required: false,
    default: '',
    description: 'switch 對應的 name 屬性'
  },
  validateEvent: {
    type: Boolean as PropType<Props.ValidateEvent>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  beforeChange: {
    type: [Boolean, Function] as PropType<Props.BeforeChange>,
    required: false,
    default: undefined,
    description: 'switch 狀態改變前的鉤子， 返回 false 或返回 Promise 且被 reject 則停止切換'
  },
  id: {
    type: String as PropType<Props.Id>,
    required: false,
    default: undefined,
    description: 'input 的 id'
  },
  tabindex: {
    type: [String, Number] as PropType<Props.Tabindex>,
    required: false,
    default: undefined,
    description: 'input 的 tabindex'
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  }
}

export declare namespace Emits {
  type Change = (val: string | number | boolean) => void
}

export declare namespace Expose {}
