import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'

import { fakeTableData } from './fakeData'

export interface Params {
  machineNo: string
  machineArea: string
  count: string
  machineStatus: string
}

interface CommonData {
  machineNo: string
  machineArea: string
  count: string
  machineStatus: string
}
export interface FilterData extends CommonData {}
export interface ResponseData extends CommonData {}
export interface TableData extends CommonData {}
export interface ExcelData extends CommonData {}

const formatParams = (params: any): Params => {
  const {
    machineNo = '',
    machineArea = '',
    count = '',
    machineStatus = ''
  } = params

  return {
    machineNo,
    machineArea,
    count,
    machineStatus
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
export const getExcelData = async (params: any): Promise<TableData[]> => {
  return getData(
    (row) => {
      const {
        machineNo = '',
        machineArea = '',
        count = '',
        machineStatus = ''
      } = row

      return {
        machineNo,
        machineArea,
        count,
        machineStatus
      }
    },
    { ...params }
  )
}

// table
export const getTableData = async (params: any): Promise<TableData[]> => {
  return getData(
    (row) => {
      const {
        machineNo = '',
        machineArea = '',
        count = '',
        machineStatus = ''
      } = row

      return {
        machineNo,
        machineArea,
        count,
        machineStatus
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
