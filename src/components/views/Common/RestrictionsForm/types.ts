import type { EditStatusType } from '@/types'

// EditModal
export interface DynamicForm {
  // columnType?: string
  restrictionType: string
  matchingTypeValue?: string
  valueInArray?: string
  status?: EditStatusType
}
