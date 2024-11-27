import type { PropType } from 'vue'

import type { ColumnItem } from '@/declare/columnSetting'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '__TimeLineTable_1.0.0__'

export declare namespace Types {
  type TableColumn = ColumnItem
}

export declare namespace Props {
  type I18nModule = ScopeKey
  type TableColumns = Array<Types.TableColumn>
  type TableData = any[]
}

export const props = {
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  },
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
