import type { Api, ViewParams } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { message, isEmpty } from '@/lib/lib_utils'

export interface Params extends ViewParams {
  [key: string]: any
}

type CommonData = Record<string, any>
export type ResponseData = CommonData
export type FilterData = CommonData
export type TableData = CommonData
export type ExcelData = CommonData
export type ResponseTableData = [Array<TableData>, number]

export type FormatExcel = (row: any) => any
export type FormatTable = (row: any) => any
export type FormatSorting = (row: any) => any
export type FakeData = Array<any>

export type UrlParams = {
  baseURL?: string
  url: string
}

// 通用api url
export const webViewUrl = '/api/ipaspTable/retrieveIpaspTableFromView'

export const getUrlParams = (params: UrlParams) => {
  const { url = webViewUrl, baseURL = '' } = params

  if (!isEmpty(baseURL)) return { url, baseURL }
  return { url }
}

export const getWebViewParams = (params: ViewParams, isWebView: boolean) => {
  const { webfuno = '', funoviewsuffix = '', designatedview = '' } = params

  // 不是 view 不給參數
  if (!isWebView) return {}

  // view 後端指定參數
  if (isEmpty(webfuno) && isEmpty(designatedview)) {
    message({
      type: 'error',
      message: 'webfuno and designatedview is empty',
      duration: 10000
    })
    return {}
  }

  if (!isEmpty(designatedview)) return { designatedview }
  return { webfuno, funoviewsuffix }
}

const getData = async (
  callback: (row: ResponseData) => TableData,
  params: any,
  fakeData: FakeData,
  isFakeData: boolean,
  url: UrlParams
): Promise<ResponseTableData> => {
  const resData = await ajax<Api<ResponseData[]>>(
    {
      ...url,
      method: 'post',
      data: { ...params }
    },
    {
      isFakeData,
      fakeData: {
        data: fakeData,
        size: fakeData.length,
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, size: dataSize, status, msg } = resData

  if (status === 'success') {
    return [(data as any[]).map(callback), dataSize]
  } else {
    message({
      type: 'error',
      message: msg ?? (status ?? 'api error'),
      duration: 10000
    })
    return [[], 0]
  }
}

// excel
export const getExcelData = async (
  params: any,
  formatExcel: FormatExcel,
  fakeData: FakeData,
  isFakeData: boolean,
  url: UrlParams
): Promise<ExcelData[]> => {
  const [excelData] = await getData(formatExcel, params, fakeData, isFakeData, url)
  return excelData
}

// table
export const getTableData = async (
  params: any,
  formatTable: FormatTable,
  fakeData: FakeData,
  isFakeData: boolean,
  url: UrlParams
): Promise<ResponseTableData> => {
  const [tableData, tableDataCount] = await getData(formatTable, params, fakeData, isFakeData, url)
  return [tableData, tableDataCount]
}
