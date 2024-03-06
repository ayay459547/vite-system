import type { PropType } from 'vue'
import type { TableColumnCtx  } from 'element-plus'

import type { TableColumnsItem } from '@/lib/lib_columns'
import type { ScopeKey } from '@/i18n/i18n_setting'

export const version = '1.0.0'

export interface PropsTableColumn extends Record<string, any>, TableColumnsItem {}
export interface PageChange {
  (page: number, pageSize: number, ...payload: any[]): void
}

export type Order = null | 'ascending' | 'descending' | 'none' | 'Asc' | 'Desc'
export interface Sort {
  key: null | string
  order: null | 'ascending' | 'descending'
}
export type ShowType = 'custom' | 'auto'
// 資料處理的格式
export interface Sorting {
  label?: string
  i18nLabel?: string
  key?: null | string
  order?: Order
}
export type SortingList = Sorting[]
// 送 api 的格式
export type SortingMap = Record<string, Order>

export interface TableParams {
  page?: number
  size?: number
  sort?: Sort
  sortingList?: SortingList
  sortingMap?: SortingMap
}
export type TableSize = '' | 'large' | 'default' | 'small'

export type SpanMethod = (
  (data: {
    row: any,
    column: TableColumnCtx<any>,
    rowIndex: number,
    columnIndex: number
  }, ...payload: any[]) => number[] | { rowspan: number, colspan: number } | void
) | null

type RowCallback<T> = (
  (data: {
    row: any,
    rowIndex: number
  }, ...payload: any[]) => T
) | null
export type RowClassName = RowCallback<string>
export type RowStyle = RowCallback<Record<string, any>>

type CellCallback<T> = (
  (data: {
    row: any,
    column: TableColumnCtx<any>,
    rowIndex: number,
    columnIndex: number
  }, ...payload: any[]) => T
) | null
export type CellClassName = CellCallback<string>
export type CellStyle = CellCallback<Record<string, any>>

export type Load = (row: any, treeNode: any, resolve: any) => void | null
export type LazyLoadingStatus = 'loadMore' | 'loading' | 'noMore'

export const props = {
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: 'iPASP_common',
    description: 'i18nModule'
  },
  title: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: 'table 標題'
  },
  // 欄位設定相關
  version: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: `
      欄位設定 版本
      如果版本更換 會重置欄位設定`
  },
  settingKey: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: `
      欄位設定 在 indexedDB 上的 key
      建議參考路由 避免重複使用 key`
  },
  settingWidth: {
    type: Number as PropType<number>,
    required: false,
    default: 320,
    description: '欄位設定框寬度'
  },
  // 表格資料相關
  tableColumns: {
    type: Array as PropType<PropsTableColumn[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格欄位顯示用設定'
  },
  tableData: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格資料'
  },
  tableDataCount: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: '表格資料總筆數'
  },
  rowKey: {
    type: String as PropType<string>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  tableSize: {
    type: String as PropType<TableSize>,
    required: false,
    default: '',
    description: '表格大小'
  },
  defaultExpandAll: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '資料存在 children 時 預設是否展開'
  },
  spanMethod: {
    type: Function as PropType<SpanMethod>,
    required: false,
    default: null,
    description: '資料跨欄'
  },
  rowClassName: {
    type: Function as PropType<RowClassName>,
    required: false,
    default: null,
    description: '自訂 rowClass'
  },
  rowStyle: {
    type: Function as PropType<RowStyle>,
    required: false,
    default: null,
    description: '自訂 rowStyle'
  },
  cellClassName: {
    type: Function as PropType<CellClassName>,
    required: false,
    default: null,
    description: '自訂 cellClass'
  },
  cellStyle: {
    type: Function as PropType<CellStyle>,
    required: false,
    default: null,
    description: '自訂 cellStyle'
  },
  lazy: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '懶加載子節點'
  },
  load: {
    type: Function as PropType<Load>,
    required: false,
    default: null,
    description: '懶加載子節點回調函數'
  },
  treeProps: {
    type: Object as PropType<Record<string, any>>,
    required: false,
    default: () => {
      return {
        hasChildren: 'hasChildren',
        children: 'children'
      }
    },
    description: '自訂子節點'
  },
  // 表格顯示相關
  page: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
    description: '當前分頁'
  },
  pageSize: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
    description: '顯示筆數'
  },
  sort: {
    type: Object as PropType<Sort>,
    required: false,
    default: () => {
      return { key: null, order: null }
    },
    description: '單欄位排序'
  },
  showType: {
    type: String as PropType<ShowType>,
    required: false,
    default: 'custom',
    description: `
      custom 依據api切資料
      auto 依據 page 和 pageSize 切資料`
  },
  isHiddenExcel: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否隱藏下載Excel'
  },
  isShowNo: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示編號'
  },
  isSorting: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否有多欄位排序'
  },
  selection: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否有checkbox'
  },
  // 資料懶加載
  lazyLoading: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否啟用 懶加載'
  },
  lazyLoadingStatus: {
    type: String as PropType<LazyLoadingStatus>,
    required: false,
    default: 'noMore',
    description: '狀態'
  }
}
