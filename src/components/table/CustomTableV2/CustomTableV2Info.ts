import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Types {}

export declare namespace Props {
  type RenderKey = number

  type Cache = number
  type RowKey = string
  type Data = Array<any>
  type Columns = Array<any>
  type HeaderHeight = Array<number>| number
  type RowHeight = number
  type FooterHeight = number
  type Fixed = boolean
}

export const props = {
  renderKey: {
    type: Number as PropType<Props.RenderKey>,
    required: false,
    default: 0,
    description: '重新渲染用的key'
  },
  // element ui
  cache: {
    type: Number as PropType<Props.Cache>,
    required: false,
    default: 6,
    description: '預先加載資料行數'
  },
  rowKey: {
    type: String as PropType<Props.RowKey>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  data: {
    type: Array as PropType<Props.Data>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示資料'
  },
  columns: {
    type: Array as PropType<Props.Columns>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示欄位'
  },
  headerHeight: {
    type: [Array, Number] as PropType<Props.HeaderHeight>,
    required: false,
    default: 50,
    description: 'Header 高度'
  },
  rowHeight: {
    type: Number as PropType<Props.RowHeight>,
    required: false,
    default: 50,
    description: 'Row 高度'
  },
  footerHeight: {
    type: Number as PropType<Props.FooterHeight>,
    required: false,
    default: 0,
    description: 'Footer 高度'
  },
  fixed: {
    type: Boolean as PropType<Props.Fixed>,
    required: false,
    default: false,
    description: '寬度欄位是否固定 還是自適應'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
