import type { PropType } from 'vue'
import type { TableColumnCtx } from 'element-plus'

import type { TableColumnsItem } from '@/declare/columnSetting'
import type { ScopeKey } from '@/i18n/i18n_setting'

export const version = '1.0.0'

export declare namespace Custom {
  type Order = null | 'ascending' | 'descending' | 'none' | 'Asc' | 'Desc'
  type Sort = {
    key: null | string
    order: null | 'ascending' | 'descending'
  }
  type ShowType = 'custom' | 'auto'

  // 資料處理的格式
  interface Sorting {
    label?: string
    i18nLabel?: string
    key?: null | string
    order?: Custom.Order
    orderIndex?: number
  }

  type SortingList = Sorting[]
  // 送 api 的格式
  type SortingMap = Record<string, Custom.Order>

  type TableParams = {
    page?: number
    size?: number
    sort?: Custom.Sort
    sortingList?: Custom.SortingList
    sortingMap?: Custom.SortingMap
  }

  type RowCallback<T> =
    | ((
        data: {
          row: any
          rowIndex: number
        },
        ...payload: any[]
      ) => T)
    | null

  type CellCallback<T> =
    | ((
        data: {
          row: any
          column: TableColumnCtx<any>
          rowIndex: number
          columnIndex: number
        },
        ...payload: any[]
      ) => T)
    | null

  type PageChange = {
    (page: number, pageSize: number, ...payload: any[]): void
  }

  type TableColumn = TableColumnsItem
}

export declare namespace Props {
  type I18nModule = ScopeKey
  type Title = string
  type I18nTitle = string
  type Version = string
  type SettingKey = string
  type SettingWidth = number
  type TableColumns = Array<Custom.TableColumn>
  type TableData = any[]
  type TableDataCount = number
  type RowKey = string
  type TableSize = '' | 'large' | 'default' | 'small'
  type DefaultExpandAll = boolean
  type SpanMethod =
    | ((
        data: {
          row: any
          column: TableColumnCtx<any>
          rowIndex: number
          columnIndex: number
        },
        ...payload: any[]
      ) => number[] | { rowspan: number; colspan: number } | void)
    | null

  type RowClassName = Custom.RowCallback<string>
  type RowStyle = Custom.RowCallback<Record<string, any>>
  type CellClassName = Custom.CellCallback<string>
  type CellStyle = Custom.CellCallback<Record<string, any>>
  type Lazy = boolean
  type Load = (row: any, treeNode: any, resolve: any) => void | null
  type TreeProps = Record<string, any>
  type Page = number
  type PageSize = number
  type Sort = Custom.Sort
  type ShowType = Custom.ShowType
  type IsHiddenExcel = boolean
  type IsShowNo = boolean
  type IsSorting = boolean
  type IsCondition = boolean
  type IsHiddenColumnSetting = boolean
  type Selection = boolean
  type IsLazyLoading = boolean
  type LazyLoadingStatus = 'loadMore' | 'loading' | 'noMore'
}

export const props = {
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    required: false,
    default: 'iPASP_common',
    description: 'i18nModule'
  },
  title: {
    type: String as PropType<Props.Title>,
    required: false,
    default: '',
    description: 'table 標題'
  },
  i18nTitle: {
    type: String as PropType<Props.I18nTitle>,
    required: false,
    description: 'i18n table 標題'
  },
  // 欄位設定相關
  version: {
    type: String as PropType<Props.Version>,
    required: false,
    default: '',
    description: `
      欄位設定 版本
      如果版本更換 會重置欄位設定`
  },
  settingKey: {
    type: String as PropType<Props.SettingKey>,
    required: false,
    default: '',
    description: `
      欄位設定 在 indexedDB 上的 key
      建議參考路由 避免重複使用 key`
  },
  settingWidth: {
    type: Number as PropType<Props.SettingWidth>,
    required: false,
    default: 320,
    description: '欄位設定框寬度'
  },
  // 表格資料相關
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
  },
  tableDataCount: {
    type: Number as PropType<Props.TableDataCount>,
    required: false,
    default: 0,
    description: '表格資料總筆數'
  },
  rowKey: {
    type: String as PropType<Props.RowKey>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  tableSize: {
    type: String as PropType<Props.TableSize>,
    required: false,
    default: '',
    description: '表格大小'
  },
  defaultExpandAll: {
    type: Boolean as PropType<Props.DefaultExpandAll>,
    required: false,
    default: false,
    description: '資料存在 children 時 預設是否展開'
  },
  spanMethod: {
    type: Function as PropType<Props.SpanMethod>,
    required: false,
    default: null,
    description: '資料跨欄'
  },
  rowClassName: {
    type: Function as PropType<Props.RowClassName>,
    required: false,
    default: null,
    description: '自訂 rowClass'
  },
  rowStyle: {
    type: Function as PropType<Props.RowStyle>,
    required: false,
    default: null,
    description: '自訂 rowStyle'
  },
  cellClassName: {
    type: Function as PropType<Props.CellClassName>,
    required: false,
    default: null,
    description: '自訂 cellClass'
  },
  cellStyle: {
    type: Function as PropType<Props.CellStyle>,
    required: false,
    default: null,
    description: '自訂 cellStyle'
  },
  lazy: {
    type: Boolean as PropType<Props.Lazy>,
    required: false,
    default: false,
    description: '懶加載子節點'
  },
  load: {
    type: Function as PropType<Props.Load>,
    required: false,
    default: null,
    description: '懶加載子節點回調函數'
  },
  treeProps: {
    type: Object as PropType<Props.TreeProps>,
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
    type: Number as PropType<Props.Page>,
    required: false,
    default: 1,
    description: '當前分頁'
  },
  pageSize: {
    type: Number as PropType<Props.PageSize>,
    required: false,
    default: 1,
    description: '顯示筆數'
  },
  sort: {
    type: Object as PropType<Props.Sort>,
    required: false,
    default: () => {
      return { key: null, order: null }
    },
    description: '單欄位排序'
  },
  showType: {
    type: String as PropType<Props.ShowType>,
    required: false,
    default: 'custom',
    description: `
      custom 依據api切資料
      auto 依據 page 和 pageSize 切資料`
  },
  isHiddenExcel: {
    type: Boolean as PropType<Props.IsHiddenExcel>,
    required: false,
    default: false,
    description: '是否隱藏下載Excel'
  },
  isShowNo: {
    type: Boolean as PropType<Props.IsShowNo>,
    required: false,
    default: false,
    description: '是否顯示編號'
  },
  isSorting: {
    type: Boolean as PropType<Props.IsSorting>,
    required: false,
    default: false,
    description: '是否有多欄位排序'
  },
  isCondition: {
    type: Boolean as PropType<Props.IsCondition>,
    required: false,
    default: false,
    description: '是否有特殊查詢'
  },
  isHiddenColumnSetting: {
    type: Boolean as PropType<Props.IsHiddenColumnSetting>,
    required: false,
    default: false,
    description: '是否隱藏欄位設定'
  },
  selection: {
    type: Boolean as PropType<Props.Selection>,
    required: false,
    default: false,
    description: '是否有checkbox'
  },
  // 資料懶加載
  isLazyLoading: {
    type: Boolean as PropType<Props.IsLazyLoading>,
    required: false,
    default: false,
    description: '是否啟用 懶加載'
  },
  lazyLoadingStatus: {
    type: String as PropType<Props.LazyLoadingStatus>,
    required: false,
    default: 'noMore',
    description: '狀態'
  }
}

export declare namespace Emits {
  type RowClick = (row: any, column: any, event: Event) => void
  type HeaderClick = (column: any, event: Event) => void
  type ExpandChange = (row: any, expanded: boolean) => void
  type HeaderDragend = (
    newWidth: number,
    oldWidth: number,
    column: any,
    event: MouseEvent
  ) => void

  type Select = <T = any>(selection: T[], row: T) => void
  type SelectAll = (selection: any[]) => void
  type SelectionChange = (newSelection: any[]) => void
  type RowContextmenu = (row: any, column: any, event: Event) => void
}

export declare namespace Expose {
  type PageChange = Custom.PageChange
  type GetTableParams = () => Custom.TableParams
  type SetTableParams = (params: Custom.TableParams) => void
  type ResetScroll = () => void
  type ToggleSelection = (rows: any[]) => void
  type GetSelectionRows = () => any[]
}
