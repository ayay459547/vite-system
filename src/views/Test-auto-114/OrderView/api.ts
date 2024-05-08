import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'

import { fakeTableData } from './fakeData'
import { columnSetting } from './columns'

export interface Params {
  orderId: string
  demandDate: string
  routeId: string
  isSettingsRushOrder: string
}

interface CommonData {
  orderId: string
  demandDate: string
  routeId: string
}
export interface FilterData extends CommonData {
  isSettingsRushOrder: string
}
export interface ResponseData extends CommonData {
  isSettingsRushOrder: boolean
}
export interface ExcelData extends CommonData {
  isSettingsRushOrder: string
}
export interface TableData extends CommonData {
  isSettingsRushOrder: string
}

const formatParams = (params: any): Params => {
  const { orderId = '', demandDate = '', routeId = '', isSettingsRushOrder = '' } = params

  return {
    orderId,
    demandDate,
    routeId,
    isSettingsRushOrder
  }
}

const getData = async (
  callback: (row: ResponseData) => TableData,
  params: any
): Promise<TableData[]> => {
  const {
    page = 1,
    size = 100,
    // sort = { key: null, order: null },
    // sortingList = [],
    sortingMap = {}
  } = params

  const resData = await ajax<Api<ResponseData[]>>(
    {
      url: '/api/getOrder',
      method: 'post',
      data: {
        ...formatParams(params),
        page,
        size,
        sortingMap
      } as Params
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeTableData,
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (status === 'success') {
    return (data as ResponseData[]).map(callback)
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return []
  }
}

// excel
export const getExcelData = async (params: any): Promise<ExcelData[]> => {
  return getData(
    row => {
      const { orderId = '', demandDate = '', routeId = '', isSettingsRushOrder = false } = row

      return {
        orderId,
        demandDate,
        routeId,
        isSettingsRushOrder: columnSetting.isSettingsRushOrder.getValue(isSettingsRushOrder)
      }
    },
    { ...params }
  )
}

// table
export const getTableData = async (params: any): Promise<TableData[]> => {
  return getData(
    row => {
      const { orderId = '', demandDate = '', routeId = '', isSettingsRushOrder = false } = row

      return {
        orderId,
        demandDate,
        routeId,
        isSettingsRushOrder: columnSetting.isSettingsRushOrder.getValue(isSettingsRushOrder)
      }
    },
    { ...params }
  )
}

export const getTableDataCount = async (params: any): Promise<number> => {
  const resData = await ajax<Api<number>>(
    {
      url: '/api/getTableDataCount',
      method: 'post',
      data: {
        ...formatParams(params)
      } as Params
    },
    {
      isFakeData: true,
      fakeData: {
        data: 1000,
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return 0
  }
}
