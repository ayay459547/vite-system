import { SQLDataTypeEnum } from '@/declare/declare_dataType'

export type EditType = string
  | 'ADD' | 'EDIT'
  | 'CREATE' | 'UPDATE' | 'DELETE'

export type EditStatusType = string
  | 'OLD' | 'NEW'

// 自動取得 Enum 的鍵名作為型別
export type SQLDataType = string
  | keyof typeof SQLDataTypeEnum
  | 'STRING' | 'INTEGER' | 'DOUBLE'
