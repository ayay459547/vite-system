import type { PropType } from 'vue'
import type { TableColumnCtx } from 'element-plus'

import type { ColumnItem } from '@/types/types_columnSetting'
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

export const version = '__ElTable_1.0.0__'

export interface Types {
  sort: {
    key: null | string
    order: null | 'ascending' | 'descending'
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
  renderKey: number
  showColumns: Array<Types['tableColumn']>
  showData: Array<any>
  sort: Types['sort']
  isShowNo: boolean
  rowKey: string
  tableSize: '' | 'large' | 'default' | 'small'
  defaultExpandAll: boolean
  spanMethod: any
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
  rowClassName: Types['rowCallback'] | any
  rowStyle: Types['rowCallback'] | any
  cellClassName: Types['cellCallback'] | any
  cellStyle: Types['cellCallback'] | any
  lazy: boolean
  load: (row: any, treeNode: any, resolve: any) => void | null | any
  treeProps: Record<string, any> | any
  selection: boolean
  selectable: (row: any, index: number) => boolean
  isLazyLoading: boolean
  lazyLoadingStatus: 'loadMore' | 'loading' | 'noMore'
  i18nModule: ScopeKey
}

export const props = {
  renderKey: {
    type: Number as PropType<Props['renderKey']>,
    required: false,
    default: 0,
    description: '重新渲染用的key'
  },
  showColumns: {
    type: Array as PropType<Props['showColumns']>,
    required: false,
    default: () => [],
    description: '顯示欄位'
  },
  showData: {
    type: Array as PropType<Props['showData']>,
    required: false,
    default: () => [],
    description: '顯示資料'
  },
  sort: {
    type: Object as PropType<Props['sort']>,
    required: false,
    default: () => {
      return { key: null, order: null }
    },
    description: '資料存在 children 時 預設是否展開'
  },
  isShowNo: {
    type: Boolean as PropType<Props['isShowNo']>,
    required: false,
    default: true,
    description: '是否顯示編號'
  },
  // element ui
  rowKey: {
    type: String as PropType<Props['rowKey']>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  tableSize: {
    type: String as PropType<Props['tableSize']>,
    required: false,
    default: undefined,
    description: '表格大小'
  },
  defaultExpandAll: {
    type: Boolean as PropType<Props['defaultExpandAll']>,
    required: false,
    default: undefined,
    description: '資料存在 children 時 預設是否展開'
  },
  spanMethod: {
    type: Function as PropType<Props['spanMethod']>,
    required: false,
    default: undefined,
    description: '資料跨欄'
  },
  rowClassName: {
    type: Function as PropType<Props['rowClassName']>,
    required: false,
    default: undefined,
    description: 'row class callback'
  },
  rowStyle: {
    type: Function as PropType<Props['rowStyle']>,
    required: false,
    default: undefined,
    description: 'row style callback'
  },
  cellClassName: {
    type: Function as PropType<Props['cellClassName']>,
    required: false,
    default: undefined,
    description: 'cell class callback'
  },
  cellStyle: {
    type: Function as PropType<Props['cellStyle']>,
    required: false,
    default: undefined,
    description: 'cell style callback'
  },
  lazy: {
    type: Boolean as PropType<Props['lazy']>,
    required: false,
    default: undefined,
    description: '懶加載子節點'
  },
  load: {
    type: Function as PropType<Props['load']>,
    required: false,
    default: undefined,
    description: '懶加載子節點回調函數'
  },
  treeProps: {
    type: Object as PropType<Props['treeProps']>,
    required: false,
    default: undefined,
    description: '懶加載子節點回調函數'
  },
  selection: {
    type: Boolean as PropType<Props['selection']>,
    required: false,
    default: undefined,
    description: '是否有checkbox'
  },
  selectable: {
    type: Function as PropType<Props['selectable']>,
    required: false,
    default: undefined,
    description: 'checkbox 是否可以選取'
  },
  isLazyLoading: {
    type: Boolean as PropType<Props['isLazyLoading']>,
    required: false,
    default: undefined,
    description: '懶加載'
  },
  lazyLoadingStatus: {
    type: String as PropType<Props['lazyLoadingStatus']>,
    required: false,
    default: undefined,
    description: '懶加載狀態'
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  }
}

export interface Emits {
  rowClick: (row: any, column: any, event: Event) => void
  sortChange: (props: {
    column: any
    prop: string
    order: null | 'ascending' | 'descending'
  }) => void

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
  clearSelection: () => void
  getSelectionRows: () => any[]
  toggleRowSelection: (row: any, selected?: boolean, ignoreSelectable?: boolean) => void
  toggleAllSelection: () => void
  toggleRowExpansion: (row: any, expanded?: boolean) => void
  setCurrentRow: (row: any) => void
  doLayout: () => void
  scrollTo: (options: number | ScrollToOptions, yCoord?: number) => void
  setScrollTop: (top?: number) => void
  setScrollLeft: (left?: number) => void
  updateKeyChildren: (key: string, data: any[]) => void

  resetScroll: () => void
  toggleSelection: (rows: any[]) => void
}
