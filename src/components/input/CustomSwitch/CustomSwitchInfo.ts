import type { PropType, Component } from 'vue'

export const version = '__CustomSwitch_1.0.0__'

export interface Types {
  size: '' | 'large' | 'default' | 'small'
}

export interface Props {
  modelValue: boolean
  disabled: boolean
  loading: boolean
  size: Types['size']
  width: string | number
  inlinePrompt: boolean
  activeIcon: string | Component
  inactiveIcon: string | Component
  activeActionIcon: string | Component
  inactiveActionIcon: string | Component
  activeText: string
  inactiveText: string
  activeValue: boolean | string | number
  inactiveValue: boolean | string | number
  name: string
  validateEvent: boolean
  beforeChange: () => (Promise<boolean> | boolean)
  id: string
  tabindex: string | number
  ariaLabel: string
}

export const props = {
  modelValue: {
    type: Boolean as PropType<Props['modelValue']>,
    required: true
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    default: false
  },
  loading: {
    type: Boolean as PropType<Props['loading']>,
    default: false
  },
  size: {
    type: String as PropType<Props['size']>,
    default: ''
  },
  width: {
    type: [String, Number] as PropType<Props['width']>,
    default: ''
  },
  inlinePrompt: {
    type: Boolean as PropType<Props['inlinePrompt']>,
    required: false,
    default: false,
    description: '無論圖示或文字是否顯示在點內，只會呈現文字的第一個字符'
  },
  activeIcon: {
    type: [String, Object] as PropType<Props['activeIcon']>,
    required: false,
    default: undefined,
    description: 'switch 狀態為 on 時所顯示圖標，設定此項目會忽略 active-text'
  },
  inactiveIcon: {
    type: [String, Object] as PropType<Props['inactiveIcon']>,
    required: false,
    default: undefined,
    description: 'switch 狀態為 off 時所顯示圖標，設定此項目會忽略 inactive-text'
  },
  activeActionIcon: {
    type: [String, Object] as PropType<Props['activeActionIcon']>,
    required: false,
    default: undefined,
    description: 'on狀態下顯示的圖示組件'
  },
  inactiveActionIcon: {
    type: [String, Object] as PropType<Props['inactiveActionIcon']>,
    required: false,
    default: undefined,
    description: 'off狀態下顯示的圖示組件'
  },
  activeText: {
    type: String as PropType<Props['activeText']>,
    required: false,
    default: '',
    description: 'switch 狀態為 on 時的值的文字描述'
  },
  inactiveText: {
    type: String as PropType<Props['inactiveText']>,
    required: false,
    default: '',
    description: 'switch 狀態為 off 時的值的文字描述'
  },
  activeValue: {
    type: [Boolean, String, Number] as PropType<Props['activeValue']>,
    required: false,
    default: true,
    description: 'switch 狀態為 on 時的值'
  },
  inactiveValue: {
    type: [Boolean, String, Number] as PropType<Props['inactiveValue']>,
    required: false,
    default: false,
    description: 'switch的狀態為 off 時的值'
  },
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: '',
    description: 'switch 對應的 name 屬性'
  },
  validateEvent: {
    type: Boolean as PropType<Props['validateEvent']>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  beforeChange: {
    type: [Boolean, Function] as PropType<Props['beforeChange']>,
    required: false,
    default: undefined,
    description: 'switch 狀態改變前的鉤子， 返回 false 或返回 Promise 且被 reject 則停止切換'
  },
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: 'input 的 id'
  },
  tabindex: {
    type: [String, Number] as PropType<Props['tabindex']>,
    required: false,
    default: undefined,
    description: 'input 的 tabindex'
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  }
}

export interface Emits {
  change: (val: string | number | boolean) => void
}

export interface Expose {}
