import type { Api } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal, cutTableData } from '@/lib/lib_utils' // 工具
import type { CustomTableTypes } from '@/components' // 系統組件

import { fakeData } from './fakeData'

export type Params = {
  page: number
  size: number
  sort?: CustomTableTypes.Sort
  sortingList?: CustomTableTypes.SortingList
  sortingMap?: CustomTableTypes.SortingMap
}

export type TableData = {
  id: number
  name: string
  username: string
  email: string
  address: Record<string, any>
  phone: string
  website: string
  company: Record<string, string>
}

export const fakeTableData: TableData[] = fakeData

// excel
export const getExcelData = async (params: any) => {
  const {
    page = 1,
    size = 100,
    sort = {
      key: null,
      order: null
    }
  } = params as Params

  const resData = await ajax<Api<TableData[]>>(
    {
      url: '/page/getData',
      method: 'get',
      data: {
        page,
        size,
        sort
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
    return data
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

// table
export const getData = async (params: any) => {
  const {
    page = 1,
    size = 100,
    sort = {
      key: null,
      order: null
    }
  } = params as Params

  const resData = await ajax<Api<TableData[]>>(
    {
      url: '/page/getData',
      method: 'get',
      data: {
        page,
        size,
        sort
      }
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeTableData,
        status: 'success'
      },
      delay: 300,
      callback(config, fakeData) {
        const { data: tempData, status } = fakeData
        const { page, size } = config.data

        return {
          data: cutTableData(page, size, tempData),
          status
        }
      }
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

    return []
  }
}

export const getDataCount = async () => {
  const resData = await ajax<Api<number>>(
    {
      url: '/page/getDataCount',
      method: 'get',
      data: {}
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeData.length,
        status: 'success'
      },
      delay: 300,
      callback(config, fakeData) {
        const { data: tempData, status } = fakeData

        return {
          data: tempData,
          status
        }
      }
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
