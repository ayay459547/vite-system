import type { PropType } from 'vue'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '1.0.0'

export type Option = {
  label: string
  value: string | number | null
  i18nLabel?: string
  data?: any
}
export type Options = Array<Option>
export type ModelValue = string | number | null
export type TabPosition = 'left' | 'right'

export const props = {
  modelValue: {
    type: [String, Number, null] as PropType<ModelValue>,
    required: true,
    description: 'v-model'
  },
  options: {
    type: Array as PropType<Options>,
    required: true,
    description: 'tabs 列表'
  },
  remove: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否可刪除'
  },
  background: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '加上背景色'
  },
  move: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: `
      如果 tabs 可能過多會用到
      值發生變化時自動 移動到對應的值`
  },
  tabPosition: {
    type: String as PropType<TabPosition>,
    default: 'left',
    description: `位置
      left: flex-start (左邊)
      right: flex-end (右邊)
    `
  },
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: defaultModuleType,
    description: `
      list:label 使用 i18nLabel 時套用的翻譯模組
    `
  }
}
