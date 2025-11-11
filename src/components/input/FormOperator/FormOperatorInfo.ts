import type { PropType } from 'vue'

import type { Options as CommonOptions } from '@/components' // 系統組件

export const version = '__FormOperator_1.0.0__'

export interface Types {
  operatorOptions: 'equal' | 'greatthan' | 'lessthan' | '' | string | null
  operatorValue: string | number | null
}

export interface Props {
  modelValue: [Types['operatorOptions'], Types['operatorValue']] | any
  Type: string
  OnlyNumber: boolean
  round: number | null
  max: number | null
  min: number | null
  clearable: boolean
  disabled: boolean
  options: CommonOptions
  placeholder: string
}
export const props = {
  modelValue: {
    type: Array as PropType<Props['modelValue']>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  // 數字
  type: {
    type: String as PropType<Props['Type']>,
    required: false,
    default: 'text',
    description: '類型'
  },
  round: {
    type: [Number, null] as PropType<Props['round']>,
    default: null
  },
  max: {
    type: [Number, null] as PropType<Props['max']>,
    default: null
  },
  min: {
    type: [Number, null] as PropType<Props['min']>,
    default: null
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<Props['clearable']>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    default: false
  },
  options: {
    type: Array as PropType<Props['options']>,
    default: () => {
      return [
        // { label: '=', value: 'equal' },
        // { label: '>', value: 'greatterThan' },
        // { label: '>=', value: 'greatterThanOrEqualTo' },
        // { label: '<', value: 'lessThan' },
        // { label: '<=', value: 'lessThanOrEqualTo' },
        // { label: '<>', value: 'notEqual' }
      ]
    }
  },
  placeholder: {
    type: String as PropType<Props['placeholder']>,
    required: false
  }
}

export interface Emits {
  focus: ($event: FocusEvent) => void
  clear: () => void
  blur: ($event: FocusEvent) => Promise<void>
  change: (value: Props['modelValue']) => void
  input: (value: Props['modelValue']) => void
}

export interface Expose {
  focus: () => void
  blur: () => void
}

