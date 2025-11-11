import type { Api } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import { message } from '@/lib/lib_utils' // 工具
import type { CustomTableTypes } from '@/components' // 系統組件

export type Params = {
  page: number
  size: number
  sort?: CustomTableTypes.Sort
  sortingList?: CustomTableTypes.SortingList
  sortingMap?: CustomTableTypes.SortingMap
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
    message({
      type: 'error',
      message: msg ?? 'getData Error',
      duration: 10000
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
      delay: 300
    }
  )

  const { status, msg, data } = resData

  if (status === 'success') {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'getData Error',
      duration: 10000
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
    message({
      type: 'error',
      message: msg ?? 'getData Error',
      duration: 10000
    })

    return 0
  }
}

// delet
export const deleteData = async (rowData: TableData) => {
  await new Promise(resolve => {
    console.log('delete id => ', rowData.id)

    setTimeout(() => {
      resolve('delete success')
    }, 1000)
  })
}
