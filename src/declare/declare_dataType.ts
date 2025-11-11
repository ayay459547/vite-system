import type { Options } from '@/components'

// 系統所有權限種類 (2進制)
export enum SQLDataTypeEnum {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DOUBLE = 'DOUBLE'
}

// 自動從 Enum 產生選項，避免手動維護
export const SQLDataTypeOptions: Options = Object.entries(SQLDataTypeEnum).map(([key, value]) => {
  return {
    label: key,
    value,
    data: { key, value }
  }
})
