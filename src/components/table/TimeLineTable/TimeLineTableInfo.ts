import type { PropType } from 'vue'

import type { TableColumnsItem } from '@/declare/columnSetting'

export const version = '1.0.0'

export declare namespace Types {
  type TableColumn = TableColumnsItem
}

export declare namespace Props {
  type TableColumns = Array<Types.TableColumn>
  type TableData = any[]
}

export const props = {
  tableColumns: {
    type: Array as PropType<Props.TableColumns>,
    required: false,
    default: () => {
      return []
    },
    description: '表格欄位顯示用設定'
  },
  tableData: {
    type: Array as PropType<Props.TableData>,
    required: false,
    default: () => {
      return []
    },
    description: '表格資料'
  }
}

export declare namespace Emits {}

export declare namespace Expose {
  type Init = () => void
}
