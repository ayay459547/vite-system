import type { PropType } from 'vue'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '__SimpleTable_2.0.0__'

export declare namespace Types {
  type RowCallback<T> = ((
      data: {
        row: any
        rowIndex: number
      },
      ...payload: any[]
    ) => T)
  | null | undefined

  type CellCallback<T> = ((
      data: {
        row: any
        column: any
        rowIndex: number
        columnIndex: number
      },
      ...payload: any[]
    ) => T)
  | null | undefined

  type ExpandOptions = {
    rowKey: number | string
    row: any
    rowIndex: number
  }
}

export declare namespace Props {
  type ModelValue = Array<any> | any
  type IsDraggable = boolean | any
  type Handle = string | any
  type ItemKey = string | any
  type Move = Function | any
  type Disabled = Function | boolean | undefined

  type TableData = Array<any> | any
  type TableColumns = Array<any> | any

  type RowClassName = Types.RowCallback<string>
  type RowStyle = Types.RowCallback<Record<string, any>>
  type CellClassName = Types.CellCallback<string>
  type CellStyle = Types.CellCallback<Record<string, any>>

  type I18nModule = ScopeKey
  type HideHeader = boolean
}

export const props = {
  // row 可拖拉 table
  modelValue: {
    type: Array as PropType<Props.ModelValue>,
    default() {
      return []
    }
  },
  isDraggable: {
    type: Boolean as PropType<Props.IsDraggable>,
    default: false
  },
  handle: {
    type: String as PropType<Props.Handle>,
    default: undefined
  },
  group: {
    type: String as PropType<Props.ModelValue>,
    default: 'name'
  },
  itemKey: {
    type: String as PropType<Props.ItemKey>,
    default: 'id',
    description: `
      CustomTable: rowKey
      CustomDraggable: itemKey
    `
  },
  move: {
    type: Function as PropType<Props.Move>,
    required: false,
    default: null,
    description: `
      用於draggable的移動後回調函式
    `
  },
  disabled: {
    type: [Function, Boolean, undefined] as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '定義是否可移動'
  },
  // 一般 table
  rowClassName: {
    type: Function as PropType<Props.RowClassName>,
    description: 'row class callback'
  },
  rowStyle: {
    type: Function as PropType<Props.RowStyle>,
    description: 'row style callback'
  },
  cellClassName: {
    type: Function as PropType<Props.CellClassName>,
    description: 'cell class callback'
  },
  cellStyle: {
    type: Function as PropType<Props.CellStyle>,
    description: 'cell style callback'
  },
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    default: defaultModuleType
  },
  hideHeader: {
    type: Boolean as PropType<Props.HideHeader>,
    default: false
  },
  tableData: {
    type: Array as PropType<Props.TableData>,
    default() {
      return []
    }
  },
  tableColumns: {
    type: Array as PropType<Props.TableColumns>,
    default() {
      return []
    }
  }
}

export declare namespace Emits {
  type ExpandChange = (row: any, expanded: boolean, rowIndex: number, rowKey: any) => void
}

export declare namespace Expose {
  type SetExpand = (options: Types.ExpandOptions, expanded?: boolean) => void
}
