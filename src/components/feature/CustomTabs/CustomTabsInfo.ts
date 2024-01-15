import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-tabs__')

export type ListItem = {
  key: string | number
  label: string
  value?: any
}
export type ListType = Array<ListItem>
export type ModelValue = string | number | null
export type TabPosition = 'left' | 'right'

export const props = {
  modelValue: {
    type: [String, Number, null] as PropType<ModelValue>,
    required: true,
    description: 'v-model'
  },
  list: {
    type: Array as PropType<ListType>,
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
  }
}
