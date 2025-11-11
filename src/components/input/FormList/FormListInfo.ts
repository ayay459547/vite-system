import type { PropType } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import type { Expose as SimpleTableExpose } from '@/components/table/SimpleTable/SimpleTableInfo'
import type { Emits as CustomDraggableEmits } from '@/components/feature/CustomDraggable/CustomDraggableInfo'

export const version = '__FormList_1.0.0__'

export interface Types {
  collapseMethod: 'open' | 'close' | string
}

export interface Props {
  modelValue: any[]
  label: string
  min: number
  max: number
  columnSetting: Record<string, any>
  tableKey: string
  itemKey: string
  isDraggable: boolean
  draggableGroup: string
  isEdit: boolean
  isCreate: boolean
  createPosition: 'center' | 'right' | 'left'
  isRemove: boolean
  isShowNo: boolean
  isCollapse: boolean
  move: Function | any
  disabled: Function | any
  setDisabled: (row: any) => boolean
  i18nModule: ScopeKey
}
export const props = {
  modelValue: {
    type: Array as PropType<Props['modelValue']>,
    default: () => []
  },
  label: {
    type: String as PropType<Props['label']>,
    required: false,
    default: ''
  },
  min: {
    type: Number as PropType<Props['min']>,
    required: false,
    default: 0
  },
  max: {
    type: Number as PropType<Props['max']>,
    required: false,
    default: Infinity
  },
  columnSetting: {
    type: Object as PropType<Props['columnSetting']>,
    required: true,
    default: () => {
      return {}
    }
  },
  tableKey: {
    type: String as PropType<Props['tableKey']>,
    required: false,
    default: 'table'
  },
  itemKey: {
    type: String as PropType<Props['itemKey']>,
    required: false,
    default: 'id',
    description: `
      CustomTable: rowKey
      CustomDraggable: itemKey
    `
  },
  isDraggable: {
    type: Boolean as PropType<Props['isDraggable']>,
    required: false,
    default: false
  },
  draggableGroup: {
    type: String as PropType<Props['draggableGroup']>,
    required: false
  },
  isEdit: {
    type: Boolean as PropType<Props['isEdit']>,
    required: false,
    default: true,
    description: '是否可編輯'
  },
  isCreate: {
    type: Boolean as PropType<Props['isCreate']>,
    required: false,
    default: false,
    description: '是否可新增'
  },
  createPosition: {
    type: String as PropType<Props['createPosition']>,
    required: false,
    default: 'center',
    description: `
      新增用按鈕的顯示位置
      種類: 'center' | 'right' | 'left'
    `
  },
  isRemove: {
    type: Boolean as PropType<Props['isRemove']>,
    required: false,
    default: false,
    description: '是否可刪除'
  },
  isShowNo: {
    type: Boolean as PropType<Props['isShowNo']>,
    required: false,
    default: true,
    description: '是否顯示編號'
  },
  isCollapse: {
    type: Boolean as PropType<Props['isCollapse']>,
    required: false,
    default: false,
    description: `
      是否允許摺疊FormList, 僅顯示標題與摺疊鍵
    `
  },
  move: {
    type: Function as PropType<Props['move']>,
    required: false,
    default: null,
    description: '用於draggable的移動後回掉函式'
  },
  disabled: {
    type: Function as PropType<Props['disabled']>,
    required: false,
    default: undefined,
    description: '用於定義draggable是否可移動'
  },
  setDisabled: {
    type: Function as PropType<Props['setDisabled']>,
    required: false,
    default: () => false,
    description: `
      用於判斷FormList Item是否禁止操作
    `
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    default: defaultModuleType
  }
}

export interface Emits {
  add: () => void
  remove: (rowIndex: number) => void
  clear: () => void
  expandChange: (row: any, expanded: boolean, rowIndex: number, rowKey: any) => void
  start: CustomDraggableEmits['start']
  end: CustomDraggableEmits['end']
  change: CustomDraggableEmits['change']
}

export interface Expose {
  setCollapse: (method?: Types['collapseMethod']) => void
  toggleRowExpansion: SimpleTableExpose['toggleRowExpansion']
}

