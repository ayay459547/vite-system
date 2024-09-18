import type { PropType } from 'vue'

import type { ViewParams } from '@/declare/ajax'
import type { TableOptions } from '@/declare/columnSetting'

export const version = '__WebViewTable_1.0.0__'

export declare namespace Types {
  type CommonData = Record<string, any>

  type ResponseData = Types.CommonData
  type FilterData = Types.CommonData
  type TableData = Types.CommonData
  type ExcelData = Types.CommonData

  type ResponseTableData = [Array<Types.TableData>, number]

  type WebViewTableOptions = TableOptions
  type Params = ViewParams & {
    [key: string]: any
  } & any

  type UrlParams = {
    baseURL?: string
    url: string
  }
}

export declare namespace Props {
  type Baseurl = string
  type Apiurl = string
  type Webfuno = string
  type Funoviewsuffix = string
  type Designatedview = string
  type TableOptions = Types.WebViewTableOptions
  type ColumnSetting = Record<any, any>
  type TableKey = string
  type FilterKey = string
  type FormatParams = (params: Types.Params) => any
  type FormatExcel = (row: any) => any
  type FormatTable = (row: any) => any
  type FormatSorting = (row: any) => any
  type UseFakeData = boolean
  type FakeData = Array<any>
  type IsMountedInit = boolean
  type DownloadExcel = any
  type IsHiddenPrepend = boolean
}

export const props = {
  baseurl: {
    type: String as PropType<Props.Baseurl>,
    required: false,
    description: `api baseURL 參數
      baseURL: props.baseurl
    `
  },
  apiurl: {
    type: String as PropType<Props.Apiurl>,
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
  webfuno: {
    type: String as PropType<Props.Webfuno>,
    required: false,
    description: 'api webfuno 參數'
  },
  funoviewsuffix: {
    type: String as PropType<Props.Funoviewsuffix>,
    required: false,
    default: '',
    description: 'api funoviewsuffix 參數'
  },
  designatedview: {
    type: String as PropType<Props.Designatedview>,
    required: false,
    default: '',
    description: `api designatedview 參數
      designatedview 存在時 webfuno, funoviewsuffix 無效
    `
  },
  tableOptions: {
    type: Object as PropType<Props.TableOptions>,
    required: true,
    description: `CustomTable 參數設定
      CustomTable Props 最後會加在 tableSetting 中
    `
  },
  columnSetting: {
    type: Object as PropType<Props.ColumnSetting>,
    required: true,
    description: '欄位設定'
  },
  tableKey: {
    type: String as PropType<Props.TableKey>,
    required: false,
    default: 'table',
    description: 'useTableSetting 使用 columnSetting中對應的key'
  },
  filterKey: {
    type: String as PropType<Props.FilterKey>,
    required: false,
    default: 'filter',
    description: 'useFormSetting 使用 columnSetting中對應的key'
  },
  formatParams: {
    type: Function as PropType<Props.FormatParams>,
    required: false,
    default: (params: any) => params,
    description: '自訂送出的api格式'
  },
  formatExcel: {
    type: Function as PropType<Props.FormatExcel>,
    required: false,
    default: (row: any) => row,
    description: '自訂Excel資料格式'
  },
  formatTable: {
    type: Function as PropType<Props.FormatTable>,
    required: false,
    default: (row: any) => row,
    description: '自訂Table資料格式'
  },
  formatSorting: {
    type: Function as PropType<Props.FormatSorting>,
    required: false,
    default: (row: any) => row,
    description: '自訂SortingMap資料格式'
  },
  useFakeData: {
    type: Boolean as PropType<Props.UseFakeData>,
    required: false,
    default: false,
    description: `
      是否使用fakeData假資料
      如果為true則不送出API responseData會使用fakeData
    `
  },
  fakeData: {
    type: Array as PropType<Props.FakeData>,
    required: false,
    default() {
      return []
    },
    description: '替代實際API輸出資料的假資料'
  },
  isMountedInit: {
    type: Boolean as PropType<Props.IsMountedInit>,
    required: false,
    default: true,
    description: '是否在 onMounted 初始化'
  },
  //Custom Download Excel
  downloadExcel: {
    type: Function as PropType<Props.DownloadExcel>,
    required: false,
    default: null,
    description: `
      取代downloadExcel的特製表格下載方式
      ex: 子欄位、合併……
    `
  },
  isHiddenPrepend: {
    type: Boolean as PropType<Props.IsHiddenPrepend>,
    required: false,
    default: false,
    description: '是否在 隱藏 slot #prepend'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
