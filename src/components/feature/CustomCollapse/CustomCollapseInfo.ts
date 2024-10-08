import type { PropType } from 'vue'

import type { Option } from '@/declare/columnSetting'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '__CustomCollapse_1.0.0__'

export declare namespace Types {
  type CollapseValue = string | number
}

export declare namespace Props {
  type ModelValue = Types.CollapseValue | Array<Types.CollapseValue>
  type Accordion = boolean
  type Options = Array<Option<Types.CollapseValue>>
  type I18nModule = ScopeKey
}

export const props = {
  modelValue: {
    type: [Array, String] as PropType<Props.ModelValue>,
    default: '',
    description: `
      v-model 綁定是否顯示
      一般模式 值為陣列: 可展開多個
      手風琴模式 值為字串: 只能展開一個`
  },
  accordion: {
    type: Boolean as PropType<Props.Accordion>,
    default: false,
    description: '是否為手風琴模式'
  },
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  },
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  }
}

export declare namespace Emits {
  type Change = (active: Props.ModelValue) => void
}

export declare namespace Expose {}
