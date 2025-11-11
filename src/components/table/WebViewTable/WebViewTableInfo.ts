import type { PropType } from 'vue'

import type { ViewParams } from '@/types/types_ajax'
import type { TableOptions } from '@/types/types_columnSetting'

export const version = '__WebViewTable_1.0.0__'

export interface Types {
  commonData: Record<string, any>

  responseData: Types['commonData']
  filterData: Types['commonData']
  tableData: Types['commonData']
  excelData: Types['commonData']

  responseTableData: [Array<Types['tableData']>, number]

  webViewTableOptions: TableOptions
  params: ViewParams & {
    [key: string]: any
  } & any

  urlParams: {
    baseURL?: string
    url?: string
  }
}

export interface Props {
  baseurl: string
  apiurl: string
  apiOperator: string
  webfuno: string
  funoviewsuffix: string
  designatedview: string
  tableOptions: Types['webViewTableOptions']
  columnSetting: Record<any, any>
  tableKey: string
  filterKey: string
  formatParams: (params: Types['params']) => any
  formatExcel: (row: any) => any
  formatTable: (row: any) => any
  formatData: (row: any) => any
  formatSorting: (row: any) => any
  useFakeData: boolean
  fakeDataPath: string
  isLog: boolean
  fakeData: Array<any>
  isMountedInit: boolean
  downloadExcel: any
  isHiddenPrepend: boolean
  isShowTimeLineTable: boolean
  beforeInitCallBack: () => void
  afterInitCallBack: () => void
}

export const props = {
  baseurl: {
    type: String as PropType<Props['baseurl']>,
    required: false,
    description: `api baseURL 參數
      baseURL: props.baseurl
    `
  },
  apiurl: {
    type: String as PropType<Props['apiurl']>,
    required: false,
    description: `api url 參數
      apiurl 存在時
      url: props.apiurl
      webfuno, funoviewsuffix, designatedview無效

      apiurl 不存在時
      url: /api/ipaspTable/retrieveIpaspTableFromView
      webfuno, funoviewsuffix,  designatedview有效
    `
  },
  apiOperator: {
    type: String as PropType<Props['apiOperator']>,
    required: false,
    description: `api url 參數: 進階搜尋選項
      apiOperator 存在時
      url: props.apiurl
      webfuno, funoviewsuffix, designatedview無效

      apiOperator 不存在時
      url: /api/ipaspTable/retrieveIpaspTableFromView
      webfuno, funoviewsuffix,  designatedview有效
    `
  },
  webfuno: {
    type: String as PropType<Props['webfuno']>,
    required: false,
    description: 'api webfuno 參數'
  },
  funoviewsuffix: {
    type: String as PropType<Props['funoviewsuffix']>,
    required: false,
    default: '',
    description: 'api funoviewsuffix 參數'
  },
  designatedview: {
    type: String as PropType<Props['designatedview']>,
    required: false,
    default: '',
    description: `api designatedview 參數
      designatedview 存在時 webfuno, funoviewsuffix 無效
    `
  },
  tableOptions: {
    type: Object as PropType<Props['tableOptions']>,
    required: true,
    description: `CustomTable 參數設定
      CustomTable Props 最後會加在 tableSetting 中
    `
  },
  columnSetting: {
    type: Object as PropType<Props['columnSetting']>,
    required: true,
    description: '欄位設定'
  },
  tableKey: {
    type: String as PropType<Props['tableKey']>,
    required: false,
    default: 'table',
    description: 'useTableSetting 使用 columnSetting中對應的key'
  },
  filterKey: {
    type: String as PropType<Props['filterKey']>,
    required: false,
    default: 'filter',
    description: 'useFormSetting 使用 columnSetting中對應的key'
  },
  formatParams: {
    type: Function as PropType<Props['formatParams']>,
    required: false,
    default: (params: any) => params,
    description: '自訂送出的api格式'
  },
  formatExcel: {
    type: Function as PropType<Props['formatExcel']>,
    required: false,
    // default: (row: any) => row,
    description: '自訂Excel資料格式'
  },
  formatTable: {
    type: Function as PropType<Props['formatTable']>,
    required: false,
    // default: (row: any) => row,
    description: '自訂Table資料格式'
  },
  formatData: {
    type: Function as PropType<Props['formatData']>,
    required: false,
    default: (row: any) => row,
    description: `
      自訂Data資料格式 適用於Excel, Table
      優先序低於formatExcel, formatTable
    `
  },
  formatSorting: {
    type: Function as PropType<Props['formatSorting']>,
    required: false,
    default: (row: any) => row,
    description: '自訂SortingMap資料格式'
  },
  useFakeData: {
    type: Boolean as PropType<Props['useFakeData']>,
    required: false,
    default: false,
    description: `
      是否使用fakeData假資料
      如果為true則不送出API responseData會使用fakeData
    `
  },
  fakeDataPath: {
    type: String as PropType<Props['fakeDataPath']>,
    required: false,
    default: undefined,
    description: '假資料get路徑'
  },
  isLog: {
    type: Boolean as PropType<Props['isLog']>,
    required: false,
    default: false,
    description: '是否顯示 ajax 訊息'
  },
  fakeData: {
    type: Array as PropType<Props['fakeData']>,
    required: false,
    default: () => [],
    description: '替代實際API輸出資料的假資料'
  },
  isMountedInit: {
    type: Boolean as PropType<Props['isMountedInit']>,
    required: false,
    default: false,
    description: `
      是否在 onMounted 初始化
      預設 false, 因為由 DataLoader 來取資料
    `
  },
  // Custom Download Excel
  downloadExcel: {
    type: Function as PropType<Props['downloadExcel']>,
    required: false,
    default: null,
    description: `
      取代downloadExcel的特製表格下載方式
      ex: 子欄位、合併……
    `
  },
  isHiddenPrepend: {
    type: Boolean as PropType<Props['isHiddenPrepend']>,
    required: false,
    default: false,
    description: '是否在 隱藏 slot #prepend'
  },
  isShowTimeLineTable: {
    type: Boolean as PropType<Props['isShowTimeLineTable']>,
    required: false,
    default: false,
    description: '是否顯示時間線表格'
  },
  beforeInitCallBack: {
    type: Function as PropType<Props['beforeInitCallBack']>,
    required: false,
    default: undefined,
    description: '初始化前執行'
  },
  afterInitCallBack: {
    type: Function as PropType<Props['afterInitCallBack']>,
    required: false,
    default: undefined,
    description: '初始化後執行'
  }
}

export interface Emits {}

export interface Expose {}
