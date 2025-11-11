import type { PropType } from 'vue'
import type { TabsPaneContext, TabPaneName } from 'element-plus'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import type { Option } from '@/components' // 系統組件

export const version = '__CustomTabs_1.0.0__'

export interface Types {
  action: 'remove' | 'add'
}

export interface Props {
  modelValue: string | number | null
  options: Array<Option<string | number>>
  type: '' | 'card' | 'border-card'
  closable: boolean
  addable: boolean
  editable: boolean
  tabPosition: 'top' | 'right' | 'bottom' | 'left'
  stretch: boolean
  beforeLeave: (activeName: TabPaneName, oldActiveName: TabPaneName) => void | boolean
}
export const props = {
  // custom
  options: {
    type: Array as PropType<Props['options']>,
    required: true,
    description: 'tabs 列表'
  },
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: defaultModuleType,
    description: `
      list:label 使用 i18nLabel 時套用的翻譯模組
    `
  },
  // element plus ui
  modelValue: {
    type: [String, Number, null] as PropType<Props['modelValue']>,
    required: true,
    description: 'v-model'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: '',
    description: '類型'
  },
  closable: {
    type: Boolean as PropType<Props['closable']>,
    default: false,
    description: '是否可刪除'
  },
  addable: {
    type: Boolean as PropType<Props['addable']>,
    default: false,
    description: '是否可新增'
  },
  editable: {
    type: Boolean as PropType<Props['editable']>,
    default: false,
    description: '是否可新增+刪除'
  },
  tabPosition: {
    type: String as PropType<Props['tabPosition']>,
    required: false,
    default: 'top',
    description: '位置'
  },
  stretch: {
    type: Boolean as PropType<Props['stretch']>,
    default: false,
    description: '是否自動撐開'
  },
  beforeLeave: {
    type: Function as PropType<Props['beforeLeave']>,
    default: () => {
      return () => true
    },
    description: '切換標籤之前的鉤子函數， 若傳回 false 或傳回被 reject 的 Promise，則阻止切換。'
  }
}

export interface Emits {
  tabClick: (pane: TabsPaneContext, ev: Event) => void
  tabChange:	(name: TabPaneName) => void
  tabRemove:	(name: TabPaneName) => void
  tabAdd: () => void
  edit: (paneName: TabPaneName | undefined, action: Types['action']) => void
}

export interface Expose {}
