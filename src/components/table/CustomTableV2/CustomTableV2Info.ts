import type { PropType } from 'vue'

export const version = '__CustomTableV2_1.0.0__'

export interface Types {}

export interface Props {
  renderKey: number

  cache: number
  rowKey: string
  data: Array<any>
  columns: Array<any>
  headerHeight: Array<number>| number
  rowHeight: number
  footerHeight: number
  fixed: boolean
}

export const props = {
  renderKey: {
    type: Number as PropType<Props['renderKey']>,
    required: false,
    default: 0,
    description: '重新渲染用的key'
  },
  // element ui
  cache: {
    type: Number as PropType<Props['cache']>,
    required: false,
    default: 6,
    description: '預先加載資料行數'
  },
  rowKey: {
    type: String as PropType<Props['rowKey']>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  data: {
    type: Array as PropType<Props['data']>,
    required: false,
    default: () => [],
    description: '顯示資料'
  },
  columns: {
    type: Array as PropType<Props['columns']>,
    required: false,
    default: () => [],
    description: '顯示欄位'
  },
  headerHeight: {
    type: [Array, Number] as PropType<Props['headerHeight']>,
    required: false,
    default: 50,
    description: 'Header 高度'
  },
  rowHeight: {
    type: Number as PropType<Props['rowHeight']>,
    required: false,
    default: 50,
    description: 'Row 高度'
  },
  footerHeight: {
    type: Number as PropType<Props['footerHeight']>,
    required: false,
    default: 0,
    description: 'Footer 高度'
  },
  fixed: {
    type: Boolean as PropType<Props['fixed']>,
    required: false,
    default: false,
    description: '寬度欄位是否固定 還是自適應'
  }
}

export interface Emits {}

export interface Expose {}
