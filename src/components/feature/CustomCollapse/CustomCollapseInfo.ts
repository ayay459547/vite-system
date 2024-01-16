import type { PropType } from 'vue'

export const version = '1.0.0'

export type ModelValue = string | string[]

export type Options = {
  lable: string
  value: string
  disabled?: boolean
} & any

export const props = {
  modelValue: {
    type: [Array, String] as PropType<ModelValue>,
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
    type: Array as PropType<Options[]>,
    default () {
      return []
    }
  }
}
