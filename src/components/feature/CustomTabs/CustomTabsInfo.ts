import type { PropType } from 'vue'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '1.0.0'

export type Option = {
  label: string
  value: string | number | null
  i18nLabel?: string
  disabled?: boolean
  data?: any
}
export type Options = Array<Option>
export type ModelValue = string | number | null
export type TabPosition = 'left' | 'right'

export declare namespace Props {
  type ModelValue = string | number | null
  type Options = Array<Option>
  type Type = '' | 'card' | 'border-card'
  type Closable = boolean
  type Addable = boolean
  type Editable = boolean
  type TabPosition = 'top' | 'right' | 'bottom' | 'left'
  type Stretch = boolean
}

export const props = {
  modelValue: {
    type: [String, Number, null] as PropType<Props.ModelValue>,
    required: true,
    description: 'v-model'
  },
  options: {
    type: Array as PropType<Props.Options>,
    required: true,
    description: 'tabs 列表'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: '',
    description: '類型'
  },
  closable: {
    type: Boolean as PropType<Props.Closable>,
    default: false,
    description: '是否可刪除'
  },
  addable: {
    type: Boolean as PropType<Props.Addable>,
    default: false,
    description: '是否可新增'
  },
  editable: {
    type: Boolean as PropType<Props.Editable>,
    default: false,
    description: '是否可新增+刪除'
  },
  tabPosition: {
    type: String as PropType<Props.TabPosition>,
    required: false,
    default: '',
    description: '位置'
  },
  stretch: {
    type: Boolean as PropType<Props.Stretch>,
    default: false,
    description: '是否自動撐開'
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
