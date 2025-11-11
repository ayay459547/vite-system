import type { PropType } from 'vue'
import type { CheckboxValueType, CheckboxGroupValueType } from 'element-plus'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import type { Option as CommonOption } from '@/components' // 系統組件

export const version = '__FormCheckbox_1.0.0__'

export interface Types {
  option: CommonOption & {
    label: string
    value: string | number | boolean | null
    disabled?: boolean
    data?: any
    color?: string
  }
}

export interface Props {
  options: Array<Types['option']>
  label: string
  i18nLabel: string
  i18nModule: ScopeKey

  modelValue: CheckboxValueType | CheckboxGroupValueType | any
  disabled: boolean
  indeterminate: boolean
}
export const props = {
  options: {
    type: Array as PropType<Props['options']>,
    required: false,
    default: () => [],
    description: '選項'
  },
  label: {
    type: String as PropType<Props['label']>,
    default: ''
  },
  i18nLabel: {
    type: String as PropType<Props['i18nLabel']>,
    default: ''
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: '翻譯模組'
  },
  // element ui plus
  modelValue: {
    type: [Array, String, Number, Boolean] as PropType<Props['modelValue']>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  indeterminate: {
    type: Boolean as PropType<Props['indeterminate']>,
    default: false
  }
}

export interface Emits {
  // CheckboxGroupValueType | CheckboxValueType
  change: (value: any) => void
}

export interface Expose {}

