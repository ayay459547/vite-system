import type { PropType } from 'vue'
import type { Option } from '@/declare/columnSetting'

export const version = '1.0.0'

type CollapseValue = string | number

export declare namespace Props {
  type ModelValue = CollapseValue | Array<CollapseValue>
  type Accordion = boolean
  type Options = Array<Option>
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
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否為手風琴模式'
  },
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  }
}
