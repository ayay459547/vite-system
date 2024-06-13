// import type { PropType } from 'vue'

export const version = '1.0.0'

export interface Props extends Record<string, any> {
  modelValue?: Array<any> | any
  isDraggable?: boolean | any
  handle?: string | any
  itemKey?: string | any
  move?: Function | any

  tableData?: Array<any> | any
  tableColumns?: Array<any> | any

  i18nModule?: string | any
}

export const props = {
  // row 可拖拉 table
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  isDraggable: {
    type: Boolean,
    default: false
  },
  handle: {
    type: String,
    default: '.__draggable'
  },
  group: {
    type: String,
    default: 'name'
  },
  itemKey: {
    type: String,
    default: 'key'
  },
  move: {
    type: Function,
    required: false,
    default: null,
    description: `
      用於draggable的移動後回調函式
    `
  },
  // 一般 table
  tableData: {
    type: Array,
    default() {
      return []
    }
  },
  tableColumns: {
    type: Array,
    default() {
      return []
    }
  },
  i18nModule: {
    type: String,
    default: 'system'
  },
  hideHeader: {
    type: Boolean,
    default: false
  }
}
