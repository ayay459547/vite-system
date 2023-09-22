import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'
import type { Sort } from '@/components'

export type Params = {
  page: number
  size: number
  sort: Sort
}

export type TableData = {
  id?: number
  date: string
  name: string
  address?: string
  state?: string
  city?: string
  children?: Array<TableData>
}

export const fakeTableData: TableData[] = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    state: 'success',
    city: 'city1'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Caleb',
    address: 'No. 189, Grove St, Los Angeles',
    state: 'success',
    city: 'city1',
    children: [
      {
        id: 21,
        date: '2016-05-02',
        name: 'Caleb2',
        address: 'No. 189, Grove St, Los Angeles',
        state: 'success',
        city: 'city1'
      },
      {
        id: 22,
        date: '2016-05-02',
        name: 'Caleb3',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ]
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Peter',
    address: 'No. 189, Grove St, Los Angeles',
    state: 'success',
    city: 'city1'
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Amy',
    address: 'address-1'
  }
]

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

    return []
  }
}

export const getDataCount = async () => {
  const resData = await ajax<Api<number>>({
    url: '/page/getDataCount',
    method: 'get',
    data: {}
  }, {
    getFakeData: true,
    fakeData: {
      data: 1000,
      status: 'success'
    },
    delay: 300
  })

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

// delet
export const deleteData = async (rowData: TableData) => {
  await new Promise((resolve) => {
    console.log('delete id => ', rowData.id)

    setTimeout(() => {
      resolve('delete success')
    }, 1000)
  })
}