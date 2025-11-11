import type { PropType } from 'vue'

import type { Option } from '@/types/types_columnSetting'
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

export const version = '__CustomCollapse_1.0.0__'

export interface Types {
  collapseValue: string | number
}

export interface Props {
  modelValue: Types['collapseValue'] | Array<Types['collapseValue']>
  accordion: boolean
  options: Array<Option<Types['collapseValue']>>
  i18nModule: ScopeKey
}

export const props = {
  modelValue: {
    type: [Array, String] as PropType<Props['modelValue']>,
    default: '',
    description: `
      v-model 綁定是否顯示
      一般模式 值為陣列: 可展開多個
      手風琴模式 值為字串: 只能展開一個`
  },
  accordion: {
    type: Boolean as PropType<Props['accordion']>,
    default: false,
    description: '是否為手風琴模式'
  },
  options: {
    type: Array as PropType<Props['options']>,
    default: () => []
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  }
}

export interface Emits {
  change: (active: Props['modelValue']) => void
}

export interface Expose {}
