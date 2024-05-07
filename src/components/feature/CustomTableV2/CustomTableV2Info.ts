import type { PropType } from 'vue'

export const version = '1.0.0'

export const props = {
  renderKey: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: '重新渲染用的key'
  },
  // element ui
  rowKey: {
    type: String as PropType<string>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  data: {
    type: Array as PropType<Array<any>>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示資料'
  },
  columns: {
    type: Array as PropType<Array<any>>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示欄位'
  },
  rowHeight: {
    type: Number as PropType<number>,
    required: false,
    default: 50,
    description: 'Row 高度'
  },
  headerHeight: {
    type: Number as PropType<number>,
    required: false,
    default: 50,
    description: 'Header 高度'
  },
  footerHeight: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: 'Footer 高度'
  },
  cache: {
    type: Number as PropType<number>,
    required: false,
    default: 12,
    description: '預先加載資料行數'
  },
  fixed: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '寬度欄位是否固定 還是自適應'
  }
}
