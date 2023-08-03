import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal, cutTableData } from '@/lib/lib_utils'
import type { Sort } from '@/components'
import { fakeData } from './fakeData'

export type Params = {
  page: number
  size: number
  sort: Sort

  userId: number
  id: number
  title: string
  completed: '' | '0' | '1'
}

export type TableData = {
  userId: number
  id: number
  title: string
  completed: boolean
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

  const resData = await ajax<Api<TableData[]>>({
    url: '/page/getData',
    method: 'get',
    data: {
      page,
      size,
      sort
    }
  }, {
    getFakeData: true,
    fakeData: {
      data: fakeTableData,
      status: 'success'
    },
    delay: 300
  })

  const { data, status } = resData

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
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
    },
    userId = null,
    id = null,
    title = null,
    completed = null
  } = params as Params

  const filterMap = {
    userId (data: number) {
      if (userId === null) return true
      return data === userId
    },
    id (data: number) {
      if (id === null) return true
      return data === id
    },
    title (data: string) {
      if (title === null) return true
      const regexp = new RegExp(title)
      return regexp.test(data)
    },
    completed (data: boolean) {
      if (completed === null) return true
      switch (completed) {
        case '1': return data
        case '0': return !data
        default: return true
      }
    }
  }

  const resData = await ajax<Api<TableData[]>>({
    url: '/page/getData',
    method: 'get',
    data: {
      page,
      size,
      sort
    }
  }, {
    getFakeData: true,
    fakeData: {
      data: fakeTableData,
      status: 'success'
    },
    delay: 300,
    callback (config, fakeData) {
      const { data, status } = fakeData
      const { page, size } = config.data

      const tempData = data.filter(item => {
        return (filterMap as any).$every((filterFun, filterKey) => {
          const data = item[filterKey]
          return filterFun(data)
        })
      })

      return {
        data: cutTableData(page, size, tempData),
        status
      }
    }
  })

  const { data, status } = resData

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
    })

    return []
  }
}

export const getDataCount = async (params: any) => {
  const {
    userId = null,
    id = null,
    title = null,
    completed = null
  } = params as Params

  const filterMap = {
    userId (data: number) {
      if (userId === null) return true
      return data === userId
    },
    id (data: number) {
      if (id === null) return true
      return data === id
    },
    title (data: string) {
      if (title === null) return true
      const regexp = new RegExp(title)
      return regexp.test(data)
    },
    completed (data: boolean) {
      if (completed === null) return true
      switch (completed) {
        case '1': return data
        case '0': return !data
        default: return true
      }
    }
  }

  const resData = await ajax<Api<number>>({
    url: '/page/getDataCount',
    method: 'get',
    data: {}
  }, {
    getFakeData: true,
    fakeData: {
      data: fakeData.length,
      status: 'success'
    },
    delay: 300,
    callback (config, fakeData) {
      const { status } = fakeData

      const tempData = fakeTableData.filter(item => {
        return (filterMap as any).$every((filterFun, filterKey) => {
          const data = item[filterKey]
          return filterFun(data)
        })
      })

      return {
        data: tempData.length,
        status
      }
    }
  })

  const { data, status } = resData

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
    })

    return 0
  }
}
