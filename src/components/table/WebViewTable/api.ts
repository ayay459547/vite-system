import type { Api, ViewParams } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { message, isEmpty, tipLog } from '@/lib/lib_utils' // 工具

import type { Types, Props } from './WebViewTableInfo'

// 通用api url
export const webViewUrl = '/api/ipaspTable/retrieveIpaspTableFromView'
// 進階搜尋可用選項
export const webViewUrlOperator = '/api/ipaspTable/retrieveColumnOperatorFromView'

export const getUrlParams = (params: Types.UrlParams) => {
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
    tipLog('WebViewTable', [
      'getWebViewParams: webfuno  designatedview 都為空值',
      params,
      `isWebView: ${isWebView}`
    ])
    return {}
  }

  if (!isEmpty(designatedview)) return { designatedview }
  return { webfuno, funoviewsuffix }
}

const getData = async (
  callback: (row: Types.ResponseData) => Types.TableData,
  params: any,
  fakeData: Props.FakeData,
  isFakeData: boolean,
  isLog: boolean,
  url: Types.UrlParams
): Promise<Types.ResponseTableData> => {
  const resData = await ajax<Api<Array<Types.ResponseData>>>(
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
      isLog,
      delay: 300
    }
  )
  const {
    data, size: dataSize, status,
    msg, message: _message, errorMsg
  } = resData

  if (status === 'success') {
    return [(data as any[]).map(callback), dataSize]
  } else {
    message({
      type: 'error',
      message: msg ?? _message ?? errorMsg ?? 'WebView getData Error',
      duration: 10000
    })
    return [[], 0]
  }
}

// excel
export const getExcelData = async (
  params: any,
  formatExcel: Props.FormatExcel,
  fakeData: Props.FakeData,
  isFakeData: boolean,
  isLog: boolean,
  url: Types.UrlParams
): Promise<Array<Types.ExcelData>> => {
  const [excelData] = await getData(formatExcel, params, fakeData, isFakeData, isLog, url)
  return excelData
}

// table
export const getTableData = async (
  params: any,
  formatTable: Props.FormatTable,
  fakeData: Props.FakeData,
  isFakeData: boolean,
  isLog: boolean,
  url: Types.UrlParams
): Promise<Types.ResponseTableData> => {
  const [tableData, tableDataCount] = await getData(formatTable, params, fakeData, isFakeData, isLog, url)
  return [tableData, tableDataCount]
}

// 進階搜尋可用選項
export const getColumnOperator = async (params: any, url: Types.UrlParams) => {
  const resData = await ajax<Api<any>>(
    {
      ...url,
      method: 'post',
      data: { ...params }
    },
    {
      isFakeData: false,
      fakeData: {
        data: {
          machineId: [
            'LessThanOrEqualTo',
            'NotIn',
            'IsNull'
          ]
        },
        status: 'success'
      },
      isLog: false,
      delay: 300
    }
  )
  const { data, status, msg, message: _message, errorMsg } = resData

  if (status === 'success') {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? _message ?? errorMsg ?? 'WebView getColumnOperator Error',
      duration: 10000
    })
    return {}
  }
}