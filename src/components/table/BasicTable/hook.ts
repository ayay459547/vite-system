import { computed, useSlots } from 'vue'

import type { Props } from './BasicTableInfo'

export const useTableSlot = (showColumns: Props['showColumns']) => {
  // slot
  const slots = useSlots()
  const hasSlot = (prop: string): boolean => {
    return !!slots[prop]
  }

  /**
   * slot 優先順序
   * 1. search-{ slotKey }
   * 2. search-all
   *
   * 1. header-{ slotKey }
   * 2. header-all
   *
   * 1. column-{ slotKey }
   * 2. column-all
   */
  const getSlot = (type: 'search' | 'header' | 'column', slotKey: string): string => {
    switch (type) {
      case 'search':
      case 'header':
      case 'column':
        if (hasSlot(`${type}-${slotKey}`)) return `${type}-${slotKey}`
        if (hasSlot(`${type}-${slotKey}-all`)) return `${type}-${slotKey}-all`
        if (hasSlot(`${type}-all`)) return `${type}-all`
        break
    }
    return 'null'
  }
  const getSearchSlot = (slotKey: string): string => getSlot('search', slotKey)
  const getHeaderSlot = (slotKey: string): string => getSlot('header', slotKey)
  const getColumnSlot = (slotKey: string): string => getSlot('column', slotKey)

  // 所有欄位(包含子欄位)的slotKey
  const slotKeyList = computed<string[]>(() => {
    return Array.isArray(showColumns) ? showColumns.flatMap(column => {
      if (column.columns && column.columns.length > 0) {
        return [
          ...column.columns.map((child: any) => `${column.slotKey}-${child.slotKey}`),
          column.slotKey
        ]
      }
      return column.slotKey
    }) : []
  })

  return {
    slotKeyList,
    getSearchSlot,
    getHeaderSlot,
    getColumnSlot
  }
}
