import type { PropType } from 'vue'

import type { ColumnItem } from '@/types/types_columnSetting'
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

export const version = '__TimeLineTable_1.0.0__'

export interface Types {
  tableColumn: ColumnItem
}

export interface Props {
  i18nModule: ScopeKey
  version: string
  settingKey: string
  tableColumns: Array<Types['tableColumn']>
  tableData: any[]
}

export const props = {
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  },
  version: {
    type: String as PropType<Props['version']>,
    required: false,
    default: '',
    description: `
      欄位設定 版本
      如果版本更換 會重置欄位設定`
  },
  settingKey: {
    type: String as PropType<Props['settingKey']>,
    required: false,
    default: '',
    description: `
      欄位設定 在 indexedDB 上的 key
      建議參考路由 避免重複使用 key`
  },
  tableColumns: {
    type: Array as PropType<Props['tableColumns']>,
    required: false,
    default: () => [],
    description: '表格欄位顯示用設定'
  },
  tableData: {
    type: Array as PropType<Props['tableData']>,
    required: false,
    default: () => [],
    description: '表格資料'
  }
}

export interface Emits {
  changeKey: (newDateKey: string) => Promise<void>
}

export interface Expose {
  init: (isCheckSetting?: boolean) => void
}
