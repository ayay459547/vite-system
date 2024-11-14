import type { PropType } from 'vue'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'
import type { SimpleTableExpose } from '@/components'

export const version = '__FormList_1.0.0__'

export declare namespace Types {
  type CollapseMethod = 'open' | 'close' | string
}

export declare namespace Props {
  type ModelValue = any[]
  type Label = string
  type Min = number
  type Max = number
  type ColumnSetting = Record<string, any>
  type TableKey = string
  type ItemKey = string
  type IsDraggable = boolean
  type DraggableGroup = string
  type IsEdit = boolean
  type IsCreate = boolean
  type CreatePosition = 'center' | 'right' | 'left'
  type IsRemove = boolean
  type IsShowNo = boolean
  type IsCollapse = boolean
  type Move = Function | any
  type Disabled = Function | any
  type SetDisabled = (row: any) => boolean
  type I18nModule = ScopeKey
}
export const props = {
  modelValue: {
    type: Array as PropType<Props.ModelValue>,
    default() {
      return []
    }
  },
  label: {
    type: String as PropType<Props.Label>,
    required: false,
    default: ''
  },
  min: {
    type: Number as PropType<Props.Min>,
    required: false,
    default: 0
  },
  max: {
    type: Number as PropType<Props.Max>,
    required: false,
    default: Infinity
  },
  columnSetting: {
    type: Object as PropType<Props.ColumnSetting>,
    required: true,
    default() {
      return {}
    }
  },
  tableKey: {
    type: String as PropType<Props.TableKey>,
    required: false,
    default: 'table'
  },
  itemKey: {
    type: String as PropType<Props.ItemKey>,
    required: false,
    default: 'id',
    description: `
      CustomTable: rowKey
      CustomDraggable: itemKey
    `
  },
  isDraggable: {
    type: Boolean as PropType<Props.IsDraggable>,
    required: false,
    default: false
  },
  draggableGroup: {
    type: String as PropType<Props.DraggableGroup>,
    required: false
  },
  isEdit: {
    type: Boolean as PropType<Props.IsEdit>,
    required: false,
    default: true,
    description: '是否可編輯'
  },
  isCreate: {
    type: Boolean as PropType<Props.IsCreate>,
    required: false,
    default: false,
    description: '是否可新增'
  },
  createPosition: {
    type: String as PropType<Props.CreatePosition>,
    required: false,
    default: 'center',
    description: `
      新增用按鈕的顯示位置
      種類: 'center' | 'right' | 'left'
    `
  },
  isRemove: {
    type: Boolean as PropType<Props.IsRemove>,
    required: false,
    default: false,
    description: '是否可刪除'
  },
  isShowNo: {
    type: Boolean as PropType<Props.IsShowNo>,
    required: false,
    default: false,
    description: '是否顯示編號'
  },
  isCollapse: {
    type: Boolean as PropType<Props.IsCollapse>,
    required: false,
    default: false,
    description: `
      是否允許摺疊FormList, 僅顯示標題與摺疊鍵
    `
  },
  move: {
    type: Function as PropType<Props.Move>,
    required: false,
    default: null,
    description: '用於draggable的移動後回掉函式'
  },
  disabled: {
    type: Function as PropType<Props.Disabled>,
    required: false,
    default: undefined,
    description: '用於定義draggable是否可移動'
  },
  setDisabled: {
    type: Function as PropType<Props.SetDisabled>,
    required: false,
    default: () => { return false },
    description: `
      用於判斷FormList Item是否禁止操作
    `
  },
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    default: defaultModuleType
  }
}

export declare namespace Emits {
  type Add = () => void
  type Remove = (rowIndex: number) => void
  type ExpandChange = (row: any, expanded: boolean, rowIndex: number, rowKey: any) => void
}

export declare namespace Expose {
  type SetCollapse = (method?: Types.CollapseMethod) => void

  type ToggleRowExpansion = SimpleTableExpose.ToggleRowExpansion
}

