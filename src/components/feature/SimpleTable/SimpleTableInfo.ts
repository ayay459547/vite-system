// import type { PropType } from 'vue'

export const version = '1.0.0'

export interface Props {
  modelValue?: Array<any> | any
  isDraggable?: boolean | any
  handle?: string | any
  itemKey?: string | any

  tableData?: Array<any> | any
  tableColumns?: Array<any> | any
}

export const props = {
  // row 可拖拉 table
  modelValue: {
    type: Array,
    default () {
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
  itemKey: {
    type: String,
    default: 'key'
  },
  // 一般 table
  tableData: {
    type: Array,
    default () {
      return []
    }
  },
  tableColumns: {
    type: Array,
    default () {
      return []
    }
  }
}
