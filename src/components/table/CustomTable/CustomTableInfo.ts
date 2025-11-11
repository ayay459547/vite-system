import type { PropType } from 'vue'
import type { TableColumnCtx } from 'element-plus'

import type { ColumnItem } from '@/types/types_columnSetting'
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

export const version = '1.0.0'

export interface Types {
  order: null | 'ascending' | 'descending' | 'none' | 'Asc' | 'Desc'
  sort: {
    key: null | string
    order: null | 'ascending' | 'descending'
  }
  /**
   * 資料顯示類型
   * custom: 依據api切資料
   * auto: 依據 page 和 pageSize 切資料
   */
  showType: 'custom' | 'auto'

  // 資料處理的格式
  sorting: {
    label?: string
    i18nLabel?: string
    key?: null | string
    order?: Types['order']
    orderIndex?: number
  }

  sortingList: Types['sorting'][]
  // 送 api 的格式
  sortingMap: Record<string, Types['order']>

  tableParams: {
    page?: number
    size?: number
    sort?: Types['sort']
    sortingList?: Types['sortingList']
    sortingMap?: Types['sortingMap']
  }

  rowCallback: (<T>(
    data: {
      row: any
      rowIndex: number
    },
    ...payload: any[]
  ) => T) | Function

  cellCallback: (<T>(
    data: {
      row: any
      column: TableColumnCtx<any>
      rowIndex: number
      columnIndex: number
    },
    ...payload: any[]
  ) => T) | Function

  pageChange: {
    (page: number, pageSize: number, ...payload: any[]): void
  }

  tableColumn: ColumnItem
}

export interface Props {
  i18nModule: ScopeKey
  title: string
  i18nTitle: string
  version: string
  settingKey: string
  settingWidth: number
  tableColumns: Array<Types['tableColumn']>
  tableData: any[]
  tableDataCount: number
  rowKey: string
  tableSize: '' | 'large' | 'default' | 'small'
  defaultExpandAll: boolean
  spanMethod:
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

  rowClassName: Types['rowCallback']
  rowStyle: Types['rowCallback']
  cellClassName: Types['cellCallback']
  cellStyle: Types['cellCallback']
  lazy: boolean
  load: (row: any, treeNode: any, resolve: any) => void | null
  treeProps: Record<string, any>
  page: number
  pageSize: number
  sort: Types['sort']
  showType: Types['showType']
  isHiddenExcel: boolean
  useDownloadModal: boolean
  isShowNo: boolean
  isSorting: boolean
  isCondition: boolean
  isHiddenColumnSetting: boolean
  selection: boolean
  selectable: (row: any, index: number) => boolean
  isLazyLoading: boolean
  lazyLoadingStatus: 'loadMore' | 'loading' | 'noMore'
}

export const props = {
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  },
  title: {
    type: String as PropType<Props['title']>,
    required: false,
    default: '',
    description: 'table 標題'
  },
  i18nTitle: {
    type: String as PropType<Props['i18nTitle']>,
    required: false,
    description: 'i18n table 標題'
  },
  // 欄位設定相關
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
  settingWidth: {
    type: Number as PropType<Props['settingWidth']>,
    required: false,
    default: 320,
    description: '欄位設定框寬度'
  },
  // 表格資料相關
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
  },
  tableDataCount: {
    type: Number as PropType<Props['tableDataCount']>,
    required: false,
    default: 0,
    description: '表格資料總筆數'
  },
  rowKey: {
    type: String as PropType<Props['rowKey']>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  tableSize: {
    type: String as PropType<Props['tableSize']>,
    required: false,
    default: '',
    description: '表格大小'
  },
  defaultExpandAll: {
    type: Boolean as PropType<Props['defaultExpandAll']>,
    required: false,
    default: false,
    description: '資料存在 children 時 預設是否展開'
  },
  spanMethod: {
    type: [Function, null] as PropType<Props['spanMethod']>,
    required: false,
    default: null,
    description: '資料跨欄'
  },
  rowClassName: {
    type: [Function, null] as PropType<Props['rowClassName']>,
    required: false,
    default: null,
    description: '自訂 rowClass'
  },
  rowStyle: {
    type: [Function, null] as PropType<Props['rowStyle']>,
    required: false,
    default: null,
    description: '自訂 rowStyle'
  },
  cellClassName: {
    type: [Function, null] as PropType<Props['cellClassName']>,
    required: false,
    default: null,
    description: '自訂 cellClass'
  },
  cellStyle: {
    type: [Function, null] as PropType<Props['cellStyle']>,
    required: false,
    default: null,
    description: '自訂 cellStyle'
  },
  lazy: {
    type: Boolean as PropType<Props['lazy']>,
    required: false,
    default: false,
    description: '懶加載子節點'
  },
  load: {
    type: Function as PropType<Props['load']>,
    required: false,
    default: null,
    description: '懶加載子節點回調函數'
  },
  treeProps: {
    type: Object as PropType<Props['treeProps']>,
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
    type: Number as PropType<Props['page']>,
    required: false,
    default: 1,
    description: '當前分頁'
  },
  pageSize: {
    type: Number as PropType<Props['pageSize']>,
    required: false,
    default: 1,
    description: '顯示筆數'
  },
  sort: {
    type: Object as PropType<Props['sort']>,
    required: false,
    default: () => {
      return { key: null, order: null }
    },
    description: '單欄位排序'
  },
  showType: {
    type: String as PropType<Props['showType']>,
    required: false,
    default: 'custom',
    description: `
      custom 依據api切資料
      auto 依據 page 和 pageSize 切資料`
  },
  isHiddenExcel: {
    type: Boolean as PropType<Props['isHiddenExcel']>,
    required: false,
    default: false,
    description: '是否隱藏下載Excel'
  },
  useDownloadModal: {
    type: Boolean as PropType<Props['useDownloadModal']>,
    required: false,
    default: false,
    description: '是否使用Pdf,Excel下載介面'
  },
  isShowNo: {
    type: Boolean as PropType<Props['isShowNo']>,
    required: false,
    default: true,
    description: '是否顯示編號'
  },
  isSorting: {
    type: Boolean as PropType<Props['isSorting']>,
    required: false,
    default: false,
    description: '是否有多欄位排序'
  },
  isCondition: {
    type: Boolean as PropType<Props['isCondition']>,
    required: false,
    default: false,
    description: '是否有特殊查詢'
  },
  isHiddenColumnSetting: {
    type: Boolean as PropType<Props['isHiddenColumnSetting']>,
    required: false,
    default: false,
    description: '是否隱藏欄位設定'
  },
  selection: {
    type: Boolean as PropType<Props['selection']>,
    required: false,
    default: false,
    description: '是否有checkbox'
  },
  selectable: {
    type: Function as PropType<Props['selectable']>,
    required: false,
    default: undefined,
    description: 'checkbox 是否可以選取'
  },
  // 資料懶加載
  isLazyLoading: {
    type: Boolean as PropType<Props['isLazyLoading']>,
    required: false,
    default: false,
    description: '是否啟用 懶加載'
  },
  lazyLoadingStatus: {
    type: String as PropType<Props['lazyLoadingStatus']>,
    required: false,
    default: 'noMore',
    description: '狀態'
  }
}

export interface Emits {
  rowClick: (row: any, column: any, event: Event) => void
  headerClick: (column: any, event: Event) => void
  expandChange: (row: any, expanded: boolean) => void
  headerDragend: (
    newWidth: number,
    oldWidth: number,
    column: any,
    event: MouseEvent
  ) => void

  select: <T = any>(selection: T[], row: T) => void
  selectAll: (selection: any[]) => void
  selectionChange: (newSelection: any[]) => void
  rowContextmenu: (row: any, column: any, event: Event) => void
}

export interface Expose {
  pageChange: Types['pageChange']
  getTableParams: () => Types['tableParams']
  setTableParams: (params: Types['tableParams']) => void
  resetScroll: () => void
  toggleSelection: (rows: any[]) => void
  getSelectionRows: () => any[]
}
