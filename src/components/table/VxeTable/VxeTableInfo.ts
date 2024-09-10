import type { PropType } from 'vue'
import type { VxeTablePropTypes, TableMergeConfig } from 'vxe-table'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export declare namespace Custom {
  type Merges = TableMergeConfig | TableMergeConfig[]
}

export declare namespace Props {
  type ID = string
  type Data = Array<any>
  type FooterData = Array<any>
  type RowConfig = Record<string, any>
  type ColumnConfig = Record<string, any>
  type ScrollY = Record<string, any>
  type ScrollX = Record<string, any>
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
  footerData: {
    type: Array as PropType<Props.FooterData>,
    required: false,
    default: () => {
      return []
    },
    description: '資料'
  },
  rowConfig: {
    type: Object as PropType<Props.RowConfig>,
    required: false,
    default: () => {
      return {}
    },
    description: '設定'
  },
  columnConfig: {
    type: Object as PropType<Props.ColumnConfig>,
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
  type RefreshColumn = () => void
  type UpdateData = () => void
  type SetMergeCells = (merges: Custom.Merges) => void
}
