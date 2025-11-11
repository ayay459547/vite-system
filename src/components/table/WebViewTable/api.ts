import type { ViewParams } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import { message, isEmpty, tipLog } from '@/lib/lib_utils' // 工具

import type { Types, Props } from './WebViewTableInfo'

// 通用api url
export const webViewUrl = '/api/ipaspTable/retrieveIpaspTableFromView'
// 進階搜尋可用選項
export const webViewUrlOperator = '/api/ipaspTable/retrieveColumnOperatorFromView'

export const getUrlParams = (params: Types['urlParams']) => {
  const { baseURL = '', url = webViewUrl } = params

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
  url: Types['urlParams'],
  params: any,
  callback: (row: Types['responseData']) => Types['tableData'],
  ajaxOptions: {
    isFakeData: Props['useFakeData'],
    fakeDataPath: Props['fakeDataPath'],
    fakeData: Props['fakeData'],
    isLog: Props['isLog']
  }
): Promise<Types['responseTableData']> => {
  const { isFakeData, fakeDataPath, fakeData, isLog } = ajaxOptions

  const resData = await ajax<Array<Types['responseData']>>(
    {
      ...url,
      method: 'post',
      data: { ...params }
    },
    {
      isFakeData,
      fakeDataPath,
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
    data,
    size: dataSize,
    status,
    msg
  } = resData

  if (status === 'success') {
    return [(data as any[]).map(callback), dataSize]
  } else {
    message({
      type: 'error',
      message: msg ?? 'WebView getData Error',
      duration: 10000
    })
    return [[], 0]
  }
}

// excel
export const getExcelData = async (
  url: Types['urlParams'],
  params: any,
  formatExcel: Props['formatExcel'],
  ajaxOptions: {
    isFakeData: Props['useFakeData'],
    fakeDataPath: Props['fakeDataPath'],
    fakeData: Props['fakeData'],
    isLog: Props['isLog']
  }
): Promise<Array<Types['excelData']>> => {
  const [excelData] = await getData(url, params, formatExcel, ajaxOptions)
  return excelData
}

// table
export const getTableData = async (
  url: Types['urlParams'],
  params: any,
  formatTable: Props['formatTable'],
  ajaxOptions: {
    isFakeData: Props['useFakeData'],
    fakeDataPath: Props['fakeDataPath'],
    fakeData: Props['fakeData'],
    isLog: Props['isLog']
  }
): Promise<Types['responseTableData']> => {
  const [tableData, tableDataCount] = await getData(url, params, formatTable, ajaxOptions)
  return [tableData, tableDataCount]
}

// 進階搜尋可用選項
export const getColumnOperator = async (
  params: any,
  isFakeData: boolean,
  isLog: boolean,
  url: Types['urlParams']
) => {
  const resData = await ajax<any>(
    {
      ...url,
      method: 'post',
      data: { ...params }
    },
    {
      isFakeData,
      isLog,
      fakeData: {
        data: {},
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (status === 'success') {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'WebView getColumnOperator Error',
      duration: 10000
    })
    return {}
  }
}
