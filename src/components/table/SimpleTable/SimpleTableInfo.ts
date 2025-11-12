import type { PropType } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import type { Emits as CustomDraggableEmits } from '@/components/feature/CustomDraggable/CustomDraggableInfo'

export const version = '__SimpleTable_2.0.0__'

export interface Types {
  rowCallback: (
    data: {
      row: any
      rowIndex: number
    },
    ...payload: any[]
  ) => any

  cellCallback: (
    data: {
      row: any
      column: any
      rowIndex: number
      columnIndex: number
    },
    ...payload: any[]
  ) => any

  expandOptions: {
    rowKey: number | string
    row: any
    rowIndex: number
  }
}

export interface Props {
  modelValue: Array<any> | any
  isDraggable: boolean | any
  handle: string | any
  itemKey: string | any
  move: ((...args: any[]) => any) | any
  disabled: ((...args: any[]) => any) | boolean | undefined

  tableData: Array<any> | any
  tableColumns: Array<any> | any

  rowClassName: Types['rowCallback']
  rowStyle: Types['rowCallback']
  cellClassName: Types['cellCallback']
  cellStyle: Types['cellCallback']

  i18nModule: ScopeKey
  hideHeader: boolean
}

export const props = {
  // row 可拖拉 table
  modelValue: {
    type: Array as PropType<Props['modelValue']>,
    default: () => []
  },
  isDraggable: {
    type: Boolean as PropType<Props['isDraggable']>,
    default: false
  },
  handle: {
    type: String as PropType<Props['handle']>,
    default: undefined
  },
  group: {
    type: String as PropType<Props['modelValue']>,
    default: 'name'
  },
  itemKey: {
    type: String as PropType<Props['itemKey']>,
    default: 'id',
    description: `
      功能類似 CustomTable: rowKey
      對應到 CustomDraggable: itemKey
    `
  },
  move: {
    type: Function as PropType<Props['move']>,
    required: false,
    default: null,
    description: `
      用於draggable的移動後回調函式
    `
  },
  disabled: {
    type: [Function, Boolean, undefined] as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '定義是否可移動'
  },
  // 一般 table
  rowClassName: {
    type: Function as PropType<Props['rowClassName']>,
    default: undefined,
    description: 'row class callback'
  },
  rowStyle: {
    type: Function as PropType<Props['rowStyle']>,
    default: undefined,
    description: 'row style callback'
  },
  cellClassName: {
    type: Function as PropType<Props['cellClassName']>,
    default: undefined,
    description: 'cell class callback'
  },
  cellStyle: {
    type: Function as PropType<Props['cellStyle']>,
    default: undefined,
    description: 'cell style callback'
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    default: defaultModuleType
  },
  hideHeader: {
    type: Boolean as PropType<Props['hideHeader']>,
    default: false
  },
  tableData: {
    type: Array as PropType<Props['tableData']>,
    default: () => []
  },
  tableColumns: {
    type: Array as PropType<Props['tableColumns']>,
    default: () => []
  }
}

export interface Emits {
  expandChange: (row: any, expanded: boolean, rowIndex: number, rowKey: any) => void
  start: CustomDraggableEmits['start']
  end: CustomDraggableEmits['end']
  change: CustomDraggableEmits['change']
}

export interface Expose {
  setExpand: (options: Types['expandOptions'], expanded?: boolean) => void
  toggleRowExpansion: (row: any, expanded?: boolean) => void
}
