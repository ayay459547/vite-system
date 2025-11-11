import type { PropType } from 'vue'
import type { VxeTablePropTypes, VxeColumnPropTypes, VxeTableDefines } from 'vxe-table'

export const version = '__VxeTable_1.0.0__'

export interface Types {
  merges: VxeTablePropTypes.MergeCells
  columnConfig: VxeTablePropTypes.ColumnOpts<any>
  virtualYConfig: VxeTablePropTypes.VirtualYConfig
  virtualXConfig: VxeTablePropTypes.VirtualXConfig

  fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>
  RowConfig: VxeTablePropTypes.RowOpts<any>

  rowClassCallbackParams: {
    row?: any
    rowIndex?: number
    $rowIndex?: number
  }
  cellClassCallbackParams: {
    row?: any
    rowIndex?: number
    $rowIndex?: number

    column?: any
    columnIndex?: number
    $columnIndex?: number
  }
}

export interface Props {
  id: string
  data: Array<any>
  emptyText: string
  footerData: Array<any>

  rowClassName: string | ((params: Types['rowClassCallbackParams']) => any) | undefined
  cellClassName: string | ((params: Types['cellClassCallbackParams']) => any) | undefined
  headerRowClassName: string | ((params: Types['rowClassCallbackParams']) => any) | undefined
  headerCellClassName: string | ((params: Types['cellClassCallbackParams']) => any) | undefined
  footerRowClassName: string | ((params: Types['rowClassCallbackParams']) => any) | undefined
  footerCellClassName: string | ((params: Types['cellClassCallbackParams']) => any) | undefined

  columnConfig: Types['columnConfig']
  virtualYConfig: Types['virtualYConfig']
  virtualXConfig: Types['virtualXConfig']
  RowConfig: Types['RowConfig']
  FilterConfig: Record<string, any>
  ScrollY: Record<string, any>
  ScrollX: Record<string, any>
  ShowHeader: boolean
  ShowOverflow: boolean
  ShowHeaderOverflow: boolean
  ShowFooterOverflow: boolean
  ShowFooter: boolean
  Border: boolean
  Stripe: boolean
  MergeCells: VxeTablePropTypes.MergeCells
}

/**
 * https://vxetable.cn/#/table/api
 */
export const props = {
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: '唯一值'
  },
  data: {
    type: Array as PropType<Props['data']>,
    required: false,
    default: () => [],
    description: '資料'
  },
  emptyText: {
    type: String as PropType<Props['emptyText']>,
    required: false,
    default: undefined,
    description: '無資料顯示文字'
  },
  footerData: {
    type: Array as PropType<Props['footerData']>,
    required: false,
    default: () => [],
    description: '資料'
  },
  rowClassName: {
    type: [Function, String] as PropType<Props['rowClassName']>,
    required: false,
    default: undefined,
    description: '將表格的行附加 className'
  },
  cellClassName: {
    type: [Function, String] as PropType<Props['cellClassName']>,
    required: false,
    default: undefined,
    description: '將表格的儲存格附加 className'
  },
  headerRowClassName: {
    type: [Function, String] as PropType<Props['headerRowClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  },
  headerCellClassName: {
    type: [Function, String] as PropType<Props['headerCellClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的儲存格附加 className'
  },
  footerRowClassName: {
    type: [Function, String] as PropType<Props['footerRowClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  },
  footerCellClassName: {
    type: [Function, String] as PropType<Props['footerCellClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的儲存格附加 className'
  },
  columnConfig: {
    type: Object as PropType<Props['columnConfig']>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  virtualYConfig: {
    type: Object as PropType<Props['virtualYConfig']>,
    required: false,
    default: () => {
      return {}
    },
    description: 'Y軸 設定'
  },
  virtualXConfig: {
    type: Object as PropType<Props['virtualXConfig']>,
    required: false,
    default: () => {
      return {}
    },
    description: 'X軸 設定'
  },
  rowConfig: {
    type: Object as PropType<Props['RowConfig']>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  filterConfig: {
    type: Object as PropType<Props['FilterConfig']>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  scrollY: {
    type: Object as PropType<Props['ScrollY']>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  scrollX: {
    type: Object as PropType<Props['ScrollX']>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  showHeader: {
    type: Boolean as PropType<Props['ShowHeader']>,
    required: false,
    default: true,
    description: '是否隱藏首行'
  },
  showOverflow: {
    type: Boolean as PropType<Props['ShowOverflow']>,
    required: false,
    default: false,
    description: '是否太長隱藏: 資料'
  },
  showHeaderOverflow: {
    type: Boolean as PropType<Props['ShowHeaderOverflow']>,
    required: false,
    default: false,
    description: '是否太長隱藏: 頁首'
  },
  showFooterOverflow: {
    type: Boolean as PropType<Props['ShowFooterOverflow']>,
    required: false,
    default: false,
    description: '是否太長隱藏: 頁尾'
  },
  showFooter: {
    type: Boolean as PropType<Props['ShowFooter']>,
    required: false,
    default: false,
    description: '是否顯示頁尾'
  },
  border: {
    type: Boolean as PropType<Props['Border']>,
    required: false,
    default: false,
    description: '是否有框線'
  },
  stripe: {
    type: Boolean as PropType<Props['Stripe']>,
    required: false,
    default: false,
    description: '是否有斑馬紋'
  },
  mergeCells: {
    type: Array as PropType<Props['MergeCells']>,
    required: false,
    default: () => [],
    description: '欄位合併'
  }
}

export interface Emits {}

export interface Expose {
  refreshColumn: () => Promise<any>
  updateData: () => Promise<any>
  setMergeCells: (merges: Types['merges']) => Promise<any>
  removeMergeCells: (merges: Types['merges']) => Promise<any>
  clearMergeCells: () => Promise<any>
  clearScroll: () => Promise<any>
  scrollTo: (scrollLeft?: number, scrollTo?: number) => Promise<any>
  scrollToRow: (row: any, fieldOrColumn?: Types['fieldOrColumn']) => Promise<any>
  scrollToColumn: (fieldOrColumn: Types['fieldOrColumn']) => Promise<any>
}
