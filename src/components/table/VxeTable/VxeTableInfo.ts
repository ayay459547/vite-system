import type { PropType } from 'vue'
import type { VxeTablePropTypes } from 'vxe-table'

import { getUuid } from '@/lib/lib_utils' // 工具

export const version = '__VxeTable_1.0.0__'

export declare namespace Types {
  type Merges = VxeTablePropTypes.MergeCells
  type ColumnConfig = VxeTablePropTypes.ColumnOpts<any>
  type RowConfig = VxeTablePropTypes.RowOpts<any>

  type RowClassCallbackParams = {
    row?: any
    rowIndex?: number
    $rowIndex?: number
  }
  type CellClassCallbackParams = {
    row?: any
    rowIndex?: number
    $rowIndex?: number

    column?: any
    columnIndex?: number
    $columnIndex?: number
  }
}

export declare namespace Props {
  type ID = string
  type Data = Array<any>
  type EmptyText = string
  type FooterData = Array<any>

  type RowClassName = string | ((params: Types.RowClassCallbackParams) => any) | undefined
  type CellClassName = string | ((params: Types.CellClassCallbackParams) => any) | undefined
  type HeaderRowClassName = string | ((params: Types.RowClassCallbackParams) => any) | undefined
  type HeaderCellClassName = string | ((params: Types.CellClassCallbackParams) => any) | undefined
  type FooterRowClassName = string | ((params: Types.RowClassCallbackParams) => any) | undefined
  type FooterCellClassName = string | ((params: Types.CellClassCallbackParams) => any) | undefined

  type ColumnConfig = Types.ColumnConfig
  type RowConfig = Types.RowConfig
  type FilterConfig = Record<string, any>
  type ScrollY = Record<string, any>
  type ScrollX = Record<string, any>
  type ShowHeader = boolean
  type ShowOverflow = boolean
  type ShowHeaderOverflow = boolean
  type ShowFooterOverflow = boolean
  type ShowFooter = boolean
  type Border = boolean
  type Stripe = boolean
  type MergeCells = VxeTablePropTypes.MergeCells
}

/**
 * https://vxetable.cn/#/table/api
 */
export const props = {
  id: {
    type: String as PropType<Props.ID>,
    required: false,
    default: () => {
      return getUuid('__vxe-table__')
    },
    description: '唯一值'
  },
  data: {
    type: Array as PropType<Props.Data>,
    required: false,
    default: () => {
      return []
    },
    description: '資料'
  },
  emptyText: {
    type: String as PropType<Props.EmptyText>,
    required: false,
    default: undefined,
    description: '無資料顯示文字'
  },
  footerData: {
    type: Array as PropType<Props.FooterData>,
    required: false,
    default: () => {
      return []
    },
    description: '資料'
  },
  rowClassName: {
    type: [Function, String] as PropType<Props.RowClassName>,
    required: false,
    default: undefined,
    description: '將表格的行附加 className'
  },
  cellClassName: {
    type: [Function, String] as PropType<Props.CellClassName>,
    required: false,
    default: undefined,
    description: '將表格的儲存格附加 className'
  },
  headerRowClassName: {
    type: [Function, String] as PropType<Props.HeaderRowClassName>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  },
  headerCellClassName: {
    type: [Function, String] as PropType<Props.HeaderCellClassName>,
    required: false,
    default: undefined,
    description: '將表頭的儲存格附加 className'
  },
  footerRowClassName: {
    type: [Function, String] as PropType<Props.FooterRowClassName>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  },
  footerCellClassName: {
    type: [Function, String] as PropType<Props.FooterCellClassName>,
    required: false,
    default: undefined,
    description: '將表頭的儲存格附加 className'
  },
  columnConfig: {
    type: Object as PropType<Props.ColumnConfig>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  rowConfig: {
    type: Object as PropType<Props.RowConfig>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  filterConfig: {
    type: Object as PropType<Props.FilterConfig>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  scrollY: {
    type: Object as PropType<Props.ScrollY>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  scrollX: {
    type: Object as PropType<Props.ScrollX>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  showHeader: {
    type: Boolean as PropType<Props.ShowHeader>,
    required: false,
    default: true,
    description: '是否隱藏首行'
  },
  showOverflow: {
    type: Boolean as PropType<Props.ShowOverflow>,
    required: false,
    default: false,
    description: '是否太長隱藏: 資料'
  },
  showHeaderOverflow: {
    type: Boolean as PropType<Props.ShowHeaderOverflow>,
    required: false,
    default: false,
    description: '是否太長隱藏: 頁首'
  },
  showFooterOverflow: {
    type: Boolean as PropType<Props.ShowFooterOverflow>,
    required: false,
    default: false,
    description: '是否太長隱藏: 頁尾'
  },
  showFooter: {
    type: Boolean as PropType<Props.ShowFooter>,
    required: false,
    default: false,
    description: '是否顯示頁尾'
  },
  border: {
    type: Boolean as PropType<Props.Border>,
    required: false,
    default: false,
    description: '是否有框線'
  },
  stripe: {
    type: Boolean as PropType<Props.Stripe>,
    required: false,
    default: false,
    description: '是否有斑馬紋'
  },
  mergeCells: {
    type: Array as PropType<Props.MergeCells>,
    required: false,
    default: () => {
      return []
    },
    description: '欄位合併'
  }
}

export declare namespace Emits {}

export declare namespace Expose {
  type RefreshColumn = () => Promise<any>
  type UpdateData = () => Promise<any>
  type SetMergeCells = (merges: Types.Merges) => Promise<any>
  type RemoveMergeCells = (merges: Types.Merges) => Promise<any>
  type ClearMergeCells = () => Promise<any>
  type ClearScroll = () => Promise<any>
  type ScrollTo = (scrollLeft?: number, scrollTo?: number) => Promise<any>
  type ScrollToRow = (row: any, fieldOrColumn?: string | Types.ColumnConfig) => Promise<any>
  type ScrollToColumn = (fieldOrColumn: string | Types.ColumnConfig) => Promise<any>
}
