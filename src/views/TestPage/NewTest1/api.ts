import type { Api } from '@/declare/ajax.ts'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'

import { fakeTableData } from './fakeData'

export type ResponseData = {
  column1: string
  column2: string
  column3: string
  column4: string
  column5: string
}

export type TableData = {
  column1: string
  column2: string
  column3: string
  column4: string
  column5: string
}

const getData = async (
  callback: (row: ResponseData) => TableData,
  params: any
): Promise<TableData[]> => {
  const { page = 1, size = 100 } = params

  const resData = await ajax<Api<ResponseData[]>>(
    {
      url: '/new/test',
      method: 'post',
      data: {
        page,
        size
      }
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
  const { status, msg, data } = resData

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

export const getExcelData = async (params: any): Promise<TableData[]> => {
  return getData(
    row => {
      const { column1, column2, column3, column4, column5 } = row

      return {
        column1,
        column2,
        column3,
        column4,
        column5
      }
    },
    { ...params }
  )
}

export const getTableData = async (params: any): Promise<TableData[]> => {
  return getData(
    row => {
      const { column1, column2, column3, column4, column5 } = row

      return {
        column1,
        column2,
        column3,
        column4,
        column5
      }
    },
    { ...params }
  )
}

export const getTableDataCount = async (params: any): Promise<number> => {
  const {
    custName = '',
    custId = '',
    productGroupId = '',
    custProductId = '',
    productName = ''
  } = params

  const resData = await ajax<Api<number>>(
    {
      url: '/Cust2InternalProduct/getDataSizeByFilter',
      method: 'post',
      data: {
        custName,
        custId,
        productGroupId,
        custProductId,
        productName
      }
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
  const { status, msg, data } = resData

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

// delete
export const deleteData = async (rowData: TableData): Promise<string | boolean> => {
  const { column1, column2, column3, column4, column5 } = rowData

  const resData = await ajax<Api<any>>(
    {
      url: '/api/delete',
      method: 'delete',
      data: {
        column1,
        column2,
        column3,
        column4,
        column5
      }
    },
    {
      isFakeData: true,
      fakeData: {
        data: null,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg } = resData

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '刪除資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
  }

  return status
}
